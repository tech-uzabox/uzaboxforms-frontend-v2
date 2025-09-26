import { z } from 'zod';

// Generate QR Code form schema
export const generateQRCodeSchema = z.object({
  documentName: z.string()
    .min(1, 'Document name is required')
    .min(3, 'Document name must be at least 3 characters')
    .max(100, 'Document name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Document name can only contain letters, numbers, spaces, hyphens, and underscores'),
});

// QR Code document creation schema
export const qrCodeDocumentSchema = z.object({
  documentName: z.string()
    .min(1, 'Document name is required')
    .min(3, 'Document name must be at least 3 characters')
    .max(100, 'Document name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Document name can only contain letters, numbers, spaces, hyphens, and underscores'),
  fileName: z.string()
    .min(1, 'File name is required'),
  qrCodeId: z.string()
    .min(1, 'QR Code ID is required'),
  creatorId: z.string()
    .min(1, 'Creator ID is required'),
});

// File upload schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine((file) => file.type === 'application/pdf', 'Only PDF files are allowed'),
});

// QR Code update schema
export const updateQRCodeSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and underscores'),
  host: z.string()
    .min(1, 'Host is required')
    .url('Host must be a valid URL'),
});

export type GenerateQRCodeFormData = z.infer<typeof generateQRCodeSchema>;
export type QRCodeDocumentFormData = z.infer<typeof qrCodeDocumentSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;
export type UpdateQRCodeFormData = z.infer<typeof updateQRCodeSchema>;
