import { Job, CAREER_CATEGORIES, EMPLOYMENT_TYPES, WORK_ARRANGEMENTS } from '../models/Job.js';
import { JobSource } from '../models/JobSource.js';
import { JobAlert } from '../models/JobAlert.js';
import { JobApplication } from '../models/JobApplication.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { isDatabaseConnected } from '../config/database.js';
import { JobSyncService } from '../services/jobSync.service.js';
import { calculateJobMatch, generateCareerMatchingInsights } from '../services/jobMatcher.service.js';
import { DataStorageService } from '../services/dataStorage.service.js';
import { aiService } from '../services/ai.service.js';
import { INITIAL_PAKISTAN_JOBS } from '../data/pakistanJobsData.js';

/**
 * Filter and query in-memory array when MongoDB is offline
 */
function filterMemoryJobs(jobs, query) {
  const {
    q,
    category,
    city,
    workArrangement,
    employmentType,
    internship,
    experience,
    activeOnly = 'true',
    sortBy = 'recent',
    page = 1,
    limit = 20,
  } = query;

  let filtered = [...jobs];

  const now = new Date();
  if (activeOnly === 'true') {
    filtered = filtered.filter((j) => {
      const isStatusActive = j.status === 'Active' || !j.status;
      const isPastDeadline = j.applicationDeadline && new Date(j.applicationDeadline) < now;
      const isFuturePublished = j.publishedAt && new Date(j.publishedAt) > now;
      return isStatusActive && !isPastDeadline && !isFuturePublished;
    });
  }

  if (q && q.trim()) {
    const term = q.trim().toLowerCase();
    filtered = filtered.filter((j) => {
      const inTitle = (j.title || '').toLowerCase().includes(term);
      const inComp = (j.companyName || '').toLowerCase().includes(term);
      const inDesc = (j.description || '').toLowerCase().includes(term);
      const inSkills = (j.requiredSkills || []).some((s) => s.toLowerCase().includes(term));
      const inCity = (j.locationCity || '').toLowerCase().includes(term);
      return inTitle || inComp || inDesc || inSkills || inCity;
    });
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((j) => (j.careerCategory || '').toLowerCase() === category.toLowerCase());
  }

  if (city && city !== 'All') {
    filtered = filtered.filter((j) => {
      if (city === 'Remote') return j.workArrangement === 'Remote' || j.locationCity.includes('Remote');
      return (j.locationCity || '').toLowerCase().includes(city.toLowerCase());
    });
  }

  if (workArrangement && workArrangement !== 'All') {
    filtered = filtered.filter((j) => (j.workArrangement || '').toLowerCase() === workArrangement.toLowerCase());
  }

  if (employmentType && employmentType !== 'All') {
    filtered = filtered.filter((j) => (j.employmentType || '').toLowerCase() === employmentType.toLowerCase());
  }

  if (internship === 'true') {
    filtered = filtered.filter((j) => j.isInternship === true || (j.employmentType || '').includes('Intern'));
  }

  if (experience && experience !== 'All') {
    const exp = experience.toLowerCase();
    filtered = filtered.filter((j) => {
      const expLabel = (j.experienceLabel || j.experience || '').toLowerCase();
      const min = j.experienceMin !== undefined ? j.experienceMin : 0;
      const max = j.experienceMax !== undefined ? j.experienceMax : 99;
      if (exp.includes('fresh') || exp.includes('entry') || exp === '0') {
        return (min === 0 && max <= 1) || expLabel.includes('fresh') || expLabel.includes('entry');
      } else if (exp.includes('1') || exp.includes('2') || exp.includes('3')) {
        return (min <= 3 && max >= 1) || expLabel.includes('1') || expLabel.includes('2') || expLabel.includes('3');
      } else if (exp.includes('3+') || exp.includes('senior') || exp.includes('5')) {
        return min >= 3 || max >= 3 || expLabel.includes('3') || expLabel.includes('senior') || expLabel.includes('lead');
      }
      return expLabel.includes(exp);
    });
  }

  // Sort
  if (sortBy === 'recent') {
    filtered.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
  } else if (sortBy === 'salary') {
    filtered.sort((a, b) => (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0));
  } else if (sortBy === 'company') {
    filtered.sort((a, b) => (a.companyName || '').localeCompare(b.companyName || ''));
  }

  const total = filtered.length;
  const p = Math.max(1, parseInt(page, 10));
  const l = Math.max(1, parseInt(limit, 10));
  const paginated = filtered.slice((p - 1) * l, p * l);

  return {
    items: paginated,
    total,
    page: p,
    limit: l,
    pages: Math.ceil(total / l) || 1,
  };
}

