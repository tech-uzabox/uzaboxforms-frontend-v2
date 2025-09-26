import { toast } from "sonner";
import type { Position, PositionFormData } from "@/types";
import { organizationService } from "@/services/organization";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// GET /api/v1/organization - Get all organization positions
export const useGetAllPositions = () =>
  useQuery<Position[], Error>({
    queryKey: ["organization-positions"],
    queryFn: organizationService.getAllPositions,
  });

// GET /api/v1/organization/tree - Get organization tree (all positions)
export const useGetOrganizationTree = () =>
  useQuery<Position[], Error>({
    queryKey: ["organization-tree"],
    queryFn: organizationService.getOrganizationTreeAll,
  });

// GET /api/v1/organization/tree/{userId} - Get organization tree for specific user
export const useGetOrganizationTreeByUser = (userId: string) =>
  useQuery<Position, Error>({
    queryKey: ["organization-tree-user", userId],
    queryFn: () => organizationService.getOrganizationTreeByUser(userId),
    enabled: !!userId,
  });

// GET /api/v1/organization/{id} - Get specific organization position by ID
export const useGetPositionById = (id: string) =>
  useQuery<Position, Error>({
    queryKey: ["organization-position", id],
    queryFn: () => organizationService.getPositionById(id),
    enabled: !!id,
  });

// GET /api/v1/organization/{id}/subordinates - Get subordinates for a specific position
export const useGetSubordinates = (id: string) =>
  useQuery<Position[], Error>({
    queryKey: ["organization-subordinates", id],
    queryFn: () => organizationService.getSubordinates(id),
    enabled: !!id,
  });

// POST /api/v1/organization - Create a new organization position
export const useCreatePosition = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation<Position, Error, PositionFormData>({
    mutationFn: organizationService.createPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-positions"] });
      queryClient.invalidateQueries({ queryKey: ["organization-tree"] });
      queryClient.invalidateQueries({ queryKey: ["organization-tree-user"] });
      queryClient.invalidateQueries({ queryKey: ["organization-subordinates"] });
      toast.success(t('common.positionCreatedSuccessfully'));
    },
  });
};

// PATCH /api/v1/organization/{id} - Update organization position
export const useUpdatePosition = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation<
    Position,
    Error,
    { id: string; formData: PositionFormData }
  >({
    mutationFn: ({ id, formData }) =>
      organizationService.updatePosition(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-positions"] });
      queryClient.invalidateQueries({ queryKey: ["organization-tree"] });
      queryClient.invalidateQueries({ queryKey: ["organization-tree-user"] });
      queryClient.invalidateQueries({ queryKey: ["organization-position"] });
      queryClient.invalidateQueries({ queryKey: ["organization-subordinates"] });
      toast.success(t('common.positionUpdatedSuccessfully'));
    },
  });
};

// DELETE /api/v1/organization/{id} - Delete organization position
export const useDeletePosition = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation<void, Error, string>({
    mutationFn: organizationService.deletePosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-positions"] });
      queryClient.invalidateQueries({ queryKey: ["organization-tree"] });
      queryClient.invalidateQueries({ queryKey: ["organization-tree-user"] });
      queryClient.invalidateQueries({ queryKey: ["organization-position"] });
      queryClient.invalidateQueries({ queryKey: ["organization-subordinates"] });
      toast.success(t('common.positionDeletedSuccessfully'));
    },
  });
};
