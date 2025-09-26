import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { managementService } from '@/services/management';
import type { 
  UploadImageProps, 
  UploadFileProps, 
  ImageUploadResponse, 
  ImageDeleteResponse, 
  GetAllImagesResponse 
} from '@/types';

export const useDeleteImage = () => {
    const queryClient = useQueryClient()
    return useMutation<ImageDeleteResponse, Error, UploadImageProps>({
        mutationFn: managementService.deleteImage, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-images'] })
        },
    })
}

export const useUploadImage = () => {
    const queryClient = useQueryClient()
    return useMutation<ImageUploadResponse, Error, UploadFileProps>({
        mutationFn: managementService.uploadImage, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-images'] })
        },
    })
}

export const useGetAllImages = () => useQuery<GetAllImagesResponse, Error>({ 
    queryKey: ['get-all-images'], 
    queryFn: managementService.getAllImages 
})