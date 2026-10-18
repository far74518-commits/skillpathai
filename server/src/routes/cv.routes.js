import { Router } from 'express';
import {
  getCV,
  updateCV,
  resetCV,
} from '../controllers/cv.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateCVSchema } from '../validators/cv.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getCV);
router.put('/', validate(updateCVSchema), updateCV);
router.delete('/', resetCV);

export default router;
