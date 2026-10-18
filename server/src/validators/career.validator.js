import { z } from 'zod';

export const assessCareerSchema = z.object({
  body: z.object({
    educationLevel: z.string().optional(),
    degreeField: z.string().optional(),
    existingSkills: z.array(z.union([z.string(), z.object({ name: z.string() })])).optional(),
    interests: z.array(z.string()).optional(),
    preferredWorkEnv: z.string().optional(),
    careerGoal: z.string().optional(),
    weeklyHours: z.union([z.number(), z.string()]).optional(),
  }),
});

export const guidanceSchema = z.object({
  body: z.object({
    targetRole: z.string().optional(),
    weeklyHours: z.union([z.number(), z.string()]).optional(),
    missingSkills: z.array(z.any()).optional(),
    existingSkills: z.array(z.any()).optional(),
    educationLevel: z.string().optional(),
    degree: z.string().optional(),
    interests: z.array(z.string()).optional(),
  }),
});
