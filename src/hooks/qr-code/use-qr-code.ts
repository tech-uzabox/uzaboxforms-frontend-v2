import { toast } from "sonner";
import { qrCodeService } from "@/services/upload";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { GenerateQRCodeDto, QRCodeResponse, QRCodeListResponse } from "@/types";

// Generate QR code
export function useGenerateQRCode() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<QRCodeResponse, Error, GenerateQRCodeDto>({
    mutationFn: (data: GenerateQRCodeDto) => qrCodeService.generateQRCode(data),
    onSuccess: (response) => {
      // Handle both response formats: with success wrapper or direct data
      if ((response.success === true) || (response.qrCodeDataUrl && response.qrCodeId)) {
        toast.success(t('common.qrCodeGeneratedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
      } else {
        toast.error(t('common.qrCodeGenerationFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.qrCodeGenerationFailed'));
    },
  });
}

// Get QR code by ID
export function useGetQRCodeById(id: string) {
  return useQuery<QRCodeResponse, Error>({
    queryKey: ["qr-code", id],
    queryFn: () => qrCodeService.getQRCodeById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

// Update QR code
export function useUpdateQRCode() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<QRCodeResponse, Error, { id: string; data: Partial<GenerateQRCodeDto> }>({
    mutationFn: ({ id, data }) => qrCodeService.updateQRCode(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success(t('common.qrCodeUpdatedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ['qr-code', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
      } else {
        toast.error(t('common.qrCodeUpdateFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.qrCodeUpdateFailed'));
    },
  });
}

// Delete QR code
export function useDeleteQRCode() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: (id: string) => qrCodeService.deleteQRCode(id),
    onSuccess: (response, id) => {
      if (response.success) {
        toast.success(t('common.qrCodeDeletedSuccessfully'));
        queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
        queryClient.removeQueries({ queryKey: ['qr-code', id] });
      } else {
        toast.error(t('common.qrCodeDeleteFailed'));
      }
    },
    onError: () => {
      toast.error(t('common.qrCodeDeleteFailed'));
    },
  });
}

// Get all QR codes
export function useGetAllQRCodes(filters?: any) {
  return useQuery<QRCodeListResponse, Error>({
    queryKey: ["qr-codes", filters],
    queryFn: () => qrCodeService.getAllQRCodes(filters),
    staleTime: 5 * 60 * 1000,
  });
}

// Get QR codes by creator
export function useGetQRCodesByCreator(creatorId: string) {
  return useQuery<QRCodeListResponse, Error>({
    queryKey: ["qr-codes", "creator", creatorId],
    queryFn: () => qrCodeService.getQRCodesByCreator(creatorId),
    staleTime: 5 * 60 * 1000,
    enabled: !!creatorId,
  });
}

// Get QR code by QR code ID
export function useGetQRCodeByQrCodeId(qrCodeId: string) {
  return useQuery<QRCodeResponse, Error>({
    queryKey: ["qr-code", "qr-code-id", qrCodeId],
    queryFn: () => qrCodeService.getQRCodeByQrCodeId(qrCodeId),
    staleTime: 5 * 60 * 1000,
    enabled: !!qrCodeId,
  });
}
