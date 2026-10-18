import { DataStorageService } from '../services/dataStorage.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getJobs = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { search, status } = req.query;

  let jobs = await DataStorageService.getJobApplications(userId, { status });

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    jobs = jobs.filter(
      (j) =>
        (j.company && j.company.toLowerCase().includes(s)) ||
        (j.position && j.position.toLowerCase().includes(s)) ||
        (j.location && j.location.toLowerCase().includes(s))
    );
  }

  // Summary stats
  const allUserJobs = await DataStorageService.getJobApplications(userId);
  const stats = {
    total: allUserJobs.length,
    saved: allUserJobs.filter((j) => j.status === 'Saved').length,
    applied: allUserJobs.filter((j) => j.status === 'Applied').length,
    interview: allUserJobs.filter((j) => j.status === 'Interview').length,
    offer: allUserJobs.filter((j) => j.status === 'Offer').length,
    rejected: allUserJobs.filter((j) => j.status === 'Rejected').length,
  };

  return res.status(200).json({
    success: true,
    message: 'Job applications retrieved successfully',
    data: {
      jobs,
      pagination: {
        total: jobs.length,
        page: 1,
        pages: 1,
        limit: 50,
      },
      stats,
    },
  });
});

export const getJobById = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const jobs = await DataStorageService.getJobApplications(userId);
  const job = jobs.find((j) => j._id.toString() === req.params.id || j.id === req.params.id);

  if (!job) throw ApiError.notFound('Job application not found or unauthorized');

  return res.status(200).json({
    success: true,
    message: 'Job application details retrieved',
    data: { job },
  });
});

export const createJob = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { company, position, location, type, salary, jobUrl, status, appliedDate, notes } = req.body;

  if (!company || !position) {
    throw ApiError.badRequest('Company and position are required');
  }

  const job = await DataStorageService.createJobApplication(userId, {
    company: company.trim(),
    position: position.trim(),
    location: location || 'Remote',
    type: type || 'Full-time',
    salary: salary || '',
    jobUrl: jobUrl || '',
    status: status || 'Saved',
    appliedDate: appliedDate || new Date().toISOString(),
    notes: notes || '',
  });

  return res.status(201).json({
    success: true,
    message: 'Job application tracked successfully',
    data: { job },
  });
});

export const updateJob = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const updated = await DataStorageService.updateJobApplication(userId, req.params.id, req.body);

  if (!updated) throw ApiError.notFound('Job application not found or unauthorized');

  return res.status(200).json({
    success: true,
    message: 'Job application updated successfully',
    data: { job: updated },
  });
});

export const updateJobStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const updated = await DataStorageService.updateJobApplication(userId, req.params.id, {
    status: req.body.status,
  });

  if (!updated) throw ApiError.notFound('Job application not found or unauthorized');

  return res.status(200).json({
    success: true,
    message: `Application moved to "${req.body.status}"`,
    data: { job: updated },
  });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const deleted = await DataStorageService.deleteJobApplication(userId, req.params.id);

  if (!deleted) throw ApiError.notFound('Job application not found or unauthorized');

  return res.status(200).json({
    success: true,
    message: 'Job application deleted',
    data: {},
  });
});