/**
 * 1. Search & Filter Pakistan IT Jobs
 */
export const getDiscoveredJobs = asyncHandler(async (req, res) => {
  const user = req.user || null;
  const {
    q,
    category,
    city,
    province,
    company,
    workArrangement,
    employmentType,
    internship,
    experience,
    sortBy = 'recent',
    page = 1,
    limit = 20,
    activeOnly = 'true',
  } = req.query;

  // Offline / in-memory fallback
  if (!isDatabaseConnected()) {
    const memoryJobs = JobSyncService.getMemoryJobs();
    const result = filterMemoryJobs(memoryJobs, req.query);

    // Calculate match score for each job
    const jobsWithMatch = result.items.map((job) => {
      const match = calculateJobMatch(job, user);
      return {
        ...job,
        id: job._id || job.id || job.sourceJobId,
        match,
      };
    });

    if (sortBy === 'match') {
      jobsWithMatch.sort((a, b) => b.match.matchScore - a.match.matchScore);
    }

    return res.status(200).json({
      success: true,
      message: 'Pakistan IT jobs retrieved (local catalogue mode)',
      data: {
        jobs: jobsWithMatch,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          pages: result.pages,
        },
        sourcesActive: 3,
        databaseMode: 'local_catalogue',
      },
    });
  }

  // MongoDB Query
  const mongoQuery = {};

  const now = new Date();
  if (activeOnly === 'true') {
    mongoQuery.status = 'Active';
    mongoQuery.$and = [
      { $or: [{ applicationDeadline: null }, { applicationDeadline: { $gte: now } }] },
      { $or: [{ publishedAt: null }, { publishedAt: { $lte: now } }] },
    ];
  }

  if (category && category !== 'All') {
    mongoQuery.careerCategory = category;
  }

  if (city && city !== 'All') {
    if (city === 'Remote') {
      mongoQuery.$or = [{ workArrangement: 'Remote' }, { locationCity: /remote/i }];
    } else {
      mongoQuery.locationCity = new RegExp(city, 'i');
    }
  }

  if (province && province !== 'All') {
    mongoQuery.locationProvince = new RegExp(province, 'i');
  }

  if (company && company !== 'All') {
    mongoQuery.companyName = new RegExp(company, 'i');
  }

  if (workArrangement && workArrangement !== 'All') {
    mongoQuery.workArrangement = workArrangement;
  }

  if (employmentType && employmentType !== 'All') {
    mongoQuery.employmentType = employmentType;
  }

  if (internship === 'true') {
    mongoQuery.isInternship = true;
  }

  if (experience && experience !== 'All') {
    const exp = experience.toLowerCase();
    if (exp.includes('fresh') || exp.includes('entry') || exp === '0') {
      mongoQuery.$or = [
        { experienceMax: { $lte: 1 } },
        { experienceLabel: /fresh|entry|intern/i },
        { isInternship: true },
      ];
    } else if (exp.includes('1') || exp.includes('2') || exp.includes('3')) {
      mongoQuery.$and = mongoQuery.$and || [];
      mongoQuery.$and.push({ experienceMin: { $lte: 3 }, experienceMax: { $gte: 1 } });
    } else if (exp.includes('3+') || exp.includes('senior') || exp.includes('5')) {
      mongoQuery.$or = [
        { experienceMin: { $gte: 3 } },
        { experienceLabel: /3\+|senior|lead/i },
      ];
    }
  }

  if (q && q.trim()) {
    const regex = new RegExp(q.trim(), 'i');
    mongoQuery.$or = [
      { title: regex },
      { companyName: regex },
      { description: regex },
      { requiredSkills: { $in: [regex] } },
      { locationCity: regex },
    ];
  }

  // Sorting
  let sortOptions = { publishedAt: -1 };
  if (sortBy === 'salary') sortOptions = { salaryMax: -1, salaryMin: -1 };
  if (sortBy === 'company') sortOptions = { companyName: 1 };

  const p = Math.max(1, parseInt(page, 10));
  const l = Math.max(1, parseInt(limit, 10));
  const skip = (p - 1) * l;

  const total = await Job.countDocuments(mongoQuery);
  const rawJobs = await Job.find(mongoQuery).sort(sortOptions).skip(skip).limit(l);

  // If no jobs exist in DB yet, trigger initial seed
  if (total === 0 && !q && !category && !city) {
    await JobSyncService.syncAllSources();
  }

  const jobsWithMatch = rawJobs.map((doc) => {
    const jObj = doc.toObject();
    const match = calculateJobMatch(jObj, user);
    return {
      ...jObj,
      id: jObj._id,
      match,
    };
  });

  if (sortBy === 'match') {
    jobsWithMatch.sort((a, b) => b.match.matchScore - a.match.matchScore);
  }

  const activeSourcesCount = await JobSource.countDocuments({ enabled: true });

  return res.status(200).json({
    success: true,
    message: 'Pakistan IT jobs retrieved successfully',
    data: {
      jobs: jobsWithMatch,
      pagination: {
        total,
        page: p,
        limit: l,
        pages: Math.ceil(total / l) || 1,
      },
      sourcesActive: activeSourcesCount || 3,
      databaseMode: 'mongodb',
    },
  });
});

