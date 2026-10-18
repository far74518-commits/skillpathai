import { Router } from 'express';
import {
  getAllStarterRoadmaps,
  getMyRoadmaps,
  getRoadmapByCareerType,
  toggleTaskCompleted,
  addCustomTask,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} from '../controllers/roadmap.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAllStarterRoadmaps);
router.get('/my', authenticate, getMyRoadmaps);
router.get('/:careerType', optionalAuth, getRoadmapByCareerType);
router.post('/', authenticate, createRoadmap);
router.put('/:id', authenticate, updateRoadmap);
router.delete('/:id', authenticate, deleteRoadmap);
router.patch('/:careerType/tasks/:taskId', authenticate, toggleTaskCompleted);
router.post('/:careerType/tasks', authenticate, addCustomTask);

export default router;
