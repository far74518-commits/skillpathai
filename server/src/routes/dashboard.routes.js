import { Router } from 'express';
import {
  getDashboardSummary,
  getDashboardActivity,
  getUpcomingTasks,
} from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/summary', getDashboardSummary);
router.get('/activity', getDashboardActivity);
router.get('/upcoming-tasks', getUpcomingTasks);

export default router;
