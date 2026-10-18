import { Job } from '../models/Job.js';
import { JobSource } from '../models/JobSource.js';
import { SyncRun } from '../models/SyncRun.js';
import { isDatabaseConnected } from '../config/database.js';
import { config } from '../config/env.js';

// Connectors
import { PakistanCuratedConnector } from './jobConnectors/pakistanCuratedConnector.js';
import { SystemsLimitedConnector } from './jobConnectors/systemsLimitedConnector.js';
import { TenPearlsConnector } from './jobConnectors/tenPearlsConnector.js';
import { NetsolConnector } from './jobConnectors/netsolConnector.js';
import { ContourConnector } from './jobConnectors/contourConnector.js';
import { FintechBanksConnector } from './jobConnectors/fintechBanksConnector.js';
import { NjpGovPkConnector } from './jobConnectors/njpGovPkConnector.js';
import { RemotePkFeedConnector } from './jobConnectors/remotePkFeedConnector.js';
import { RssFeedConnector } from './jobConnectors/rssFeedConnector.js';

import { INITIAL_JOB_SOURCES, INITIAL_PAKISTAN_JOBS } from '../data/pakistanJobsData.js';
import { isDuplicateJob, generateJobContentHash } from '../utils/jobHasher.js';

// In-memory fallback caches when MongoDB is offline
let memoryJobsCache = [...INITIAL_PAKISTAN_JOBS];
let memorySourcesCache = [...INITIAL_JOB_SOURCES];
let memorySyncRuns = [];