/**
 * 2. Get Single Job Details by ID
 */
export const getDiscoveredJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user || null;

  let job = null;
  if (!isDatabaseConnected()) {
    job = JobSyncService.getMemoryJobs().find(
      (j) => String(j._id) === id || String(j.id) === id || j.sourceJobId === id
    );
  } else {
    job = await Job.findById(id).catch(() => null);
    if (!job) {
      job = await Job.findOne({ sourceJobId: id });
    }
  }

  if (!job) {
    throw ApiError.notFound('Job listing not found or has been closed');
  }

  const jobObj = job.toObject ? job.toObject() : { ...job };
  const match = calculateJobMatch(jobObj, user);

  return res.status(200).json({
    success: true,
    message: 'Job details retrieved',
    data: {
      job: {
        ...jobObj,
        id: jobObj._id || jobObj.id,
        match,
      },
    },
  });
});

/**
 * 3. Filter Options & Summary Counts
 */
export const getJobFilters = asyncHandler(async (req, res) => {
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan', 'Remote (Pakistan)'];
  const categories = CAREER_CATEGORIES;
  const workArrangements = WORK_ARRANGEMENTS;
  const employmentTypes = EMPLOYMENT_TYPES;

  let totalJobs = 0;
  if (!isDatabaseConnected()) {
    totalJobs = JobSyncService.getMemoryJobs().length;
  } else {
    totalJobs = await Job.countDocuments({ status: 'Active' });
  }

  return res.status(200).json({
    success: true,
    message: 'Job filters and metadata retrieved',
    data: {
      totalJobs: totalJobs || INITIAL_PAKISTAN_JOBS.length,
      categories,
      cities,
      workArrangements,
      employmentTypes,
      experienceLevels: ['Fresh Graduate / Entry Level', '1 to 3 Years', '3+ Years'],
    },
  });
});

/**
 * 4. Categories Breakdown
 */
export const getJobCategories = asyncHandler(async (req, res) => {
  let jobs = isDatabaseConnected() ? await Job.find({ status: 'Active' }) : JobSyncService.getMemoryJobs();
  if (!jobs || jobs.length === 0) jobs = INITIAL_PAKISTAN_JOBS;

  const counts = CAREER_CATEGORIES.map((cat) => {
    const matching = jobs.filter((j) => (j.careerCategory || '').toLowerCase() === cat.toLowerCase());
    return {
      category: cat,
      count: matching.length,
    };
  });

  return res.status(200).json({
    success: true,
    message: 'Career categories breakdown retrieved',
    data: { categories: counts },
  });
});

