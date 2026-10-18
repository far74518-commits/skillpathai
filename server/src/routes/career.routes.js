import { Router } from 'express';
import {
  getAllCareers,
  getCareerById,
  assessCareers,
  getAssessmentHistory,
  getRecommendations,
} from '../controllers/career.controller.js';
import { optionalAuth, authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { assessCareerSchema } from '../validators/career.validator.js';

const router = Router();

router.get('/', getAllCareers);
router.get('/recommendations', optionalAuth, getRecommendations);
router.get('/history', authenticate, getAssessmentHistory);
router.get('/:id', getCareerById);
router.post('/assess', optionalAuth, validate(assessCareerSchema), assessCareers);

export default router;
