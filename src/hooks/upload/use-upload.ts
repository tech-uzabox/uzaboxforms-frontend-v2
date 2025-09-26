import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { uploadService, UploadFileDto, DeleteFileDto } from "@/services/upload";

// Upload single file
export function useUploadFile() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: UploadFileDto) => uploadService.uploadFile(data),
    onSuccess: (response) => {
      if (response) {
        toast.success(t('common.fileUploadedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ["uploaded-files"] });
      } else {
        toast.error(t('common.fileUploadFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.fileUploadFailed'));
    },
  });
}

// Upload multiple files
export function useUploadMultipleFiles() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ files, folder }: { files: File[]; folder?: string }) =>
      uploadService.uploadMultipleFiles(files, folder),
    onSuccess: (response) => {
      if (response) {
        toast.success(t('common.filesUploadedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ["uploaded-files"] });
      } else {
        toast.error(t('common.filesUploadFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.filesUploadFailed'));
    },
  });
}

// Delete file
export function useDeleteFile() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: DeleteFileDto) => uploadService.deleteFile(data),
    onSuccess: (response) => {
      if (response) {
        toast.success(t('common.fileDeletedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ["uploaded-files"] });
      } else {
        toast.error(t('common.fileDeleteFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.fileDeleteFailed'));
    },
  });
}

// Get uploaded files
export function useGetUploadedFiles(folder?: string) {
  return useQuery({
    queryKey: ["uploaded-files", folder],
    queryFn: () => uploadService.getUploadedFiles(folder),
    staleTime: 2 * 60 * 1000,
  });
}

// Get file URL
export function useGetFileUrl(fileName: string) {
  return useQuery({
    queryKey: ["file-url", fileName],
    queryFn: () => uploadService.getFileUrl(fileName),
    staleTime: 10 * 60 * 1000,
    enabled: !!fileName,
  });
}

// Upload form file
export function useUploadFormFile() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (file: File) => uploadService.uploadFormFile(file),
    onSuccess: (response) => {
      if (response) {
        toast.success(t('common.formFileUploadedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ["uploaded-files"] });
      } else {
        toast.error(t('common.formFileUploadFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.formFileUploadFailed'));
    },
  });
}

// Upload document for QR code
export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ file, qrCodeId }: { file: File; qrCodeId?: string }) =>
      uploadService.uploadDocument(file, qrCodeId),
    onSuccess: (response) => {
      if (response) {
        toast.success(t('common.documentUploadedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ["uploaded-files"] });
        queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
      } else {
        toast.error(t('common.documentUploadFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.documentUploadFailed'));
    },
  });
}
