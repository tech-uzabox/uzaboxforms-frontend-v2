import type {
  CreateFolderRequest,
  UpdateFolderRequest,
  FolderResponse,
  FoldersResponse,
  DeleteFolderResponse,
} from "@/types";
import { folderService } from "@/services/folder";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hook to get all folders
export const useGetAllFolders = () => {
  return useQuery<FoldersResponse, Error>({
    queryKey: ["folders"],
    queryFn: folderService.getAllFolders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get a folder by ID
export const useGetFolderById = (id: string) => {
  return useQuery<FolderResponse, Error>({
    queryKey: ["folder", id],
    queryFn: () => folderService.getFolderById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a folder
export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation<FolderResponse, Error, CreateFolderRequest>({
    mutationFn: folderService.createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

// Hook to update a folder
export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    FolderResponse,
    Error,
    { id: string; data: UpdateFolderRequest }
  >({
    mutationFn: ({ id, data }) => folderService.updateFolder(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folder", variables.id] });
    },
  });
};

// Hook to delete a folder
export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteFolderResponse, Error, string>({
    mutationFn: folderService.deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};