/**
 * 5. Locations Breakdown
 */
export const getJobLocations = asyncHandler(async (req, res) => {
  let jobs = isDatabaseConnected() ? await Job.find({ status: 'Active' }) : JobSyncService.getMemoryJobs();
  if (!jobs || jobs.length === 0) jobs = INITIAL_PAKISTAN_JOBS;

  const majorCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan', 'Remote (Pakistan)'];

  const locations = majorCities.map((city) => {
    const count = jobs.filter((j) => {
      if (city === 'Remote (Pakistan)') return j.workArrangement === 'Remote' || j.locationCity.includes('Remote');
      return (j.locationCity || '').toLowerCase().includes(city.toLowerCase());
    }).length;

    return { city, count };
  });

  return res.status(200).json({
    success: true,
    message: 'Locations breakdown retrieved',
    data: { locations },
  });
});

/**
 * 6. Top Tech Companies Hiring in Pakistan
 */
export const getTopCompanies = asyncHandler(async (req, res) => {
  let jobs = isDatabaseConnected() ? await Job.find({ status: 'Active' }) : JobSyncService.getMemoryJobs();
  if (!jobs || jobs.length === 0) jobs = INITIAL_PAKISTAN_JOBS;

  const companyMap = {};
  jobs.forEach((j) => {
    const comp = j.companyName || 'Tech Employer';
    if (!companyMap[comp]) {
      companyMap[comp] = {
        name: comp,
        website: j.companyWebsite || '',
        logo: j.companyLogo || '',
        openRoles: 0,
        city: j.locationCity,
      };
    }
    companyMap[comp].openRoles++;
  });

  const sorted = Object.values(companyMap).sort((a, b) => b.openRoles - a.openRoles);

  return res.status(200).json({
    success: true,
    message: 'Top tech employers retrieved',
    data: { companies: sorted },
  });
});

/**
 * 7. Production-Ready Personalized Job Recommendations & Learning Roadmap
 * Computes explainable match scores, missing skill impact analysis, and
 * personalized learning roadmaps using authenticated student profile & real DB jobs.
 */
