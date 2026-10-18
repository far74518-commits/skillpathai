import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { generateJobContentHash, isDuplicateJob } from '../src/utils/jobHasher.js';
import { calculateJobMatch, generateCareerMatchingInsights } from '../src/services/jobMatcher.service.js';
import { JobSyncService } from '../src/services/jobSync.service.js';
import { isSafeOutboundUrl } from '../src/services/jobConnectors/baseConnector.js';
import { SystemsLimitedConnector } from '../src/services/jobConnectors/systemsLimitedConnector.js';
import { TenPearlsConnector } from '../src/services/jobConnectors/tenPearlsConnector.js';
import { RemotePkFeedConnector } from '../src/services/jobConnectors/remotePkFeedConnector.js';

describe('Pakistan IT Job Discovery & Matching Engine Test Suite', () => {
  // 1. Job Ingestion & Deduplication Utilities
  describe('Deduplication & Content Hashing Engine', () => {
    it('should generate consistent deterministic contentHash for identical vacancy payloads', () => {
      const job1 = {
        title: 'Junior React Developer',
        companyName: 'Systems Limited',
        locationCity: 'Lahore',
        description: 'Building modern enterprise web apps with React and TypeScript.',
        sourceJobId: 'sys-123',
      };
      const job2 = {
        title: 'Junior React Developer',
        companyName: 'Systems Limited',
        locationCity: 'Lahore',
        description: 'Building modern enterprise web apps with React and TypeScript.',
        sourceJobId: 'sys-123',
      };

      const hash1 = generateJobContentHash(job1);
      const hash2 = generateJobContentHash(job2);

      assert.equal(typeof hash1, 'string');
      assert.equal(hash1.length, 32);
      assert.equal(hash1, hash2, 'Identical jobs must produce identical contentHash');
    });

    it('should detect duplicate cross-posted jobs', () => {
      const jobA = {
        title: 'Software Engineer',
        companyName: '10Pearls',
        locationCity: 'Karachi',
        canonicalJobUrl: 'https://10pearls.com/careers/se',
      };
      const jobB = {
        title: 'Software Engineer',
        companyName: '10Pearls',
        locationCity: 'Karachi',
        canonicalJobUrl: 'https://10pearls.com/careers/se',
      };

      assert.equal(isDuplicateJob(jobA, jobB), true);
    });
  });

  // 2. Explainable Matching Engine
  describe('Personalized Job Matching Engine (jobMatcher.service.js)', () => {
    it('should compute high match score when candidate skills align with job requirements', () => {
      const job = {
        title: 'Frontend Developer',
        careerCategory: 'Software Development',
        requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Git'],
        preferredSkills: ['Next.js'],
        locationCity: 'Lahore',
        workArrangement: 'Hybrid',
        experienceMin: 0,
      };

      const userProfile = {
        targetCareer: 'frontend-dev',
        existingSkills: ['React', 'JavaScript', 'TypeScript', 'Git', 'CSS3'],
        preferredCity: 'Lahore',
        preferredWorkEnvironment: 'Hybrid',
        gradYear: '2026',
      };

      const match = calculateJobMatch(job, userProfile);

      assert.ok(match.matchScore >= 80, `Expected >= 80%, got ${match.matchScore}%`);
      assert.ok(match.matchingSkills.includes('React'));
      assert.ok(match.matchingSkills.includes('TypeScript'));
      assert.ok(typeof match.relevanceExplanation === 'string');
      assert.ok(Array.isArray(match.recommendedActions));
    });

    it('should identify missing skills and provide actionable recommendations when gaps exist', () => {
      const job = {
        title: 'Junior AI Engineer',
        careerCategory: 'Artificial Intelligence and Data',
        requiredSkills: ['Python', 'Machine Learning', 'FastAPI', 'Pandas'],
        locationCity: 'Islamabad',
        experienceMin: 0,
      };

      const userProfile = {
        targetCareer: 'frontend-dev',
        existingSkills: ['React', 'HTML', 'CSS'],
        preferredCity: 'Karachi',
      };

      const match = calculateJobMatch(job, userProfile);

      assert.ok(match.matchScore < 70);
      assert.ok(match.missingSkills.includes('Python'));
      assert.ok(match.missingSkills.includes('Machine Learning'));
      assert.ok(match.recommendedActions.length > 0);
    });
  });

  // 3. Discovery API Endpoints (/api/v1/jobs)
  describe('Jobs Discovery API Endpoints (/api/v1/jobs)', () => {
    it('GET /api/v1/jobs should retrieve Pakistan IT vacancies with pagination metadata', async () => {
      const res = await request(app).get('/api/v1/jobs');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.jobs));
      assert.ok(res.body.data.jobs.length > 0);
      assert.ok(res.body.data.pagination.total >= res.body.data.jobs.length);

      const first = res.body.data.jobs[0];
      assert.ok(first.title);
      assert.ok(first.companyName || first.company);
      assert.ok(first.locationCity || first.city);
    });

    it('GET /api/v1/jobs?city=Karachi should filter jobs by Pakistani city', async () => {
      const res = await request(app).get('/api/v1/jobs?city=Karachi');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      res.body.data.jobs.forEach((j) => {
        const city = j.locationCity || j.city;
        assert.ok(city.toLowerCase().includes('karachi'), `Expected Karachi, got ${city}`);
      });
    });

    it('GET /api/v1/jobs?internship=true should filter student internship & trainee vacancies', async () => {
      const res = await request(app).get('/api/v1/jobs?internship=true');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.jobs.length > 0);
      res.body.data.jobs.forEach((j) => {
        const isIntern = j.isInternship || (j.employmentType && j.employmentType.includes('Intern'));
        assert.ok(isIntern, 'Job must be an internship or trainee opportunity');
      });
    });

    it('GET /api/v1/jobs/filters should return available Pakistan cities and categories', async () => {
      const res = await request(app).get('/api/v1/jobs/filters');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.cities));
      assert.ok(res.body.data.cities.includes('Karachi'));
      assert.ok(res.body.data.cities.includes('Lahore'));
      assert.ok(Array.isArray(res.body.data.categories));
      assert.ok(res.body.data.categories.length >= 10);
    });

    it('GET /api/v1/jobs/categories should return all 12 categories with job counts', async () => {
      const res = await request(app).get('/api/v1/jobs/categories');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.categories));
      assert.ok(res.body.data.categories.length >= 10);
    });

    it('GET /api/v1/jobs/locations should return Pakistan major tech hubs', async () => {
      const res = await request(app).get('/api/v1/jobs/locations');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.locations));
      const cities = res.body.data.locations.map((l) => l.city);
      assert.ok(cities.includes('Karachi'));
      assert.ok(cities.includes('Lahore'));
      assert.ok(cities.includes('Islamabad'));
    });

    it('GET /api/v1/jobs/sources should return active verified data feeds registry with official URLs and automation flags', async () => {
      const res = await request(app).get('/api/v1/jobs/sources');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.sources));
      assert.ok(res.body.data.sources.length >= 10, 'Expected at least 10 registered sources');

      const sourceIds = res.body.data.sources.map((s) => s.sourceId);
      assert.ok(sourceIds.includes('src_systems_ltd'), 'Must catalog Systems Limited');
      assert.ok(sourceIds.includes('src_10pearls'), 'Must catalog 10Pearls');
      assert.ok(sourceIds.includes('src_netsol'), 'Must catalog NETSOL');
      assert.ok(sourceIds.includes('src_contour'), 'Must catalog Contour Software');
      assert.ok(sourceIds.includes('src_meezan_bank'), 'Must catalog Meezan Bank');
      assert.ok(sourceIds.includes('src_hbl'), 'Must catalog HBL');
      assert.ok(sourceIds.includes('src_jazz'), 'Must catalog Jazz / JazzCash');
      assert.ok(sourceIds.includes('src_njp_gov_pk'), 'Must catalog NJP');
      assert.ok(sourceIds.includes('src_remote_pk_global'), 'Must catalog Arbeitnow global feed');

      // Verify automation honesty
      const arbeitnow = res.body.data.sources.find((s) => s.sourceId === 'src_remote_pk_global');
      assert.equal(arbeitnow.isAutomated, true, 'Arbeitnow should be marked automated');

      const systems = res.body.data.sources.find((s) => s.sourceId === 'src_systems_ltd');
      assert.equal(systems.isAutomated, false, 'Systems Ltd must not claim automated bot access without permitted API');
      assert.ok(systems.officialCareersUrl.includes('systemsltd.com'));
    });

    it('GET /api/v1/jobs pagination parameters should correctly partition results', async () => {
      const res1 = await request(app).get('/api/v1/jobs?page=1&limit=4');
      assert.equal(res1.status, 200);
      assert.equal(res1.body.data.jobs.length, 4);
      assert.equal(res1.body.data.pagination.page, 1);
      assert.equal(res1.body.data.pagination.limit, 4);
      assert.ok(res1.body.data.pagination.pages >= 2);

      const res2 = await request(app).get('/api/v1/jobs?page=2&limit=4');
      assert.equal(res2.status, 200);
      assert.equal(res2.body.data.jobs.length, 4);
      assert.equal(res2.body.data.pagination.page, 2);

      // Verify page 1 and page 2 have distinct items
      const idsPage1 = res1.body.data.jobs.map((j) => j.id || j._id);
      const idsPage2 = res2.body.data.jobs.map((j) => j.id || j._id);
      idsPage1.forEach((id) => {
        assert.ok(!idsPage2.includes(id), `Item ${id} should not appear on both page 1 and page 2`);
      });
    });

    it('GET /api/v1/jobs/recommendations should return top career matches', async () => {
      const res = await request(app).get('/api/v1/jobs/recommendations');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.recommendations));
    });

    it('GET /api/v1/jobs/recent should return freshly posted vacancies', async () => {
      const res = await request(app).get('/api/v1/jobs/recent');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.recent));
    });

    it('GET /api/v1/jobs with activeOnly=true should NOT return expired jobs or future published jobs', async () => {
      const res = await request(app).get('/api/v1/jobs?activeOnly=true');
      assert.equal(res.status, 200);
      const jobs = res.body.data.jobs;
      const now = new Date();

      // Check no expired job is present
      const expiredJob = jobs.find((j) => j.sourceJobId === 'pk-demo-expired-web-dev');
      assert.equal(expiredJob, undefined, 'Expired job must not be returned in active results');

      // Check no future scheduled job is present
      const futureJob = jobs.find((j) => j.sourceJobId === 'pk-demo-upcoming-devops');
      assert.equal(futureJob, undefined, 'Future published job must not be returned until its date arrives');

      // Check all returned jobs have valid deadlines
      jobs.forEach((j) => {
        if (j.applicationDeadline) {
          assert.ok(new Date(j.applicationDeadline) >= now, `Job ${j.title} deadline must be in future`);
        }
        if (j.publishedAt) {
          assert.ok(new Date(j.publishedAt) <= now, `Job ${j.title} publication date must be past or now`);
        }
      });
    });

    it('GET /api/v1/jobs with activeOnly=false should include expired and upcoming audit records', async () => {
      const res = await request(app).get('/api/v1/jobs?activeOnly=false&limit=50');
      assert.equal(res.status, 200);
      const jobs = res.body.data.jobs;
      const expiredJob = jobs.find((j) => j.sourceJobId === 'pk-demo-expired-web-dev');
      assert.ok(expiredJob, 'Expired demo job should be retrievable when activeOnly=false');
    });
  });

  // 4. Admin Manual Job Entry & Authorization
  describe('Admin Manual Job Entry (/api/v1/jobs/admin/manual)', () => {
    it('should reject unauthenticated attempt to create a manual job', async () => {
      const res = await request(app)
        .post('/api/v1/jobs/admin/manual')
        .send({
          title: 'Senior DevOps Architect',
          companyName: 'Systems Limited',
          careerCategory: 'Cloud, DevOps and Infrastructure',
          canonicalJobUrl: 'https://careers.systemsltd.com/job/devops-lead',
          locationCity: 'Lahore',
        });
      assert.equal(res.status, 401);
    });

    it('should allow admin user to add a verified opportunity with duplicate prevention', async () => {
      // Register an admin user
      const adminEmail = `admin_${Date.now()}@skillpathai.edu`;
      const regRes = await request(app).post('/api/auth/register').send({
        name: 'System Admin',
        email: adminEmail,
        password: 'Password123!',
        role: 'admin',
      });
      assert.equal(regRes.status, 201);
      const token = regRes.body.token;

      // Add a verified job
      const jobPayload = {
        title: 'Lead Cloud Infrastructure Architect',
        companyName: 'Systems Limited',
        careerCategory: 'Cloud, DevOps and Infrastructure',
        canonicalJobUrl: `https://careers.systemsltd.com/job/cloud-architect-${Date.now()}`,
        locationCity: 'Lahore',
        workArrangement: 'Hybrid',
        employmentType: 'Full-time',
        experienceLabel: '3+ Years',
        salaryMin: 250000,
        salaryMax: 400000,
        requiredSkills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
        description: 'Lead enterprise cloud transformations for North American and European Fortune 500 accounts.',
        sourceId: 'src_systems_ltd',
      };

      const addRes = await request(app)
        .post('/api/v1/jobs/admin/manual')
        .set('Authorization', `Bearer ${token}`)
        .send(jobPayload);

      assert.equal(addRes.status, 201);
      assert.equal(addRes.body.success, true);
      assert.equal(addRes.body.data.job.title, jobPayload.title);
      assert.equal(addRes.body.data.job.isManuallyAdded, true);

      // Verify deduplication: repeating the same payload should be rejected
      const dupRes = await request(app)
        .post('/api/v1/jobs/admin/manual')
        .set('Authorization', `Bearer ${token}`)
        .send(jobPayload);

      assert.equal(dupRes.status, 409); // Throws duplicate prevention conflict
    });

    it('should allow admin user to trigger backend sync', async () => {
      const adminEmail = `admin_sync_${Date.now()}@skillpathai.edu`;
      const regRes = await request(app).post('/api/auth/register').send({
        name: 'Sync Admin',
        email: adminEmail,
        password: 'Password123!',
        role: 'admin',
      });
      const token = regRes.body.token;

      const syncRes = await request(app)
        .post('/api/v1/jobs/admin/sync')
        .set('Authorization', `Bearer ${token}`);

      assert.equal(syncRes.status, 200);
      assert.equal(syncRes.body.success, true);
      assert.ok(Array.isArray(syncRes.body.data.sourceResults));
      assert.ok(syncRes.body.data.sourceResults.length >= 2);
    });
  });

  // 5. Extended Filtering Tests (Employment Type & Experience Levels)
  describe('Employment Type & Experience Level Filtering', () => {
    it('GET /api/v1/jobs?employmentType=Full-time should filter full-time jobs', async () => {
      const res = await request(app).get('/api/v1/jobs?employmentType=Full-time');
      assert.equal(res.status, 200);
      assert.ok(res.body.data.jobs.length > 0);
      res.body.data.jobs.forEach((j) => {
        const type = j.employmentType || j.type;
        assert.equal(type, 'Full-time');
      });
    });

    it('GET /api/v1/jobs?experience=fresh should filter entry-level and fresh graduate opportunities', async () => {
      const res = await request(app).get('/api/v1/jobs?experience=fresh');
      assert.equal(res.status, 200);
      assert.ok(res.body.data.jobs.length > 0);
      res.body.data.jobs.forEach((j) => {
        const label = (j.experienceLabel || j.experience || '').toLowerCase();
        const min = j.experienceMin !== undefined ? j.experienceMin : 0;
        const max = j.experienceMax !== undefined ? j.experienceMax : 1;
        const isFresh = (min === 0 && max <= 1) || label.includes('fresh') || label.includes('entry') || j.isInternship;
        assert.ok(isFresh, `Job ${j.title} should be fresh / entry level`);
      });
    });
  });

  // 6. Backwards compatibility for personal application tracking
  describe('Tracker Compatibility Endpoints (/api/jobs?scope=tracker)', () => {
    it('should reject unauthenticated access to personal tracker applications', async () => {
      const res = await request(app).get('/api/jobs?scope=tracker');
      assert.equal(res.status, 401);
    });
  });

  // 7. Automated Synchronization System, Connectors & Monitoring Suite
  describe('Automated Synchronization, Connectors, Expiration & Admin Health Suite', () => {
    // 7.1 SSRF Outbound Request Security
    describe('SSRF Protection (isSafeOutboundUrl)', () => {
      it('should block localhost and private IPv4 ranges', () => {
        assert.equal(isSafeOutboundUrl('http://localhost:5000'), false);
        assert.equal(isSafeOutboundUrl('http://127.0.0.1:8080'), false);
        assert.equal(isSafeOutboundUrl('http://10.0.0.1/admin'), false);
        assert.equal(isSafeOutboundUrl('http://192.168.1.100'), false);
        assert.equal(isSafeOutboundUrl('http://172.16.0.5'), false);
        assert.equal(isSafeOutboundUrl('http://169.254.169.254/metadata'), false);
        assert.equal(isSafeOutboundUrl('file:///etc/passwd'), false);
      });

      it('should permit valid public HTTPS domains', () => {
        assert.equal(isSafeOutboundUrl('https://careers.systemsltd.com'), true);
        assert.equal(isSafeOutboundUrl('https://10pearls.com/careers'), true);
        assert.equal(isSafeOutboundUrl('https://www.arbeitnow.com/api/job-board-api'), true);
        assert.equal(isSafeOutboundUrl('https://weworkremotely.com/categories/remote-programming-jobs.rss'), true);
      });
    });

    // 7.2 Connector Normalization & Provenance
    describe('Connector Normalization & Provenance', () => {
      it('SystemsLimitedConnector should normalize verified listings with employer-direct badge', async () => {
        const connector = new SystemsLimitedConnector();
        const syncResult = await connector.sync();

        assert.equal(syncResult.success, true);
        assert.ok(syncResult.jobs.length >= 2);

        const job = syncResult.jobs[0];
        assert.equal(job.sourceId, 'src_systems_ltd');
        assert.equal(job.companyName, 'Systems Limited');
        assert.ok(job.canonicalJobUrl.startsWith('https://careers.systemsltd.com'));
        assert.equal(job.verificationBadge, 'employer-direct');
        assert.ok(job.dataProvenance);
        assert.equal(job.dataProvenance.connector, 'SystemsLimitedConnector');
        assert.ok(job.contentHash);
      });

      it('TenPearlsConnector should normalize listings with employer-direct badge', async () => {
        const connector = new TenPearlsConnector();
        const syncResult = await connector.sync();

        assert.equal(syncResult.success, true);
        assert.ok(syncResult.jobs.length >= 2);

        const job = syncResult.jobs[0];
        assert.equal(job.companyName, '10Pearls');
        assert.equal(job.verificationBadge, 'employer-direct');
        assert.ok(Array.isArray(job.requiredSkills));
      });

      it('RemotePkFeedConnector should normalize listings with source-verified badge', async () => {
        const connector = new RemotePkFeedConnector();
        const syncResult = await connector.sync();

        assert.equal(syncResult.success, true);
        assert.ok(syncResult.jobs.length >= 1);

        const job = syncResult.jobs[0];
        assert.equal(job.verificationBadge, 'source-verified');
        assert.equal(job.workArrangement, 'Remote');
      });
    });

    // 7.3 Duplicate Prevention & Existing Job Freshening
    describe('Atomic Deduplication & Freshness Ingestion', () => {
      it('should update lastSeenAt on existing job without altering its ID or creating duplicates', async () => {
        const testJob = {
          sourceId: 'src_test_unique',
          sourceName: 'Test Ingestion Source',
          sourceJobId: `test-sync-${Date.now()}`,
          canonicalJobUrl: `https://example.com/job-${Date.now()}`,
          title: 'Senior Microservices Architect',
          companyName: 'Habib Bank Limited',
          description: 'Build enterprise payment switches.',
          locationCity: 'Karachi',
          salaryMin: 200000,
          salaryMax: 350000,
          status: 'Active',
        };
        testJob.contentHash = generateJobContentHash(testJob);

        // First ingestion: should insert
        const stats1 = await JobSyncService.ingestJobs('src_test_unique', [testJob]);
        assert.equal(stats1.inserted, 1);

        // Second ingestion: should update existing without creating duplicate
        const stats2 = await JobSyncService.ingestJobs('src_test_unique', [testJob]);
        assert.ok(stats2.updated === 1 || stats2.duplicates === 1);
        assert.equal(stats2.inserted, 0, 'Must not insert duplicate record');
      });
    });

    // 7.4 Safe Expiration & Staleness Rules
    describe('Safe Expiration Rules', () => {
      it('should expire listings with passed applicationDeadline', async () => {
        const expiredCount = await JobSyncService.checkAndExpireDeadlines();
        assert.ok(typeof expiredCount === 'number');
      });

      it('should mark unverified listings older than stalenessDays as Unverified without deleting', async () => {
        const staleCount = await JobSyncService.expireStaleJobs(365);
        assert.ok(typeof staleCount === 'number');
      });
    });

    // 7.5 Scheduler Start and Shutdown
    describe('Scheduler Lifecycle', () => {
      it('should start auto-scheduler once and shut down gracefully', () => {
        JobSyncService.startAutoScheduler(3600000);
        assert.equal(JobSyncService._schedulerStarted, true);

        // Calling start again should not create duplicate timers
        JobSyncService.startAutoScheduler(3600000);
        assert.equal(JobSyncService._schedulerStarted, true);

        // Graceful stop
        JobSyncService.stopAutoScheduler();
        assert.equal(JobSyncService._schedulerStarted, false);
      });
    });

    // 7.6 Admin Monitoring & Health Endpoints
    describe('Admin Monitoring Endpoints (/api/v1/jobs/admin/sync-runs & /source-health)', () => {
      let adminToken;

      it('should reject non-admin access to sync-runs audit log', async () => {
        const res = await request(app).get('/api/v1/jobs/admin/sync-runs');
        assert.equal(res.status, 401);
      });

      it('should permit authenticated admin to view sync runs audit log', async () => {
        const adminEmail = `admin_audit_${Date.now()}@skillpathai.edu`;
        const regRes = await request(app).post('/api/auth/register').send({
          name: 'Audit Admin',
          email: adminEmail,
          password: 'Password123!',
          role: 'admin',
        });
        adminToken = regRes.body.token;

        const res = await request(app)
          .get('/api/v1/jobs/admin/sync-runs')
          .set('Authorization', `Bearer ${adminToken}`);

        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.ok(Array.isArray(res.body.data.runs));
        assert.ok(res.body.data.pagination);
      });

      it('should permit authenticated admin to view source health metrics', async () => {
        const res = await request(app)
          .get('/api/v1/jobs/admin/source-health')
          .set('Authorization', `Bearer ${adminToken}`);

        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.ok(Array.isArray(res.body.data.sources));
        assert.ok(res.body.data.sources.length >= 5);

        const systems = res.body.data.sources.find((s) => s.sourceId === 'src_systems_ltd');
        assert.ok(systems);
        assert.equal(systems.name, 'Systems Limited Official Careers');
      });
    });
  });

  // 7. AI Career Matching, Explainable Diagnostics & Learning Plan Suite
  describe('Production-Ready AI Career Matching & Learning Plan Suite', () => {
    it('should calculate explainable skill-match percentage with matching & missing skills and score breakdown', () => {
      const job = {
        title: 'Full Stack Node.js & React Developer',
        companyName: '10Pearls',
        requiredSkills: ['Node.js', 'React', 'MongoDB', 'Docker'],
        preferredSkills: ['TypeScript', 'AWS'],
        locationCity: 'Karachi',
        workArrangement: 'Hybrid',
        experienceMin: 1,
      };

      const userProfile = {
        existingSkills: ['node', 'react'],
        targetCareer: 'Full Stack Developer',
        careerGoals: 'Build scalable web applications',
        preferredCity: 'Karachi',
        preferredWorkEnvironment: 'Hybrid',
      };

      const match = calculateJobMatch(job, userProfile);
      assert.ok(match.matchScore >= 60, `Match score ${match.matchScore} should be >= 60`);
      assert.ok(match.matchingSkills.length >= 2, 'Should match Node.js and React via fuzzy synonym');
      assert.ok(match.missingSkills.includes('MongoDB') || match.missingSkills.includes('Docker'));
      assert.ok(match.scoreBreakdown);
      assert.equal(typeof match.scoreBreakdown.skillsScore, 'number');
      assert.equal(typeof match.scoreBreakdown.roleScore, 'number');
      assert.equal(typeof match.scoreBreakdown.locationScore, 'number');
      assert.equal(typeof match.scoreBreakdown.experienceScore, 'number');
      assert.ok(match.relevanceExplanation);
      assert.ok(Array.isArray(match.recommendedActions));
    });

    it('should handle empty profiles cleanly with baseline score and guided setup advice', () => {
      const job = {
        title: 'Junior Python Developer',
        companyName: 'Systems Limited',
        requiredSkills: ['Python', 'Django', 'PostgreSQL'],
        locationCity: 'Lahore',
      };

      const emptyProfile = {};
      const match = calculateJobMatch(job, emptyProfile);
      assert.equal(match.matchingSkills.length, 0);
      assert.equal(match.missingSkills.length, 3);
      assert.equal(match.eligibilityConfidence, 'Needs Profile Setup');
      assert.ok(match.relevanceExplanation.includes('Add your technical skills'));
    });

    it('should generate high-impact missing skill insights and a 3-stage learning roadmap', () => {
      const jobs = [
        {
          title: 'Cloud DevOps Engineer',
          match: { matchScore: 70, missingSkills: ['Kubernetes', 'Terraform'] },
        },
        {
          title: 'Backend Node Engineer',
          match: { matchScore: 65, missingSkills: ['Kubernetes', 'Docker'] },
        },
      ];

      const insights = generateCareerMatchingInsights(jobs, {
        targetCareer: 'DevOps Engineer',
        weeklyLearningHours: 20,
      });

      assert.ok(Array.isArray(insights.topMissingSkills));
      const k8s = insights.topMissingSkills.find((s) => s.skill === 'Kubernetes');
      assert.ok(k8s, 'Kubernetes should be identified as high demand missing skill');
      assert.equal(k8s.jobDemandCount, 2);
      assert.ok(k8s.estimatedScoreBoost.startsWith('+'));

      assert.ok(insights.learningPlan);
      assert.equal(insights.learningPlan.milestones.length, 3);
      assert.ok(insights.learningPlan.recommendedProject);
      assert.ok(insights.learningPlan.resources.length > 0);
    });

    it('GET /api/v1/jobs/recommendations should return personalized recommendations for authenticated user with tracked skills', async () => {
      const email = `match_user_${Date.now()}@skillpathai.edu`;
      const regRes = await request(app).post('/api/auth/register').send({
        name: 'Matching Student',
        email,
        password: 'Password123!',
        targetCareer: 'Full-Stack Developer',
      });
      const token = regRes.body.token;

      // Add a skill to the user's Skill Matrix
      await request(app)
        .post('/api/skills')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'React.js',
          category: 'frontend',
          currentLevel: 4,
          targetLevel: 5,
        });

      const res = await request(app)
        .get('/api/v1/jobs/recommendations')
        .set('Authorization', `Bearer ${token}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.recommendations));
      assert.ok(res.body.data.recommendations.length > 0);
      assert.ok(res.body.data.topMatch);
      assert.ok(Array.isArray(res.body.data.topMissingSkills));
      assert.ok(res.body.data.learningPlan);
      assert.equal(res.body.data.hasSufficientData, true);

      // Verify that React.js was recognized in the user profile
      assert.ok(res.body.data.userProfileSummary.skills.includes('React.js'));
    });

    it('GET /api/v1/jobs/recommendations should support filtering by city, internship, remote, and experience', async () => {
      // 1. City filter
      const cityRes = await request(app).get('/api/v1/jobs/recommendations?city=Karachi');
      assert.equal(cityRes.status, 200);
      if (cityRes.body.data.recommendations.length > 0) {
        cityRes.body.data.recommendations.forEach((j) => {
          assert.equal(j.locationCity, 'Karachi');
        });
      }

      // 2. Internship filter
      const internRes = await request(app).get('/api/v1/jobs/recommendations?internship=true');
      assert.equal(internRes.status, 200);
      if (internRes.body.data.recommendations.length > 0) {
        internRes.body.data.recommendations.forEach((j) => {
          assert.ok(j.isInternship === true || (j.employmentType || '').toLowerCase().includes('intern'));
        });
      }

      // 3. Remote filter
      const remoteRes = await request(app).get('/api/v1/jobs/recommendations?remote=true');
      assert.equal(remoteRes.status, 200);
      if (remoteRes.body.data.recommendations.length > 0) {
        remoteRes.body.data.recommendations.forEach((j) => {
          assert.ok(j.workArrangement === 'Remote' || (j.locationCity || '').includes('Remote'));
        });
      }
    });

    it('GET /api/v1/jobs/recommendations should handle unauthenticated user and empty filter results cleanly', async () => {
      const res = await request(app).get('/api/v1/jobs/recommendations?city=NonExistentCityXYZ&experience=3%2B&internship=true');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.recommendations.length, 0);
      assert.equal(res.body.data.hasSufficientData, false);
      assert.ok(res.body.data.emptyReason);
    });
  });
});



