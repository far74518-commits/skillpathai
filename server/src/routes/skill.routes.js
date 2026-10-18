import { Router } from 'express';
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  updateSkillProgress,
  deleteSkill,
} from '../controllers/skill.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createSkillSchema,
  updateSkillProgressSchema,
} from '../validators/skill.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getSkills);
router.post('/', validate(createSkillSchema), createSkill);
router.get('/:id', getSkillById);
router.put('/:id', updateSkill);
router.patch('/:id/progress', validate(updateSkillProgressSchema), updateSkillProgress);
router.delete('/:id', deleteSkill);

export default router;
