import { Router } from 'express';
import {
  getDiscoveredJobs,
  getDiscoveredJobById,
  getJobFilters,
  getJobCategories,
  getJobLocations,
  getTopCompanies,
  getRecommendations,
  getTrendingJobs,
  getRecentJobs,
  saveDiscoveredJob,
  getJobSources,
  triggerSync,
  createManualJob,
  getSyncRuns,
  getSourceHealth,
  getJobAlerts,
  saveJobAlert,
} from '../controllers/jobDiscovery.controller.js';
import {
  getJobs as getTrackerJobs,
  getJobById as getTrackerJobById,
  createJob as createTrackerJob,
  updateJob as updateTrackerJob,
  updateJobStatus as updateTrackerJobStatus,
  deleteJob as deleteTrackerJob,
} from '../controllers/job.controller.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createJobSchema, updateJobStatusSchema } from '../validators/job.validator.js';

const router = Router();

// -------------------------------------------------------------
// 1. Discovery Endpoints (Public / Optional Auth for Matching)
// -------------------------------------------------------------
router.get('/filters', getJobFilters);
router.get('/categories', getJobCategories);
router.get('/locations', getJobLocations);
router.get('/companies', getTopCompanies);
router.get('/recommendations', optionalAuth, getRecommendations);
router.get('/trending', getTrendingJobs);
router.get('/recent', getRecentJobs);
router.get('/sources', getJobSources);

// Admin manual sync, monitoring, and verified job entry
router.post('/admin/sync', authenticate, requireAdmin, triggerSync);
router.post('/admin/manual', authenticate, requireAdmin, createManualJob);
router.get('/admin/sync-runs', authenticate, requireAdmin, getSyncRuns);
router.get('/admin/source-health', authenticate, requireAdmin, getSourceHealth);

// User Job Alerts
router.get('/alerts', authenticate, getJobAlerts);
router.post('/alerts', authenticate, saveJobAlert);

// Explicit Personal Tracker Endpoints
router.get('/tracker/applications', authenticate, getTrackerJobs);
router.post('/tracker/applications', authenticate, validate(createJobSchema), createTrackerJob);

// -------------------------------------------------------------
// 2. Main Root Endpoints (Backward Compatible & Dual Scope)
// -------------------------------------------------------------
router.get(
  '/',
  (req, res, next) => {
    if (req.query.scope === 'tracker' || req.query.applications === 'true') {
      return authenticate(req, res, next);
    }
    return optionalAuth(req, res, next);
  },
  (req, res, next) => {
    if (req.query.scope === 'tracker' || req.query.applications === 'true') {
      return getTrackerJobs(req, res, next);
    }
    return getDiscoveredJobs(req, res, next);
  }
);

router.post(
  '/',
  authenticate,
  (req, res, next) => {
    if (req.body.company && req.body.position) {
      return validate(createJobSchema)(req, res, () => createTrackerJob(req, res, next));
    }
    return saveJobAlert(req, res, next);
  }
);

// Save discovered job to user tracker
router.post('/:id/save', authenticate, saveDiscoveredJob);

// Individual Job Actions
router.get(
  '/:id',
  (req, res, next) => {
    if (req.query.scope === 'tracker') {
      return authenticate(req, res, next);
    }
    return optionalAuth(req, res, next);
  },
  (req, res, next) => {
    if (req.query.scope === 'tracker') {
      return getTrackerJobById(req, res, next);
    }
    return getDiscoveredJobById(req, res, next);
  }
);

// Update / Delete User Personal Application Tracker records
router.put('/:id', authenticate, updateTrackerJob);
router.patch('/:id/status', authenticate, validate(updateJobStatusSchema), updateTrackerJobStatus);
router.delete('/:id', authenticate, deleteTrackerJob);

export default router;
