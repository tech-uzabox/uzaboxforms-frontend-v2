import { z } from 'zod';

// Process form schema
const processFormSchema = z.object({
  formId: z.string().min(1, 'Form is required'),
  nextStepType: z.enum(['STATIC', 'DYNAMIC', 'FOLLOW_ORGANIZATION_CHART', 'NOT_APPLICABLE']),
  nextStepRoles: z.array(z.string()).optional(),
  nextStepSpecifiedTo: z.enum(['SINGLE_STAFF', 'ALL_STAFF']).optional(),
  nextStaff: z.string().optional(),
  notificationType: z.enum(['STATIC', 'DYNAMIC', 'FOLLOW_ORGANIZATION_CHART', 'NOT_APPLICABLE']),
  notificationTo: z.string().optional(),
  notificationToRoles: z.array(z.string()).optional(),
  notificationComment: z.string().optional(),
  editApplicationStatus: z.boolean().optional(),
  applicantViewFormAfterCompletion: z.boolean().optional(),
  notifyApplicant: z.boolean(),
  applicantNotificationContent: z.string().optional(),
}).refine((data) => {
  // Validate STATIC nextStepType
  if (data.nextStepType === 'STATIC') {
    return !!data.nextStaff;
  }
  return true;
}, {
  message: 'Next staff is required for STATIC type',
  path: ['nextStaff'],
}).refine((data) => {
  // Validate DYNAMIC nextStepType
  if (data.nextStepType === 'DYNAMIC') {
    return !!(data.nextStepRoles && data.nextStepRoles.length > 0 && data.nextStepSpecifiedTo);
  }
  return true;
}, {
  message: 'Next step roles and specified to are required for DYNAMIC type',
  path: ['nextStepRoles'],
}).refine((data) => {
  // Validate STATIC notificationType
  if (data.notificationType === 'STATIC') {
    return !!data.notificationTo;
  }
  return true;
}, {
  message: 'Notification to is required for STATIC notification type',
  path: ['notificationTo'],
}).refine((data) => {
  // Validate DYNAMIC notificationType
  if (data.notificationType === 'DYNAMIC') {
    return !!(data.notificationToRoles && data.notificationToRoles.length > 0);
  }
  return true;
}, {
  message: 'Notification roles are required for DYNAMIC notification type',
  path: ['notificationToRoles'],
}).refine((data) => {
  // Validate notifyApplicant
  if (data.notifyApplicant) {
    return !!(data.applicantNotificationContent && data.applicantNotificationContent.trim().length > 0);
  }
  return true;
}, {
  message: 'Applicant notification content is required when notify applicant is enabled',
  path: ['applicantNotificationContent'],
});

// Main process design schema
export const processDesignSchema = z.object({
  staffViewForms: z.enum(['YES', 'NO']),
  applicantViewProcessLevel: z.enum(['YES', 'NO']),
  forms: z.array(processFormSchema).min(1, 'At least one form is required'),
});

export type ProcessDesignFormData = z.infer<typeof processDesignSchema>;
export type ProcessFormFormData = z.infer<typeof processFormSchema>;