export const getRecommendations = asyncHandler(async (req, res) => {
  const authUser = req.user || null;
  const userId = authUser?._id || authUser?.id || null;

  // 1. Fetch authenticated user profile & skills from DB
  let userProfile = {};
  let trackedSkills = [];

  if (userId) {
    const userDoc = await DataStorageService.findUserById(userId);
    userProfile = userDoc ? (userDoc.toObject ? userDoc.toObject() : { ...userDoc }) : { ...authUser };
    trackedSkills = await DataStorageService.getSkills(userId);
  } else {
    userProfile = { ...authUser };
  }

  // Merge existingSkills array with trackedSkills from Skill Tracker
  const mergedSkills = new Set();
  if (Array.isArray(userProfile.existingSkills)) {
    userProfile.existingSkills.forEach((s) => {
      const val = typeof s === 'string' ? s.trim() : s?.name?.trim();
      if (val) mergedSkills.add(val);
    });
  }
  if (Array.isArray(trackedSkills)) {
    trackedSkills.forEach((s) => {
      if (s?.name?.trim()) mergedSkills.add(s.name.trim());
    });
  }

  const combinedSkillsArray = Array.from(mergedSkills).filter(Boolean);
  userProfile.existingSkills = combinedSkillsArray;
  userProfile.skills = combinedSkillsArray.map((name) => ({ name }));

  const hasEmptyProfile = combinedSkillsArray.length === 0 && !userProfile.targetCareer && !userProfile.degree;

  // 2. Fetch real active jobs from MongoDB or persistent store
  let rawJobs = [];
  if (isDatabaseConnected()) {
    rawJobs = await Job.find({ status: 'Active' });
    if (!rawJobs || rawJobs.length === 0) {
      rawJobs = JobSyncService.getMemoryJobs();
    }
  } else {
    rawJobs = JobSyncService.getMemoryJobs();
  }
  if (!rawJobs || rawJobs.length === 0) {
    rawJobs = INITIAL_PAKISTAN_JOBS;
  }

  // 3. Apply filters from query params
  const {
    city,
    internship,
    experience,
    remote,
    workArrangement,
    employmentType,
    category,
    minScore,
    q,
    limit = 12,
  } = req.query;

  let filteredJobs = rawJobs.map((j) => (j.toObject ? j.toObject() : { ...j }));

  // Deadline filter: hide expired jobs
  const now = new Date();
  filteredJobs = filteredJobs.filter((j) => {
    const isStatusActive = j.status === 'Active' || !j.status;
    const isPastDeadline = j.applicationDeadline && new Date(j.applicationDeadline) < now;
    return isStatusActive && !isPastDeadline;
  });

  // Query search
  if (q && q.trim()) {
    const term = q.trim().toLowerCase();
    filteredJobs = filteredJobs.filter((j) => {
      const inTitle = (j.title || '').toLowerCase().includes(term);
      const inComp = (j.companyName || j.company || '').toLowerCase().includes(term);
      const inSkills = (j.requiredSkills || []).some((s) => s.toLowerCase().includes(term));
      const inCity = (j.locationCity || '').toLowerCase().includes(term);
      return inTitle || inComp || inSkills || inCity;
    });
  }

  // Location filter
  if (city && city !== 'All' && city !== 'All Cities') {
    filteredJobs = filteredJobs.filter((j) => {
      if (city === 'Remote') return j.workArrangement === 'Remote' || (j.locationCity || '').includes('Remote');
      return (j.locationCity || '').toLowerCase().includes(city.toLowerCase());
    });
  }

  // Remote / Work arrangement filter
  if (remote === 'true' || workArrangement === 'Remote') {
    filteredJobs = filteredJobs.filter((j) => j.workArrangement === 'Remote' || (j.locationCity || '').includes('Remote'));
  } else if (workArrangement && workArrangement !== 'All') {
    filteredJobs = filteredJobs.filter((j) => (j.workArrangement || '').toLowerCase() === workArrangement.toLowerCase());
  }

  // Internship filter
  if (internship === 'true') {
    filteredJobs = filteredJobs.filter((j) => j.isInternship === true || (j.employmentType || '').toLowerCase().includes('intern'));
  }

  // Employment type filter
  if (employmentType && employmentType !== 'All') {
    filteredJobs = filteredJobs.filter((j) => (j.employmentType || '').toLowerCase() === employmentType.toLowerCase());
  }

  // Category filter
  if (category && category !== 'All') {
    filteredJobs = filteredJobs.filter((j) => (j.careerCategory || '').toLowerCase() === category.toLowerCase());
  }

  // Experience level filter
  if (experience && experience !== 'All') {
    const exp = experience.toLowerCase();
    filteredJobs = filteredJobs.filter((j) => {
      const expLabel = (j.experienceLabel || j.experience || '').toLowerCase();
      const min = j.experienceMin !== undefined ? j.experienceMin : 0;
      const max = j.experienceMax !== undefined ? j.experienceMax : 99;
      if (exp.includes('fresh') || exp.includes('entry') || exp === '0') {
        return (min === 0 && max <= 1) || expLabel.includes('fresh') || expLabel.includes('entry');
      } else if (exp.includes('1') || exp.includes('2') || exp.includes('3')) {
        return (min <= 3 && max >= 1) || expLabel.includes('1') || expLabel.includes('2') || expLabel.includes('3');
      } else if (exp.includes('3+') || exp.includes('senior') || exp.includes('5')) {
        return min >= 3 || max >= 3 || expLabel.includes('3') || expLabel.includes('senior') || expLabel.includes('lead');
      }
      return expLabel.includes(exp);
    });
  }

  // 4. Calculate explainable match score for each job
  let scored = filteredJobs.map((job) => {
    const match = calculateJobMatch(job, userProfile);
    return {
      ...job,
      id: job._id || job.id || job.sourceJobId,
      match,
    };
  });

  // Filter by minScore if provided
  if (minScore) {
    const minVal = Number(minScore);
    if (!isNaN(minVal)) {
      scored = scored.filter((j) => j.match.matchScore >= minVal);
    }
  }

  // Sort descending by matchScore, then by publishedAt
  scored.sort((a, b) => {
    if (b.match.matchScore !== a.match.matchScore) {
      return b.match.matchScore - a.match.matchScore;
    }
    return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
  });

  // Handle empty or zero results
  if (scored.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No jobs match your filter criteria',
      data: {
        recommendations: [],
        total: 0,
        topMatch: null,
        topMissingSkills: [],
        learningPlan: null,
        userProfileSummary: {
          savedSkillsCount: combinedSkillsArray.length,
          targetCareer: userProfile.targetCareer || 'Software Engineer',
          preferredCity: userProfile.preferredCity || 'Karachi',
          hasEmptyProfile,
        },
        hasSufficientData: false,
        emptyReason: 'No active jobs in the verified database match your chosen filter criteria. Try broadening your location, experience, or remote filters.',
      },
    });
  }

  // 5. Generate high-impact missing skill insights & structured 3-stage learning plan
  const insights = generateCareerMatchingInsights(scored, userProfile);

  // 6. Optional: If external AI API configured, enrich learning plan with AI guidance securely
  if (aiService.isConfigured() && insights.topMissingSkills?.length > 0) {
    try {
      const aiGuidance = await aiService.generateCareerGuidance({
        targetRole: userProfile.targetCareer || scored[0]?.title || 'Software Engineer',
        weeklyHours: userProfile.weeklyLearningHours || 15,
        missingSkills: insights.topMissingSkills.map((s) => s.skill),
        existingSkills: combinedSkillsArray,
        educationLevel: userProfile.educationLevel || "Bachelor's Degree",
        degree: userProfile.degree || 'Computer Science',
      });
      if (aiGuidance?.advice) {
        insights.learningPlan.aiAdvisorSummary = aiGuidance.advice;
        insights.learningPlan.aiKeyStrengths = aiGuidance.keyStrengths;
        insights.learningPlan.aiWeeklyRoutine = aiGuidance.suggestedWeeklyRoutine;
      }
    } catch (aiErr) {
      console.warn('[AI Advisor Notice] Rule engine used for career matching insights:', aiErr.message);
    }
  }

  const limitNum = Math.max(1, parseInt(limit, 10));
  const finalRecommendations = scored.slice(0, limitNum);

  return res.status(200).json({
    success: true,
    message: hasEmptyProfile
      ? 'Default baseline recommendations computed (add skills in your profile to personalize)'
      : 'Personalized recommendations computed successfully',
    data: {
      recommendations: finalRecommendations,
      total: scored.length,
      topMatch: scored[0] || null,
      topMissingSkills: insights.topMissingSkills,
      learningPlan: insights.learningPlan,
      userProfileSummary: {
        savedSkillsCount: combinedSkillsArray.length,
        skills: combinedSkillsArray,
        targetCareer: userProfile.targetCareer || 'Software Engineer',
        preferredCity: userProfile.preferredCity || userProfile.location || 'Karachi',
        educationLevel: userProfile.educationLevel || "Bachelor's Degree",
        degree: userProfile.degree || '',
        gradYear: userProfile.gradYear || '',
        preferredWorkEnvironment: userProfile.preferredWorkEnvironment || 'Any',
        weeklyLearningHours: userProfile.weeklyLearningHours || 15,
        hasEmptyProfile,
      },
      hasSufficientData: true,
      filtersApplied: {
        city: city || 'All',
        internship: internship === 'true',
        experience: experience || 'All',
        remote: remote === 'true' || workArrangement === 'Remote',
        employmentType: employmentType || 'All',
        category: category || 'All',
      },
    },
  });
});

