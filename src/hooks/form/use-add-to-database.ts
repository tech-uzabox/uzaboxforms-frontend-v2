import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addToDatabaseService, type AddToDatabaseParams } from '@/services/form';

export const useGetAllAddToDatabases = () => {
    return useQuery<any, Error>({
        queryKey: ['add-to-database'],
        queryFn: addToDatabaseService.getAllAddToDatabases,
    });
};

export const useGetAddToDatabaseById = (id: string) => {
    return useQuery<any, Error>({
        queryKey: ['add-to-database', id],
        queryFn: () => addToDatabaseService.getAddToDatabaseById(id),
        enabled: !!id,
    });
};

export const useCreateAddToDatabase = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, AddToDatabaseParams>({
        mutationFn: addToDatabaseService.createAddToDatabase,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['add-to-database'] });
        },
    });
};

export const useUpdateAddToDatabase = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { id: string, data: AddToDatabaseParams }>({
        mutationFn: ({ id, data }) => addToDatabaseService.updateAddToDatabase(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['add-to-database'] });
        },
    });
};
