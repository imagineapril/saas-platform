import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
  email: z.string()
    .regex(emailRegex, { message: 'Invalid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string()
      .min(1, { message: 'Name is required' }),
    email: z.string()
      .regex(emailRegex, { message: 'Invalid email address' }),
    password: z.string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string()
      .min(6, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;