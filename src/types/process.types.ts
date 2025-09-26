import { Role, User } from './user.types';
import { UseFormReturn } from 'react-hook-form';

export interface Process {
  id: string;
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
  groupId?: string;
  creatorId?: string;
  group: Group;
  creator: User;
  status: 'ENABLED' | 'DISABLED';
  archived: boolean;
  staffViewForms: boolean;
  applicantViewProcessLevel: boolean;
  roles?: Role[];
  forms?: ProcessFormData[];
  createdAt?: string;
  updatedAt?: string;
}

export type Processes = Process[];

export interface ProcessFormData {
  id: string;
  processId: string;
  formId: string;
  order: number;
  nextStepType: string;
  nextStepRoles: string[];
  nextStaffId: string | null;
  notificationType: string;
  notificationRoles: string[];
  notificationToId: string | null;
  notificationComment: string | null;
  notifyApplicant: boolean;
  applicantNotificationContent: string;
  editApplicationStatus: boolean;
  applicantViewFormAfterCompletion: boolean;
  createdAt: string;
  updatedAt: string;
  form: {
    id: string;
    name: string;
    type: string;
    status: string;
    archived: boolean;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    design: any[];
  };
}

// Alias for backward compatibility and clarity
export type ProcessForm = ProcessFormData;

// Component Props Types
export interface ViewProcessFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  forms: ProcessForm[];
}

export interface FormListComponentProps {
  forms: ProcessFormTypes[];
  formOptions: Array<{ title: string; value: string; icon: string }>;
  onAddForm: (index: number, formId: string) => void;
  onRemoveForm: (index: number) => void;
  onUpdateFormField: (index: number, field: keyof ProcessFormTypes, value: any) => void;
  onMoveFormUp: (index: number) => void;
  onMoveFormDown: (index: number) => void;
  checkDuplicateForm: (formId: string) => boolean;
}

export interface FormConfigComponentProps {
  form: ProcessFormTypes;
  index: number;
  formData: any;
  isOpen: boolean;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onUpdateField: (field: keyof ProcessFormTypes, value: any) => void;
  onAddForm: (formId: string) => void;
  formOptions: Array<{ title: string; value: string; icon: string }>;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export interface ProcessSettingsComponentProps {
  form: UseFormReturn<any>;
  processData?: any;
}

export interface Group {
  id: string;
  name: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Application {
  id: string;
  applicantId: ApplicantId;
  processId: string;
  status: string;
  completedForms: string[];
  createdAt: string;
  __v: number;
}

export interface ApplicantId {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProcessRoleDto {
  id: string;
  processName: string;
  roles?: {
    roleId: string;
    name: string;
    status: string;
  }[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProcessData {
  id: string;
  name: string;
  groupId: string;
  status: string;
  processForms: any[];
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

// Process workflow types
type StaticStep = {
  nextStepType: "STATIC";
  nextStaff: string;
  nextStepSpecifiedTo?: never;
  nextStepRoles?: never;
};

type FollowOrgStep = {
  nextStepType: "STATIC" | "FOLLOW_ORGANIZATION_CHART" | "NOT_APPLICABLE";
  nextStepSpecifiedTo?: never;
  nextStepRoles?: never;
  nextStaff?: never;
};

type DynamicStep = {
  nextStepType: "DYNAMIC";
  nextStepSpecifiedTo: "SINGLE_STAFF" | "ALL_STAFF";
  nextStepRoles: string[];
  nextStaff?: never;
};

type StaticNotification = {
  notificationType: "STATIC";
  notificationTo: string;
  notificationToRoles?: never;
  notificationComment?: string;
};

type DynamicNotification = {
  notificationType: "DYNAMIC";
  notificationToRoles: string[];
  notificationTo?: never;
  notificationComment?: string;
};

type FollowOrgNotification = {
  notificationType: "FOLLOW_ORGANIZATION_CHART";
  notificationTo?: never;
  notificationToRoles?: never;
  notificationComment?: string;
};

type NoNotification = {
  notificationType: "NOT_APPLICABLE";
  notificationTo?: never;
  notificationToRoles?: never;
  notificationComment?: never;
};

export type ProcessFormTypes = {
  formId: string;
  editApplicationStatus: boolean;
  applicantViewFormAfterCompletion: boolean;
  notifyApplicant: boolean;
  applicantNotificationContent?: string;
} & (StaticStep | DynamicStep | FollowOrgStep) &
  (StaticNotification | DynamicNotification | FollowOrgNotification | NoNotification);

// Process application types
export interface ProcessApplication {
  applicant: Applicant;
  answerSheets: AnswerSheet[];
}

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AnswerSheet {
  id: string;
  userId: string;
  applicantProcessId: string;
  processId: string;
  formId: string;
  __v: number;
  createdAt: string;
  responses: Response[];
}

export interface Response {
  sectionId: string;
  sectionName: string;
  responses: Response2[];
}

export interface Response2 {
  questionId: string;
  questionType: string;
  label: string;
  response: any;
}

// Service types (moved from services)
export interface ProcessTypes {
  applicantProcessId: string;
  formId: string;
}

export interface ProcessNamesTypes {
  // Add properties as needed
}

export interface UpdateProcessPayload {
  name: string;
  groupId: string;
  type: 'PUBLIC' | 'PRIVATE';
  status: string;
  creatorId: string;
  roles: string[];
}

// Component types (moved from components)
export interface ProcessNameFormData {
  name: string;
  groupId: string;
  type: 'PUBLIC' | 'PRIVATE';
  status: string;
  roles: string[];
}

export interface ProcessForModal {
  id: string;
  name: string;
  group: Group;
  creator: User;
  archived: boolean;
  status: 'ENABLED' | 'DISABLED';
  type: 'PUBLIC' | 'PRIVATE';
  staffViewForms: boolean;
  applicantViewProcessLevel: boolean;
  roles?: Role[];
}

export interface AddEditProcessModalProps {
  mode: 'add' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  selectedProcess?: ProcessForModal;
}

export interface CreateProcessData {
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
  groupId: string;
  creatorId: string;
  status: 'ENABLED' | 'DISABLED';
  archived: boolean;
  staffViewForms: boolean;
  applicantViewProcessLevel: boolean;
  roles: string[];
}

export interface UpdateProcessData {
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
  groupId: string;
  status: 'ENABLED' | 'DISABLED';
  archived: boolean;
  staffViewForms: boolean;
  applicantViewProcessLevel: boolean;
  roles: string[];
}

// Process Detail List Types
export interface ProcessDetailApplicant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: string | null;
  googleId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessDetailApplicantProcess {
  applicantProcessId: string;
  applicantId: string;
  applicant: ProcessDetailApplicant;
  status: string;
  completedForms: string[];
  pendingForm?: {
    formId: string;
    nextStepType: string;
    nextStepRoles: string[];
    nextStepSpecifiedTo: string | null;
  };
  editApplicationStatus: boolean;
  processLevel: string;
}

export interface ProcessDetailListProps {
  data: {
    process: {
      processId: string;
      name: string;
      groupId: string;
      status: string;
    };
    applicantProcesses: ProcessDetailApplicantProcess[];
  } | ProcessDetailApplicantProcess[];
  isLoading: boolean;
  isError: boolean;
  processId: string;
  title: string;
  loadingMessage: string;
  errorMessage: string;
  noDataMessage: string;
  baseRoute: string;
  showEditButton?: boolean;
  users?: any[];
}

// Edit Applicant Status Modal Types
export interface EditApplicantProcess {
  applicantProcessId: string;
  status: string;
  processId?: string;
}

export interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantProcess: EditApplicantProcess;
}
