import { Role } from '@/types';
import { roleService, type RoleParams } from '@/services/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllRoles = () => useQuery<Role[], Error>({ 
    queryKey: ["roles"], 
    queryFn: async () => {
        const response = await roleService.getAllRoles();
        return response || [];
    }
});

export const useUpdateRole = () => {
    const queryClient = useQueryClient()
    return useMutation<Role, Error, RoleParams>({
        mutationFn: roleService.updateRole, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] })
        },
    })
}

export const useGetRolesByUserId = (userId: string) => useQuery<Role[], Error>({ 
    queryKey: ['user-roles', userId], 
    queryFn: async () => {
        const response = await roleService.getRolesByUserId({ queryKey: ['user-roles', userId] });
        return response || [];
    }
});

export const useCreateRole = () => {
    const queryClient = useQueryClient()
    return useMutation<Role, Error, Partial<Role>>({
        mutationFn: roleService.createRole, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] })
        },
    })
}
