import { z } from 'zod';

export const createJobSchema = z.object({
  body: z.object({
    company: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position title is required'),
    location: z.string().optional(),
    type: z.string().optional(),
    salary: z.string().optional(),
    jobUrl: z.string().optional(),
    status: z.enum(['Saved', 'Applied', 'Interview', 'Offer', 'Rejected']).optional(),
    appliedDate: z.string().optional(),
    interviewDate: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateJobStatusSchema = z.object({
  body: z.object({
    status: z.enum(['Saved', 'Applied', 'Interview', 'Offer', 'Rejected']),
  }),
});
