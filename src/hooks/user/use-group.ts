import { toast } from "sonner";
import { GroupWithRoles, CreateGroupData } from "@/types";
import { groupService, type GroupParams } from "@/services/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllGroups = () =>
  useQuery<GroupWithRoles[], Error>({
    queryKey: ["Groups"],
    queryFn: groupService.getAllGroups,
  });

export const useUpdateGroup = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<GroupWithRoles, Error, GroupParams>({
    mutationFn: groupService.updateGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Groups"] });
      toast.success("Group updated successfully");
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Error updating group:', error);
      toast.error("Failed to update group");
    },
  });
};

export const useCreateGroup = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<GroupWithRoles, Error, CreateGroupData>({
    mutationFn: groupService.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Groups"] });
      toast.success("Group created successfully");
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Error creating group:', error);
      toast.error("Failed to create group");
    },
  });
};

