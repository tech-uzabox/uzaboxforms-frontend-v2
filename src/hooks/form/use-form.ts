import {
  formService,
  CreateFormDto,
  UpdateFormDto,
  FormFilters,
} from "@/services/form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// Get all forms with pagination and filtering
export function useGetAllForms(filters?: FormFilters) {
  return useQuery({
    queryKey: ["forms", "all", filters],
    queryFn: () => formService.getAllForms(filters),
    staleTime: 5 * 60 * 1000,
  });
}

// Get form by ID
export function useGetFormById(id: string) {
  return useQuery({
    queryKey: ["form", id],
    queryFn: () => formService.getFormById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

// Create form
export function useCreateForm() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateFormDto) => formService.createForm(data),
    onSuccess: (response) => {
      if (response) {
        toast.success(t('common.formCreatedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ['folders'] });
      }
    },
    onError: () => {
      toast.error(t('common.operationFailed'));
    },
  });
}

// Update form
export function useUpdateForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFormDto }) =>
      formService.updateForm(id, data),
    onSuccess: (response, variables) => {
      if (response) {
        toast.success(t('common.formUpdatedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ['form', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        navigate(-1)
      } else {
        toast.error(t('common.operationFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.operationFailed'));
    },
  });
}


// Delete form
export function useDeleteForm() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => formService.deleteForm(id),
    onSuccess: (response, deletedId) => {
      if (response) {
        toast.success(t('common.formDeletedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        queryClient.removeQueries({ queryKey: ['form', deletedId] });
      } else {
        toast.error(t('common.operationFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.operationFailed'));
    },
  });
}

// Get form responses
export function useGetFormResponses(formId: string, filters?: any) {
  return useQuery({
    queryKey: ["form-responses", formId, filters],
    queryFn: () => formService.getFormResponses(formId, filters),
    staleTime: 2 * 60 * 1000,
    enabled: !!formId,
  });
}

// Submit form response
export function useSubmitFormResponse() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ formId, data }: { formId: string; data: any }) =>
      formService.submitFormResponse(formId, data),
    onSuccess: (response, variables) => {
      if (response) {
        toast.success(t('common.responseSubmittedSuccessfully'));
        queryClient.invalidateQueries({
          queryKey: ['form-responses', variables.formId],
        });
      } else {
        toast.error(t('common.responseSubmissionFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.responseSubmissionFailed'));
    },
  });
}

// Duplicate form
export function useDuplicateForm() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ formId, newName }: { formId: string; newName: string }) =>
      formService.duplicateForm(formId, newName),
    onSuccess: (response) => {
      if (response) {
        toast.success(t('common.duplicateFormSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ['folders'] });
      } else {
        toast.error(t('common.operationFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.operationFailed'));
    },
  });
}

// Publish form
export function usePublishForm() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (formId: string) => formService.publishForm(formId),
    onSuccess: (response, formId) => {
      if (response) {
        toast.success(t('common.formPublishedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ['form', formId] });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
      } else {
        toast.error(t('common.formPublishFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.formPublishFailed'));
    },
  });
}

// Unpublish form
export function useUnpublishForm() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (formId: string) => formService.unpublishForm(formId),
    onSuccess: (response, formId) => {
      if (response) {
        toast.success(t('common.formUnpublishedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ['form', formId] });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
      } else {
        toast.error(t('common.formUnpublishFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.formUnpublishFailed'));
    },
  });
}

// Get form analytics
export function useGetFormAnalytics(formId: string) {
  return useQuery({
    queryKey: ["form-analytics", formId],
    queryFn: () => formService.getFormAnalytics(formId),
    staleTime: 5 * 60 * 1000,
    enabled: !!formId,
  });
}

// Export form responses
export function useExportFormResponses() {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({
      formId,
      format,
    }: {
      formId: string;
      format: 'csv' | 'xlsx' | 'pdf';
    }) => formService.exportFormResponses(formId, format),
    onSuccess: (response) => {
      if (response) {
        toast.success(t('common.exportCompletedSuccessfully'));
      } else {
        toast.error(t('common.exportFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.exportFailed'));
    },
  });
}
