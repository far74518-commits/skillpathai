import { z } from 'zod';

export const createSkillSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Skill name is required'),
    category: z.enum(['programming', 'frontend', 'backend', 'databases', 'communication', 'problem-solving', 'tools', 'cloud', 'other']).optional(),
    currentLevel: z.number().min(1).max(5).optional(),
    targetLevel: z.number().min(1).max(5).optional(),
    progress: z.number().min(0).max(100).optional(),
    hoursSpent: z.number().min(0).optional(),
    notes: z.string().optional(),
  }),
});

export const updateSkillProgressSchema = z.object({
  body: z.object({
    currentLevel: z.number().min(1).max(5).optional(),
    progress: z.number().min(0).max(100).optional(),
    hoursSpent: z.number().min(0).optional(),
  }),
});
