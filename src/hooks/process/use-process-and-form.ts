import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { processAndFormService, type ProcessAndFormsTypes } from '@/services/process';

export const useGetAllProcessAndForms = () => useQuery<any, Error>({ queryKey: ["process-forms"], queryFn: processAndFormService.getAllProccessAndForms });

export const useCreateProcessAndForm = () => {
    const queryClient = useQueryClient()
    return useMutation<any, Error, { processId: string; formData: any }>({
        mutationFn: ({ processId, formData }) => processAndFormService.createProcessAndForm(processId, formData), 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['process-forms'] })
        },
    })
}
    
export const useUpdateProcessAndForms = () => {
    const queryClient = useQueryClient()
    return useMutation<any, Error, ProcessAndFormsTypes>({
        mutationFn: processAndFormService.updateProcessAndForm, onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['process-forms'] })
        },
    })
}

export const useGetProcessAndFormByProcessId = (formId: string) => useQuery<any, Error, any>({ queryKey: ['process-forms', formId], queryFn: processAndFormService.getProcessAndFormByProcessId });

export const useGetProcessAndForm = (porcessId: string, _formId: string) => useQuery<any, Error, any>({ queryKey: ['processes', porcessId], queryFn: processAndFormService.getProccessAndForm });