import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  exportUserData,
  getDatabaseStatus,
  deleteAccount,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/database-status', getDatabaseStatus);

router.use(authenticate);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.patch('/me/preferences', updatePreferences);
router.post('/change-password', changePassword);
router.get('/export', exportUserData);
router.delete('/me', deleteAccount);

export default router;
