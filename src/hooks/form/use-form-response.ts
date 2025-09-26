import { useMutation, useQuery } from "@tanstack/react-query";
import { formResponseService, type PublicFormResponseValues } from "@/services/form";

export const useSubmitPublicFormResponse = () => useMutation<any, Error, PublicFormResponseValues>({ mutationFn: formResponseService.submitPublicFormResponse });

export const useGetAllFormResponses = () => useQuery<any, Error>({ queryKey: ["form-responses"], queryFn: formResponseService.getAllResponses });

export const useGetResponsesByUserId = (userId: string) =>
    useQuery<any, Error>({
        queryKey: ["responses", userId],
        queryFn: () => formResponseService.getResponsesByUserId(userId),
    });

export const useGetResponsesByUserIdAndFormId = ({ userId, formId, applicantProcessId }: { userId: string, formId: string, applicantProcessId: string }, options?: any) =>
    useQuery<any, Error>({
        queryKey: ["responses", userId, formId, applicantProcessId],
        queryFn: () => formResponseService.getResponsesByUserIdAndFormId(userId, formId, applicantProcessId),
        ...options,
    });
