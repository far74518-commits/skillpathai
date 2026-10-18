import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import careerRoutes from './career.routes.js';
import roadmapRoutes from './roadmap.routes.js';
import skillRoutes from './skill.routes.js';
import jobRoutes from './job.routes.js';
import cvRoutes from './cv.routes.js';
import projectRoutes from './project.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import aiRoutes from './ai.routes.js';
import notificationRoutes from './notification.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/careers', careerRoutes);
router.use('/roadmaps', roadmapRoutes);
router.use('/skills', skillRoutes);
router.use('/jobs', jobRoutes);
router.use('/v1/jobs', jobRoutes);
router.use('/cv', cvRoutes);
router.use('/projects', projectRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);

export default router;
