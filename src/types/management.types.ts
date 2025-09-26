export type ImageType = "HEADER" | "FOOTER";

export interface ImageData {
  id: string;
  fileName: string;
  type: ImageType;
  fileUrl: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface UploadImageProps {
  id: string;
  type: ImageType;
}

export interface UploadFileProps {
  file: File;
  type: ImageType;
}

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data?: ImageData;
}

export interface ImageDeleteResponse {
  success: boolean;
  message: string;
}

export type GetAllImagesResponse = ImageData[];
