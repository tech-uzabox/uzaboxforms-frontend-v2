import type { QrCodeDocumentTypes } from '@/types';
import { qrCodeDocumentService } from '@/services/upload';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Hook to get all QR code documents
export const useGetAllQrCodeDocuments = () =>
    useQuery<any, Error>({
        queryKey: ['qr-code-documents'],
        queryFn: qrCodeDocumentService.getAllQrCodeDocuments
    });

// Hook to create a QR code document
export const useCreateQrCodeDocument = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, QrCodeDocumentTypes>({
        mutationFn: qrCodeDocumentService.createQrCodeDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['qr-code-documents'] });
        },
    });
};

// Hook to get a single QR code document by id
export const useGetQrCodeDocumentById = (id: string) =>
    useQuery<any, Error>({
        queryKey: ['qr-code-documents', id],
        queryFn: () => qrCodeDocumentService.getQrCodeDocumentById(id),
        enabled: !!id,
    });

// Hook to update a QR code document
export const useUpdateQrCodeDocument = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, QrCodeDocumentTypes>({
        mutationFn: qrCodeDocumentService.updateQrCodeDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['qr-code-documents'] });
        },
    });
};

// Hook to delete a QR code document
export const useDeleteQrCodeDocument = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { qrCodeId: string }>({
        mutationFn: qrCodeDocumentService.deleteQrCodeDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['qr-code-documents'] });
        },
    });
};

// Hook to get QR code documents by creatorId
export const useGetQrCodeDocumentsByCreatorId = (creatorId: string) =>
    useQuery<any, Error>({
        queryKey: ['qr-code-documents', 'creator', creatorId],
        queryFn: () => qrCodeDocumentService.getQrCodeDocumentsByCreatorId(creatorId),
        enabled: !!creatorId,
    });