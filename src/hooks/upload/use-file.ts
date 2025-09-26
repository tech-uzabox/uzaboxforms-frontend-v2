import type {   
  FileUploadDto, 
  FileUploadResponse, 
  FileResponse, 
  PresignedUrlResponse, 
  FileDeleteResponse,
  FileServeResponse 
} from '@/types';
import { fileService } from '@/services/upload';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorizedAPI } from '@/config/axios.config';

// Hook to upload a file
export const useUploadFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<FileUploadResponse, Error, FileUploadDto>({
    mutationFn: fileService.uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

// Hook to delete a file
export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<FileDeleteResponse, Error, string>({
    mutationFn: fileService.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

// Hook to get a file by ID
export const useGetFileById = (id: string) => {
  return useQuery<FileResponse, Error>({
    queryKey: ['file', id],
    queryFn: () => fileService.getFileById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to serve a file by ID and convert to blob URL
export const useServeFileById = (id: string) => {
  return useQuery<string, Error>({
    queryKey: ['file-serve', id],
    queryFn: async () => {
      const response = await authorizedAPI.get(`/files/serve/by-id/${id}`, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'image/jpeg' });
      return URL.createObjectURL(blob);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get presigned URL by file ID
export const useGetPresignedUrlById = (id: string) => {
  return useQuery<PresignedUrlResponse, Error>({
    queryKey: ['file-presigned-url', id],
    queryFn: () => fileService.getPresignedUrlById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get presigned URL by file URL
export const useGetPresignedUrlByUrl = (fileUrl: string) => {
  return useQuery<PresignedUrlResponse, Error>({
    queryKey: ['file-presigned-url', 'by-url', fileUrl],
    queryFn: () => fileService.getPresignedUrlByUrl(fileUrl),
    enabled: !!fileUrl,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to serve a file with signed URL
export const useServeFileSigned = (id: string) => {
  return useQuery<FileServeResponse, Error>({
    queryKey: ['file-serve-signed', id],
    queryFn: () => fileService.serveFileSigned(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to serve a file by URL
export const useServeFileByUrl = (fileUrl: string) => {
  return useQuery<FileServeResponse, Error>({
    queryKey: ['file-serve', 'by-url', fileUrl],
    queryFn: () => fileService.serveFileByUrl(fileUrl),
    enabled: !!fileUrl,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