/**
 * 8. Trending Jobs in Pakistan IT
 */
export const getTrendingJobs = asyncHandler(async (req, res) => {
  let jobs = isDatabaseConnected() ? await Job.find({ status: 'Active' }) : JobSyncService.getMemoryJobs();
  if (!jobs || jobs.length === 0) jobs = INITIAL_PAKISTAN_JOBS;

  // High interest roles: AI, Fullstack, Cloud, Fintech
  const trending = jobs.filter((j) => {
    const cat = (j.careerCategory || '').toLowerCase();
    const title = (j.title || '').toLowerCase();
    return (
      cat.includes('intelligence') ||
      cat.includes('cloud') ||
      cat.includes('fintech') ||
      title.includes('full-stack') ||
      title.includes('flutter') ||
      title.includes('react')
    );
  });

  return res.status(200).json({
    success: true,
    message: 'Trending Pakistan IT jobs retrieved',
    data: { trending: (trending.length > 0 ? trending : jobs).slice(0, 6) },
  });
});

/**
 * 9. Recent Jobs (Posted in last 7 days)
 */
export const getRecentJobs = asyncHandler(async (req, res) => {
  let jobs = isDatabaseConnected() ? await Job.find({ status: 'Active' }) : JobSyncService.getMemoryJobs();
  if (!jobs || jobs.length === 0) jobs = INITIAL_PAKISTAN_JOBS;

  const sorted = [...jobs].sort(
    (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
  );

  return res.status(200).json({
    success: true,
    message: 'Recent jobs retrieved',
    data: { recent: sorted.slice(0, 10) },
  });
});

/**
 * 10. Save Discovered Job to User Application Tracker
 */
export const saveDiscoveredJob = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { id } = req.params;

  let discoveredJob = null;
  if (!isDatabaseConnected()) {
    discoveredJob = JobSyncService.getMemoryJobs().find(
      (j) => String(j._id) === id || String(j.id) === id || j.sourceJobId === id
    );
  } else {
    discoveredJob = await Job.findById(id);
    if (!discoveredJob) discoveredJob = await Job.findOne({ sourceJobId: id });
  }

  if (!discoveredJob) {
    throw ApiError.notFound('Job listing not found');
  }

  if (!isDatabaseConnected()) {
    return res.status(201).json({
      success: true,
      message: `"${discoveredJob.title}" at ${discoveredJob.companyName} saved to your tracker`,
      data: {
        job: {
          id: 'job_' + Date.now(),
          company: discoveredJob.companyName,
          position: discoveredJob.title,
          location: discoveredJob.locationCity,
          type: discoveredJob.employmentType,
          status: 'Saved',
          url: discoveredJob.canonicalJobUrl,
          appliedDate: new Date().toISOString().split('T')[0],
        },
      },
    });
  }

  // Prevent duplicate saves in database
  let application = await JobApplication.findOne({ userId, jobId: discoveredJob._id });
  if (!application) {
    application = await JobApplication.create({
      userId,
      jobId: discoveredJob._id,
      company: discoveredJob.companyName,
      position: discoveredJob.title,
      location: discoveredJob.locationCity,
      type: discoveredJob.employmentType,
      salary: discoveredJob.salaryMin ? `${discoveredJob.salaryMin} - ${discoveredJob.salaryMax} PKR` : '',
      jobUrl: discoveredJob.canonicalJobUrl,
      status: 'Saved',
      appliedDate: new Date(),
      notes: `Discovered on SkillPath AI via ${discoveredJob.sourceName}.`,
    });

    discoveredJob.savesCount = (discoveredJob.savesCount || 0) + 1;
    await discoveredJob.save();
  }

  return res.status(201).json({
    success: true,
    message: `"${discoveredJob.title}" saved to your Application Tracker!`,
    data: { application },
  });
});

