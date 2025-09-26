export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  expiresIn: number;
  fileUrl: string;
}

export interface FileUploadDto {
  file: File;
  folder?: string;
}

export interface FileDeleteResponse {
  success: boolean;
  message: string;
}

export interface FileServeResponse {
  url: string;
  expiresIn?: number;
}
