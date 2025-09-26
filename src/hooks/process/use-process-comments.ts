import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    processCommentsService, 
    type ProcessCommentsTypes,
    type CreateProcessCommentData,
    type UpdateProcessCommentData
} from "@/services/process";

// Legacy hooks for backward compatibility
export const userGetAllProcessFormComments = ({ processId, applicantProcessId, formId }: { processId: string, applicantProcessId: string, formId: string }) => 
    useQuery<any, Error, any>({ 
        queryKey: ['process-form-comments', processId, applicantProcessId, formId], 
        queryFn: processCommentsService.getAllProcessFormComments 
    });

export const useSubmitProcessFormComments = () => {
    const queryClient = useQueryClient()
    return useMutation<any, Error, ProcessCommentsTypes>({
        mutationFn: (data: ProcessCommentsTypes) => processCommentsService.submitProcessFormComments(data), 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['process-form-comments'] })
        },
    })
}

// New hooks for the updated API endpoints

// Create a new process comment
export const useCreateProcessComment = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, CreateProcessCommentData>({
        mutationFn: (data: CreateProcessCommentData) => processCommentsService.createProcessComment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['process-comments'] });
            queryClient.invalidateQueries({ queryKey: ['process-form-comments'] });
        },
    });
};

// Get all process comments
export const useGetAllProcessComments = () => 
    useQuery<any, Error>({ 
        queryKey: ['process-comments'], 
        queryFn: processCommentsService.getAllProcessComments 
    });

// Get a specific process comment by ID
export const useGetProcessCommentById = (id: string) => 
    useQuery<any, Error>({ 
        queryKey: ['process-comments', id], 
        queryFn: () => processCommentsService.getProcessCommentById(id),
        enabled: !!id
    });

// Update a process comment
export const useUpdateProcessComment = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { id: string; data: UpdateProcessCommentData }>({
        mutationFn: ({ id, data }) => processCommentsService.updateProcessComment(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['process-comments'] });
            queryClient.invalidateQueries({ queryKey: ['process-comments', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['process-form-comments'] });
        },
    });
};

// Delete a process comment
export const useDeleteProcessComment = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, string>({
        mutationFn: (id: string) => processCommentsService.deleteProcessComment(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['process-comments'] });
            queryClient.removeQueries({ queryKey: ['process-comments', id] });
            queryClient.invalidateQueries({ queryKey: ['process-form-comments'] });
        },
    });
};

// Submit process comment (alternative endpoint)
export const useSubmitProcessComment = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, CreateProcessCommentData>({
        mutationFn: (data: CreateProcessCommentData) => processCommentsService.submitProcessComment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['process-comments'] });
            queryClient.invalidateQueries({ queryKey: ['process-form-comments'] });
        },
    });
};

// Get comments by applicant process and form
export const useGetCommentsByApplicantProcessAndForm = (applicantProcessId: string, formId: string) => 
    useQuery<any, Error>({ 
        queryKey: ['process-comments', 'by-applicant-process-and-form', applicantProcessId, formId], 
        queryFn: () => processCommentsService.getCommentsByApplicantProcessAndForm(applicantProcessId, formId),
        enabled: !!applicantProcessId && !!formId
    });