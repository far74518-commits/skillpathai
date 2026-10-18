import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    degree: z.string().optional(),
    university: z.string().optional(),
    targetCareer: z.string().optional(),
    role: z.enum(['user', 'admin']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    name: z.string().optional(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10, 'Valid reset token is required'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
  }),
});
