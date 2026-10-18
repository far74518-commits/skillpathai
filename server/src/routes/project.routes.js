import { Router } from 'express';
import {
  getProjects,
  getMyProjects,
  getProjectById,
  startProject,
  toggleChecklistItem,
  completeProject,
} from '../controllers/project.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, getProjects);
router.get('/my', authenticate, getMyProjects);
router.get('/:id', optionalAuth, getProjectById);
router.post('/:id/start', authenticate, startProject);
router.post('/:id/checklist', authenticate, toggleChecklistItem);
router.post('/:id/complete', authenticate, completeProject);

export default router;
