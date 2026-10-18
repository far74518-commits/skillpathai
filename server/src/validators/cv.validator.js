import { z } from 'zod';

export const updateCVSchema = z.object({
  body: z.object({
    personalInfo: z.record(z.any()).optional(),
    education: z.array(z.record(z.any())).optional(),
    experience: z.array(z.record(z.any())).optional(),
    projects: z.array(z.record(z.any())).optional(),
    skills: z.record(z.any()).optional(),
    certifications: z.array(z.record(z.any())).optional(),
    selectedTemplate: z.enum(['modern', 'minimal', 'compact', 'technical']).optional(),
  }),
});
