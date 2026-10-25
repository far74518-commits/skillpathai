import { Router } from 'express';
import {
  getCareerGuidance,
  generateSmartRoadmap,
  reviewATSResume,
  askCareerAssistant,
  getAIStatus,
  configureAI,
} from '../controllers/ai.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/status', getAIStatus);
router.post('/guidance', optionalAuth, getCareerGuidance);
router.post('/roadmap', optionalAuth, generateSmartRoadmap);
router.post('/cv-review', optionalAuth, reviewATSResume);
router.post('/chat', optionalAuth, askCareerAssistant);
router.post('/config', optionalAuth, configureAI);

export default router;
