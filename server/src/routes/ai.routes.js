import { Router } from 'express';
import { getCareerGuidance } from '../controllers/ai.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/guidance', optionalAuth, getCareerGuidance);

export default router;