/**
 * 11. Get Data Sources Status (Registry)
 */
export const getJobSources = asyncHandler(async (req, res) => {
  let sources = [];
  if (!isDatabaseConnected()) {
    sources = JobSyncService.getMemorySources();
  } else {
    sources = await JobSource.find();
    if (sources.length === 0) {
      sources = await JobSyncService.ensureSourcesRegistered();
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Job sources registry retrieved',
    data: { sources },
  });
});

/**
 * 12. Trigger Manual Job Synchronization (Admin / Authorized)
 */
export const triggerSync = asyncHandler(async (req, res) => {
  const { sourceId } = req.body || req.query || {};

  let result;
  if (sourceId && sourceId !== 'all') {
    result = await JobSyncService.syncSource(sourceId, 'manual');
  } else {
    result = await JobSyncService.syncAllSources('manual');
  }

  return res.status(200).json({
    success: true,
    message: 'Job synchronization completed',
    data: result,
  });
});

/**
 * 12a. Admin Get Recent Sync Runs Audit Log
 */
export const getSyncRuns = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sourceId, status } = req.query;
  const result = await JobSyncService.getSyncRuns({ page, limit, sourceId, status });

  return res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * 12b. Admin Get Source Health & Metrics
 */
export const getSourceHealth = asyncHandler(async (req, res) => {
  const sources = await JobSyncService.getSourceHealth();

  return res.status(200).json({
    success: true,
    data: { sources },
  });
});

