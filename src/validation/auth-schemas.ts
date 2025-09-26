import { z } from 'zod';

// Login form schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register form schema
export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Recover password step 1 - email
export const recoverEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type RecoverEmailFormData = z.infer<typeof recoverEmailSchema>;

// Recover password step 2 - OTP
export const recoverOtpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

export type RecoverOtpFormData = z.infer<typeof recoverOtpSchema>;

// Recover password step 3 - new password
export const recoverPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RecoverPasswordFormData = z.infer<typeof recoverPasswordSchema>;

// Verify email schema
export const verifyEmailSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
