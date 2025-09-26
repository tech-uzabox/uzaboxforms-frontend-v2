import { toast } from "sonner";
import { userService } from "@/services/user/user.service";
import type { CreateUserData, UpdateUserData } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllUsers = (params?: { roleIds?: string[]; names?: string[] }) => {
    return useQuery<any, Error>({
        queryKey: ["users", params],
        queryFn: () => userService.getAllUsers(params),
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, CreateUserData>({
        mutationFn: userService.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};

export const useUpdateUser = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { userId: string; userData: UpdateUserData }>({
        mutationFn: ({ userId, userData }) => userService.updateUser(userId, userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User updated successfully");
            onSuccess?.();
        },
        onError: (error) => {
            console.error('Error updating user:', error);
            toast.error("Failed to update user");
        },
    });
};

export const useGetUserById = (userId: string) => {
    return useQuery<any, Error>({
        queryKey: ["user", userId],
        queryFn: () => userService.getUserById(userId),
        enabled: !!userId,
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, string>({
        mutationFn: userService.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};

export const useChangeUserPassword = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { userId: string; passwordData: { currentPassword: string; newPassword: string } }>({
        mutationFn: ({ userId, passwordData }) => userService.changeUserPassword(userId, passwordData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};
