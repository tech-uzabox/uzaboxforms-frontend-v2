export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface formParamsProps {
  userId: string;
  processId: string;
  applicantProcessId: string;
  formId: string;
}