/**
 * 13. User Job Alert Subscriptions
 */
export const getJobAlerts = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id || req.user.id : null;
  if (!userId || !isDatabaseConnected()) {
    return res.status(200).json({
      success: true,
      data: { alerts: [] },
    });
  }

  const alerts = await JobAlert.find({ userId });
  return res.status(200).json({
    success: true,
    data: { alerts },
  });
});

export const saveJobAlert = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id || req.user.id : null;
  if (!userId) {
    throw ApiError.unauthorized('Please log in to save job alerts');
  }

  const { title, keywords, categories, cities, isInternshipOnly, frequency, channels } = req.body;

  if (!isDatabaseConnected()) {
    return res.status(201).json({
      success: true,
      message: 'Job alert preferences saved (local mode)',
      data: {
        alert: {
          id: 'alert_' + Date.now(),
          title: title || 'Pakistan IT Job Alert',
          keywords: keywords || [],
          categories: categories || [],
          cities: cities || [],
          frequency: frequency || 'daily',
        },
      },
    });
  }

  const alert = await JobAlert.create({
    userId,
    email: req.user.email || 'user@skillpath.ai',
    title: title || 'Pakistan IT Job Alert',
    keywords: keywords || [],
    categories: categories || [],
    cities: cities || [],
    isInternshipOnly: Boolean(isInternshipOnly),
    frequency: frequency || 'daily',
    channels: channels || { inApp: true, email: false },
  });

  return res.status(201).json({
    success: true,
    message: 'Job alert created successfully',
    data: { alert },
  });
});

/**
 * 14. Admin Manual Job Entry (Official Careers link & verified opportunity)
 */
export const createManualJob = asyncHandler(async (req, res) => {
  const {
    title,
    companyName,
    careerCategory,
    canonicalJobUrl,
    locationCity,
    locationProvince,
    workArrangement,
    employmentType,
    description,
    requiredSkills,
    preferredSkills,
    salaryMin,
    salaryMax,
    salaryCurrency,
    salaryPeriod,
    applicationDeadline,
    isInternship,
    sourceId,
    experienceLabel,
  } = req.body;

  if (!title || !companyName || !careerCategory || !canonicalJobUrl || !locationCity) {
    throw ApiError.badRequest('Missing required fields: title, companyName, careerCategory, canonicalJobUrl, and locationCity');
  }

  try {
    const job = await JobSyncService.addManualJob({
      title,
      companyName,
      careerCategory,
      canonicalJobUrl,
      locationCity,
      locationProvince,
      workArrangement,
      employmentType,
      description,
      requiredSkills,
      preferredSkills,
      salaryMin,
      salaryMax,
      salaryCurrency,
      salaryPeriod,
      applicationDeadline,
      isInternship,
      sourceId,
      experienceLabel,
    });

    return res.status(201).json({
      success: true,
      message: `Verified job "${job.title}" at ${job.companyName} added successfully`,
      data: { job },
    });
  } catch (err) {
    if (err.message && err.message.includes('duplicate prevented')) {
      throw ApiError.conflict(err.message);
    }
    throw err;
  }
});

