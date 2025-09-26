import {
  formFieldsService,
  type FormField,
  type MultipleFormFieldsResponse,
} from "@/services/form";
import { useQueries, useQuery } from "@tanstack/react-query";

// Hook to get fields for a single form
export const useGetFormFields = (formId: string) => {
  return useQuery<any, Error>({
    queryKey: ["form-fields", formId],
    queryFn: () => formFieldsService.getFormFields(formId),
    enabled: !!formId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes since form designs don't change often
  });
};

// Hook to get fields for multiple forms
export const useGetMultipleFormFields = (formIds: string[]) => {
  return useQuery<MultipleFormFieldsResponse, Error>({
    queryKey: ["form-fields-multiple", formIds.sort()],
    queryFn: () => formFieldsService.getMultipleFormFields(formIds),
    enabled: formIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

// Custom hook to handle multiple individual form field queries safely
export const useMultipleIndividualFormFields = (formIds: string[]) => {
  const queries = useQueries({
    queries: formIds.map((formId) => ({
      queryKey: ["form-fields", formId],
      queryFn: () => formFieldsService.getFormFields(formId),
      enabled: !!formId,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes since form designs don't change often
    })),
  });

  // Combine results
  const formFieldsMap: Record<string, FormField[]> = {};
  const allFields: FormField[] = [];
  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.error);

  queries.forEach((query, index) => {
    const formId = formIds[index];
    if (formId && query.data) {
      const formFields = query.data.formFields || [];
      formFieldsMap[formId] = formFields;
      allFields.push(...formFields);
    }
  });

  return {
    formFieldsMap,
    allFields,
    isLoading,
    error: hasError,
  };
};

// Helper hook to get fields for widget forms (convenience hook)
export const useGetWidgetFormFields = (formIds: string[]) => {
  const { data, isLoading, error } = useGetMultipleFormFields(formIds);

  return {
    formFieldsMap: data?.formFieldsMap || {},
    allFields: data?.allFields || [],
    systemFields: data?.systemFields || [],
    isLoading,
    error,

    // Helper functions
    getFieldsForForm: (formId: string) => {
      if (!formId || !data?.formFieldsMap) {
        return [];
      }
      return data.formFieldsMap[formId] || [];
    },
    getFieldById: (fieldId: string, formId?: string) => {
      if (formId && data?.formFieldsMap[formId]) {
        return data.formFieldsMap[formId].find((field) => field.id === fieldId);
      }
      return data?.allFields.find((field) => field.id === fieldId);
    },
    getFieldsByType: (type: string, formId?: string) => {
      const fields =
        formId && data?.formFieldsMap[formId]
          ? data.formFieldsMap[formId]
          : data?.allFields || [];
      return fields.filter((field) => field.type === type);
    },
    getSelectableFields: (formId?: string) => {
      const fields =
        formId && data?.formFieldsMap[formId]
          ? data.formFieldsMap[formId]
          : data?.allFields || [];
      return fields.filter((field) =>
        ["text", "number", "select", "datetime", "date", "boolean"].includes(
          field.type
        )
      );
    },
    getGroupableFields: (formId?: string) => {
      const fields =
        formId && data?.formFieldsMap[formId]
          ? data.formFieldsMap[formId]
          : data?.allFields || [];
      return fields.filter(
        (field) =>
          ["select", "boolean", "date", "datetime"].includes(field.type) ||
          field.isSystemField
      );
    },
  };
};
