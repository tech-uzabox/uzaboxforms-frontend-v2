import { toast } from 'sonner';
import { processService } from '@/services/process';
import { CreateProcessData, UpdateProcessData } from '@/types/process.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllProcesses = () => useQuery<any, Error>({
    queryKey: ["processes"],
    queryFn: processService.getAllProcesses
});

export const useCreateProcess = (onSuccess?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation<any, Error, CreateProcessData>({
        mutationFn: processService.createProcess,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['processes'] })
            toast.success("Process created successfully");
            onSuccess?.();
        },
        onError: (error) => {
            console.error('Error creating process:', error);
            toast.error("Failed to create process");
        },
    })
}

export const useUpdateProcess = (onSuccess?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation<any, Error, { processId: string; processData: UpdateProcessData }>({
        mutationFn: ({ processId, processData }) => processService.updateProcess(processId, processData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['processes'] })
            toast.success("Process updated successfully");
            onSuccess?.();
        },
        onError: (error) => {
            console.error('Error updating process:', error);
            toast.error("Failed to update process");
        },
    })
}

export const useGetProcessById = (formId: string) => useQuery<any, Error, any>({
    queryKey: ['process', formId],
    queryFn: processService.getProcessById
});

export const useDuplicateProcess = () => {
    const queryClient = useQueryClient()
    return useMutation<any, Error, { id: string }>({
        mutationFn: processService.duplicateProcess,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['processes'] })
        },
    })
}

export const useGetProcessesByFormId = (formId: string) => useQuery<any, Error, any>({
    queryKey: ['processes', 'form', formId],
    queryFn: () => processService.getProcessesByFormId(formId),
    enabled: !!formId
});