// Concurrency lock with self-healing timeout (prevents overlapping syncs)
let isSyncInProgress = false;
let syncStartedAt = 0;
const SYNC_LOCK_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export class JobSyncService {
  static _schedulerInterval = null;
  static _schedulerStarted = false;

  /**
   * Initializes source registry if empty and synchronizes metadata
   */
  static async ensureSourcesRegistered() {
    if (!isDatabaseConnected()) {
      return memorySourcesCache;
    }

    try {
      for (const src of INITIAL_JOB_SOURCES) {
        const existing = await JobSource.findOne({ sourceId: src.sourceId });
        if (!existing) {
          await JobSource.create(src);
        } else {
          existing.name = src.name;
          if (src.officialCareersUrl) existing.officialCareersUrl = src.officialCareersUrl;
          if (src.integrationMethod) existing.integrationMethod = src.integrationMethod;
          existing.isAutomated = Boolean(src.isAutomated);
          existing.supportedCategories = src.supportedCategories || existing.supportedCategories;
          existing.supportedLocations = src.supportedLocations || existing.supportedLocations;
          await existing.save();
        }
      }
      return await JobSource.find();
    } catch (err) {
      console.warn('[JobSync] Error ensuring job sources in MongoDB:', err.message);
      return memorySourcesCache;
    }
  }

  /**
   * Gets list of all available active connectors
   */
  static getConnectors() {
    return [
      new SystemsLimitedConnector(),
      new TenPearlsConnector(),
      new NetsolConnector(),
      new ContourConnector(),
      new FintechBanksConnector(),
      new NjpGovPkConnector(),
      new RemotePkFeedConnector(),
      new RssFeedConnector(),
      new PakistanCuratedConnector(),
    ];
  }

  /**
   * Runs synchronization across all enabled connectors
   */
  static async syncAllSources(triggerType = 'scheduled') {
    // Check if lock has expired (self-healing deadlock prevention)
    if (isSyncInProgress) {
      if (Date.now() - syncStartedAt < SYNC_LOCK_TIMEOUT_MS) {
        return {
          success: false,
          message: 'Job synchronization already in progress (concurrency lock active)',
        };
      } else {
        console.warn('[JobSync] Previous sync exceeded timeout; releasing lock automatically.');
      }
    }

    isSyncInProgress = true;
    syncStartedAt = Date.now();
    const startTime = Date.now();
    const results = [];
    let totalNew = 0;
    let totalUpdated = 0;
    let totalSkipped = 0;

    try {
      await this.ensureSourcesRegistered();
      const connectors = this.getConnectors();

      for (const connector of connectors) {
        const runId = `run_${Date.now()}_${connector.sourceId}`;
        const sourceStartTime = Date.now();

        // 1. Record initial SyncRun
        await this.recordSyncRun({
          runId,
          sourceId: connector.sourceId,
          sourceName: connector.name,
          startedAt: new Date(sourceStartTime),
          status: 'running',
          triggerType,
        });

        // 2. Execute sync with retry and rate limiting
        const syncResult = await connector.sync();
        results.push(syncResult);

        if (!syncResult.success) {
          // Temporary failure rule: Do NOT expire existing jobs on network/API failure!
          await this.updateSourceStatus(connector.sourceId, 'warning', syncResult.error);
          await this.recordSyncRun({
            runId,
            sourceId: connector.sourceId,
            sourceName: connector.name,
            startedAt: new Date(sourceStartTime),
            finishedAt: new Date(),
            durationMs: Date.now() - sourceStartTime,
            status: 'failed',
            triggerType,
            errorSummary: syncResult.error,
          });
          continue;
        }

        // 3. Ingest normalized jobs with deduplication
        const stats = await this.ingestJobs(syncResult.sourceId, syncResult.jobs);
        totalNew += stats.inserted;
        totalUpdated += stats.updated;
        totalSkipped += stats.duplicates;

        // 4. Update source health and persistent sync run
        await this.updateSourceStatus(
          connector.sourceId,
          'healthy',
          null,
          stats.inserted + stats.updated
        );

        await this.recordSyncRun({
          runId,
          sourceId: connector.sourceId,
          sourceName: connector.name,
          startedAt: new Date(sourceStartTime),
          finishedAt: new Date(),
          durationMs: Date.now() - sourceStartTime,
          status: 'success',
          triggerType,
          jobsDiscovered: syncResult.jobs.length,
          jobsInserted: stats.inserted,
          jobsUpdated: stats.updated,
          jobsSkipped: stats.duplicates,
          lastSuccessfulSync: new Date(),
        });
      }

      // 5. Safe expiration passes
      const expiredDeadlines = await this.checkAndExpireDeadlines();
      const expiredStale = await this.expireStaleJobs(config.jobSync.stalenessDays || 30);

      return {
        success: true,
        durationMs: Date.now() - startTime,
        totalNew,
        totalUpdated,
        totalDuplicates: totalSkipped,
        totalExpired: expiredDeadlines + expiredStale,
        sourceResults: results,
      };
    } finally {
      isSyncInProgress = false;
    }
  }

  /**
   * Runs synchronization for a specific single source
   */
  static async syncSource(sourceId, triggerType = 'manual') {
    const connectors = this.getConnectors();
    const connector = connectors.find((c) => c.sourceId === sourceId);

    if (!connector) {
      throw new Error(`Connector for source [${sourceId}] not found in registry`);
    }

    const runId = `run_${Date.now()}_${connector.sourceId}`;
    const sourceStartTime = Date.now();

    await this.recordSyncRun({
      runId,
      sourceId: connector.sourceId,
      sourceName: connector.name,
      startedAt: new Date(sourceStartTime),
      status: 'running',
      triggerType,
    });

    const syncResult = await connector.sync();

    if (!syncResult.success) {
      await this.updateSourceStatus(connector.sourceId, 'warning', syncResult.error);
      await this.recordSyncRun({
        runId,
        sourceId: connector.sourceId,
        sourceName: connector.name,
        startedAt: new Date(sourceStartTime),
        finishedAt: new Date(),
        durationMs: Date.now() - sourceStartTime,
        status: 'failed',
        triggerType,
        errorSummary: syncResult.error,
      });
      return { success: false, error: syncResult.error };
    }

    const stats = await this.ingestJobs(syncResult.sourceId, syncResult.jobs);
    await this.updateSourceStatus(connector.sourceId, 'healthy', null, stats.inserted + stats.updated);

    await this.recordSyncRun({
      runId,
      sourceId: connector.sourceId,
      sourceName: connector.name,
      startedAt: new Date(sourceStartTime),
      finishedAt: new Date(),
      durationMs: Date.now() - sourceStartTime,
      status: 'success',
      triggerType,
      jobsDiscovered: syncResult.jobs.length,
      jobsInserted: stats.inserted,
      jobsUpdated: stats.updated,
      jobsSkipped: stats.duplicates,
      lastSuccessfulSync: new Date(),
    });

    return {
      success: true,
      sourceId,
      stats,
      durationMs: Date.now() - sourceStartTime,
    };
  }

  /**
   * Ingests, deduplicates, and saves normalized jobs
   * Preserves saved-job and user application references on updates.
   */
  static async ingestJobs(sourceId, jobs) {
    let inserted = 0;
    let updated = 0;
    let duplicates = 0;

    if (!isDatabaseConnected()) {
      // In-memory mode
      for (const job of jobs) {
        const existingIdx = memoryJobsCache.findIndex(
          (j) => j.contentHash === job.contentHash || isDuplicateJob(j, job)
        );

        if (existingIdx !== -1) {
          // Update existing while preserving ID and created date
          memoryJobsCache[existingIdx] = {
            ...memoryJobsCache[existingIdx],
            ...job,
            _id: memoryJobsCache[existingIdx]._id || memoryJobsCache[existingIdx].id,
            firstSeenAt: memoryJobsCache[existingIdx].firstSeenAt || new Date(),
            lastSeenAt: new Date(),
            lastVerifiedAt: new Date(),
          };
          updated++;
        } else {
          memoryJobsCache.unshift({
            ...job,
            _id: 'job_' + Date.now() + Math.random().toString(36).substring(2, 7),
            firstSeenAt: new Date(),
            lastSeenAt: new Date(),
            lastVerifiedAt: new Date(),
          });
          inserted++;
        }
      }
      return { inserted, updated, duplicates };
    }

    // MongoDB mode with atomic deduplication
    for (const jobData of jobs) {
      try {
        const existing = await Job.findOne({
          $or: [
            { contentHash: jobData.contentHash },
            { sourceId: jobData.sourceId, sourceJobId: jobData.sourceJobId },
          ],
        });

        if (existing) {
          // Update freshness without breaking ID references
          existing.lastSeenAt = new Date();
          existing.lastVerifiedAt = new Date();
          existing.status = jobData.status || 'Active';
          if (jobData.salaryMin) existing.salaryMin = jobData.salaryMin;
          if (jobData.salaryMax) existing.salaryMax = jobData.salaryMax;
          if (jobData.applicationDeadline) existing.applicationDeadline = jobData.applicationDeadline;
          if (jobData.verificationBadge) existing.verificationBadge = jobData.verificationBadge;
          if (jobData.dataProvenance) existing.dataProvenance = jobData.dataProvenance;
          await existing.save();
          updated++;
        } else {
          // Check fuzzy duplicate before creating
          const fuzzyDup = await Job.findOne({
            companyName: jobData.companyName,
            title: jobData.title,
            locationCity: jobData.locationCity,
          });

          if (fuzzyDup) {
            fuzzyDup.lastSeenAt = new Date();
            fuzzyDup.lastVerifiedAt = new Date();
            if (jobData.applicationDeadline) fuzzyDup.applicationDeadline = jobData.applicationDeadline;
            await fuzzyDup.save();
            duplicates++;
          } else {
            await Job.create({
              ...jobData,
              firstSeenAt: new Date(),
              lastSeenAt: new Date(),
              lastVerifiedAt: new Date(),
            });
            inserted++;
          }
        }
      } catch (saveErr) {
        console.warn(`[JobSync] Error saving job [${jobData.title}]:`, saveErr.message);
      }
    }

    return { inserted, updated, duplicates };
  }

  /**
   * Updates source registry metadata
   */
  static async updateSourceStatus(sourceId, status, error = null, activeJobs = 0) {
    if (!isDatabaseConnected()) {
      const src = memorySourcesCache.find((s) => s.sourceId === sourceId);
      if (src) {
        src.status = status;
        src.lastSyncAttempt = new Date();
        if (status === 'healthy') {
          src.lastSuccessfulSync = new Date();
          src.lastError = null;
        }
        if (error) src.lastError = error;
        if (activeJobs > 0) src.activeJobsCount = activeJobs;
      }
      return;
    }

    try {
      const update = {
        status,
        lastSyncAttempt: new Date(),
      };
      if (status === 'healthy') {
        update.lastSuccessfulSync = new Date();
        update.lastError = null;
      }
      if (error) update.lastError = error;
      if (activeJobs > 0) update.$inc = { totalJobsIngested: activeJobs };

      await JobSource.findOneAndUpdate({ sourceId }, update, { upsert: true });
    } catch (err) {
      console.warn('[JobSync] Error updating JobSource in DB:', err.message);
    }
  }

  /**
   * Records or updates a persistent SyncRun document
   */
  static async recordSyncRun(runData) {
    if (!isDatabaseConnected()) {
      const existingIdx = memorySyncRuns.findIndex((r) => r.runId === runData.runId);
      if (existingIdx !== -1) {
        memorySyncRuns[existingIdx] = { ...memorySyncRuns[existingIdx], ...runData };
      } else {
        memorySyncRuns.unshift({
          ...runData,
          _id: 'sync_' + Date.now() + Math.random().toString(36).substring(2, 6),
        });
        if (memorySyncRuns.length > 200) {
          memorySyncRuns.pop();
        }
      }
      return;
    }

    try {
      await SyncRun.findOneAndUpdate(
        { runId: runData.runId },
        { $set: runData },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn('[JobSync] Error recording SyncRun in DB:', err.message);
    }
  }

  /**
   * Scans all vacancies and automatically marks them expired if application deadline has passed
   */
  static async checkAndExpireDeadlines() {
    const now = new Date();
    let expiredCount = 0;

    if (!isDatabaseConnected()) {
      for (const job of memoryJobsCache) {
        if (job.applicationDeadline && new Date(job.applicationDeadline) < now) {
          if (job.status !== 'Expired') {
            job.status = 'Expired';
            job.expiryReason = 'Application deadline passed';
            expiredCount++;
          }
        }
      }
      return expiredCount;
    }

    try {
      const result = await Job.updateMany(
        {
          applicationDeadline: { $lt: now, $ne: null },
          status: { $ne: 'Expired' },
        },
        {
          $set: { status: 'Expired', 'metadata.expiryReason': 'Application deadline passed' },
        }
      );
      return result.modifiedCount || 0;
    } catch (err) {
      console.warn('[JobSync] Error expiring past deadline jobs:', err.message);
      return 0;
    }
  }

  /**
   * Safe staleness expiration: If a job has not been re-verified by any connector
   * within `stalenessDays`, mark it 'Unverified' or 'Expired'.
   */
  static async expireStaleJobs(stalenessDays = 30) {
    const thresholdDate = new Date(Date.now() - stalenessDays * 24 * 60 * 60 * 1000);
    let staleCount = 0;

    if (!isDatabaseConnected()) {
      for (const job of memoryJobsCache) {
        if (job.status === 'Active' && job.lastVerifiedAt && new Date(job.lastVerifiedAt) < thresholdDate) {
          job.status = 'Unverified';
          job.verificationConfidence = 'Low';
          job.verificationBadge = 'unverified';
          staleCount++;
        }
      }
      return staleCount;
    }

    try {
      const result = await Job.updateMany(
        {
          status: 'Active',
          lastVerifiedAt: { $lt: thresholdDate },
          isManuallyAdded: { $ne: true }, // Preserve manually verified admin entries
        },
        {
          $set: {
            status: 'Unverified',
            verificationConfidence: 'Low',
            verificationBadge: 'unverified',
            'metadata.stalenessReason': `Not re-verified within ${stalenessDays} days staleness window`,
          },
        }
      );
      return result.modifiedCount || 0;
    } catch (err) {
      console.warn('[JobSync] Error expiring stale jobs:', err.message);
      return 0;
    }
  }

  /**
   * Background scheduler to periodically check deadlines and sync fresh jobs
   * Starts only once per application instance.
   */
  static startAutoScheduler(intervalMs = 3600000) {
    if (this._schedulerStarted) {
      console.log('[JobSync] Scheduler already active on this instance.');
      return;
    }

    this._schedulerStarted = true;

    // Optional controlled initial run on startup
    if (config.jobSync.initialRun) {
      setTimeout(async () => {
        try {
          console.log('[JobSync] Running initial startup synchronization...');
          await this.syncAllSources('startup');
        } catch (err) {
          console.warn('[JobSync Startup Sync Error]:', err.message);
        }
      }, 5000);
    }

    this._schedulerInterval = setInterval(async () => {
      try {
        await this.checkAndExpireDeadlines();
        await this.syncAllSources('scheduled');
      } catch (err) {
        console.warn('[JobSync Worker Error]:', err.message);
      }
    }, intervalMs);

    if (this._schedulerInterval && this._schedulerInterval.unref) {
      this._schedulerInterval.unref();
    }
  }

  /**
   * Graceful shutdown of scheduler interval
   */
  static stopAutoScheduler() {
    if (this._schedulerInterval) {
      clearInterval(this._schedulerInterval);
      this._schedulerInterval = null;
    }
    this._schedulerStarted = false;
    console.log('[JobSync] Auto-scheduler stopped cleanly.');
  }

  /**
   * Returns persistent sync run history with pagination
   */
  static async getSyncRuns({ page = 1, limit = 20, sourceId, status } = {}) {
    if (!isDatabaseConnected()) {
      let filtered = [...memorySyncRuns];
      if (sourceId) filtered = filtered.filter((r) => r.sourceId === sourceId);
      if (status) filtered = filtered.filter((r) => r.status === status);
      const total = filtered.length;
      const start = (page - 1) * limit;
      const items = filtered.slice(start, start + limit);
      return {
        runs: items,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit) || 1,
        },
      };
    }

    try {
      const query = {};
      if (sourceId) query.sourceId = sourceId;
      if (status) query.status = status;

      const total = await SyncRun.countDocuments(query);
      const runs = await SyncRun.find(query)
        .sort({ startedAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return {
        runs,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit) || 1,
        },
      };
    } catch (err) {
      console.warn('[JobSync] Error retrieving sync runs:', err.message);
      return { runs: [], pagination: { total: 0, page: 1, limit: 20, pages: 1 } };
    }
  }

  /**
   * Returns comprehensive health check of all registered job sources
   */
  static async getSourceHealth() {
    await this.ensureSourcesRegistered();

    if (!isDatabaseConnected()) {
      return memorySourcesCache.map((s) => ({
        sourceId: s.sourceId,
        name: s.name,
        sourceType: s.sourceType,
        officialCareersUrl: s.officialCareersUrl || s.baseUrl,
        isAutomated: Boolean(s.isAutomated),
        status: s.status || 'healthy',
        lastSuccessfulSync: s.lastSuccessfulSync || null,
        lastSyncAttempt: s.lastSyncAttempt || null,
        lastError: s.lastError || null,
        totalJobsIngested: s.totalJobsIngested || 0,
        activeJobsCount: memoryJobsCache.filter((j) => j.sourceId === s.sourceId && j.status === 'Active').length,
      }));
    }

    try {
      const sources = await JobSource.find().sort({ name: 1 });
      const counts = await Job.aggregate([
        { $match: { status: 'Active' } },
        { $group: { _id: '$sourceId', count: { $sum: 1 } } },
      ]);
      const countMap = counts.reduce((acc, c) => ({ ...acc, [c._id]: c.count }), {});

      return sources.map((s) => ({
        sourceId: s.sourceId,
        name: s.name,
        sourceType: s.sourceType,
        officialCareersUrl: s.officialCareersUrl || s.baseUrl,
        isAutomated: s.isAutomated,
        status: s.status,
        lastSuccessfulSync: s.lastSuccessfulSync,
        lastSyncAttempt: s.lastSyncAttempt,
        lastError: s.lastError,
        totalJobsIngested: s.totalJobsIngested,
        activeJobsCount: countMap[s.sourceId] || 0,
      }));
    } catch (err) {
      console.warn('[JobSync] Error getting source health from DB:', err.message);
      return memorySourcesCache;
    }
  }

  /**
   * Adds a verified job manually (e.g. from official career portal by Admin)
   */
  static async addManualJob(jobInput) {
    if (!jobInput.title || !jobInput.companyName || !jobInput.canonicalJobUrl || !jobInput.locationCity) {
      throw new Error('Title, company name, application URL, and city are required');
    }

    const sourceId = jobInput.sourceId || 'src_systems_ltd';
    let sourceName = jobInput.sourceName;
    if (!sourceName) {
      const src = INITIAL_JOB_SOURCES.find((s) => s.sourceId === sourceId);
      sourceName = src ? src.name : `${jobInput.companyName} Careers Portal`;
    }

    const requiredSkills = Array.isArray(jobInput.requiredSkills)
      ? jobInput.requiredSkills
      : typeof jobInput.requiredSkills === 'string'
      ? jobInput.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const preferredSkills = Array.isArray(jobInput.preferredSkills)
      ? jobInput.preferredSkills
      : typeof jobInput.preferredSkills === 'string'
      ? jobInput.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const newJob = {
      sourceId,
      sourceName,
      sourceJobId: jobInput.sourceJobId || `manual-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sourceUrl: jobInput.sourceUrl || jobInput.canonicalJobUrl,
      canonicalJobUrl: jobInput.canonicalJobUrl,
      title: jobInput.title.trim(),
      normalizedTitle: jobInput.title.trim().toLowerCase(),
      companyName: jobInput.companyName.trim(),
      companyWebsite: jobInput.companyWebsite || '',
      companyLogo: jobInput.companyLogo || '',
      description: jobInput.description || 'Verified job posting added via SkillPath AI Administrator Portal.',
      responsibilities: Array.isArray(jobInput.responsibilities) ? jobInput.responsibilities : [],
      requiredSkills,
      preferredSkills,
      minimumEducation: jobInput.minimumEducation || "Bachelor's Degree in CS/IT/SE",
      experienceMin: jobInput.experienceMin !== undefined ? Number(jobInput.experienceMin) : 0,
      experienceMax: jobInput.experienceMax !== undefined ? Number(jobInput.experienceMax) : 2,
      experienceLabel: jobInput.experienceLabel || 'Fresh Graduate to 1 Year',
      employmentType: jobInput.employmentType || 'Full-time',
      careerCategory: jobInput.careerCategory || 'Software Development',
      salaryMin: jobInput.salaryMin ? Number(jobInput.salaryMin) : null,
      salaryMax: jobInput.salaryMax ? Number(jobInput.salaryMax) : null,
      salaryCurrency: jobInput.salaryCurrency || 'PKR',
      salaryPeriod: jobInput.salaryPeriod || 'monthly',
      salaryDisclosureStatus: jobInput.salaryMin ? 'disclosed' : 'undisclosed',
      locationCity: jobInput.locationCity.trim(),
      locationProvince: jobInput.locationProvince || 'Pakistan',
      workArrangement: jobInput.workArrangement || 'Hybrid',
      eligibilityCountries: ['Pakistan'],
      isInternship: Boolean(jobInput.isInternship),
      internshipPaidStatus: jobInput.internshipPaidStatus || (jobInput.salaryMin ? 'Paid' : 'Undisclosed'),
      applicationDeadline: jobInput.applicationDeadline ? new Date(jobInput.applicationDeadline) : null,
      publishedAt: jobInput.publishedAt ? new Date(jobInput.publishedAt) : new Date(),
      firstSeenAt: new Date(),
      lastSeenAt: new Date(),
      lastVerifiedAt: new Date(),
      status: 'Active',
      verificationConfidence: 'High',
      verificationBadge: 'manual-entry',
      isManuallyAdded: true,
      dataProvenance: {
        connector: 'AdminManualPortal',
        sourceType: 'manual',
        ingestionMethod: 'Verified Admin Entry',
        fetchedAt: new Date(),
      },
    };

    newJob.contentHash = generateJobContentHash(newJob);

    // Save in DB or In-memory
    if (!isDatabaseConnected()) {
      const existing = memoryJobsCache.find(
        (j) => j.contentHash === newJob.contentHash || isDuplicateJob(j, newJob)
      );
      if (existing) {
        throw new Error('This job opportunity is already registered in the system (duplicate prevented)');
      }
      const savedJob = {
        ...newJob,
        _id: 'job_' + Date.now() + Math.random().toString(36).substring(2, 7),
      };
      memoryJobsCache.unshift(savedJob);
      await this.updateSourceStatus(sourceId, 'healthy', null, 1);
      return savedJob;
    }

    const existing = await Job.findOne({ contentHash: newJob.contentHash });
    if (existing) {
      throw new Error('This job opportunity is already registered in the database (duplicate prevented)');
    }

    const created = await Job.create(newJob);
    await this.updateSourceStatus(sourceId, 'healthy', null, 1);
    return created.toObject();
  }

  /**
   * Gets in-memory cache when running in offline mode with automatic deadline filtering
   */
  static getMemoryJobs() {
    this.checkAndExpireDeadlines();
    return memoryJobsCache;
  }

  static getMemorySources() {
    return memorySourcesCache;
  }
}
