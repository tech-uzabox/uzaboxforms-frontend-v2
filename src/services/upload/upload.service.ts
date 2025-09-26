import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

export interface UploadFileDto {
  file: File;
  folder?: string;
}

export interface DeleteFileDto {
  fileName: string;
}

class UploadService {
  async uploadFile({ file, folder }: UploadFileDto) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (folder) {
      formData.append('folder', folder);
    }

    return utils.handleApiRequest(() =>
      authorizedAPI.post("/files/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  async uploadMultipleFiles(files: File[], folder?: string) {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    if (folder) {
      formData.append('folder', folder);
    }

    return utils.handleApiRequest(() =>
      authorizedAPI.post("/files/upload/multiple", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  async deleteFile({ fileName }: DeleteFileDto) {
    return utils.handleApiRequest(() =>
      authorizedAPI.delete(`/files/${fileName}`)
    );
  }

  async getUploadedFiles(folder?: string) {
    const params = folder ? `?folder=${folder}` : '';
    
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files${params}`)
    );
  }

  async getFileUrl(fileName: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/${fileName}`)
    );
  }

  // Upload form files
  async uploadFormFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return utils.handleApiRequest(() =>
      authorizedAPI.post("/upload-form", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  // Upload document for QR code
  async uploadDocument(file: File, qrCodeId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (qrCodeId) {
      formData.append('qrCodeId', qrCodeId);
    }

    return utils.handleApiRequest(() =>
      authorizedAPI.post("/document", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  // Additional file endpoints from backend API
  async getFileById(fileId: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/${fileId}`)
    );
  }

  async serveFileById(fileId: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/serve/by-id/${fileId}`)
    );
  }

  async getPresignedUrlById(fileId: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/presigned-url/by-id/${fileId}`)
    );
  }

  async getPresignedUrlByUrl(fileUrl: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/presigned-url/by-url/${fileUrl}`)
    );
  }

  async serveFileSigned(fileId: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/serve/signed/${fileId}`)
    );
  }

  async serveFileByUrl(fileUrl: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/serve/${fileUrl}`)
    );
  }
}

export const uploadService = new UploadService();
