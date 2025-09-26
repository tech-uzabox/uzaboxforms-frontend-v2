import type {   
  FileUploadResponse, 
  FileResponse, 
  PresignedUrlResponse, 
  FileUploadDto, 
  FileDeleteResponse,
  FileServeResponse 
} from '@/types';
import { UtilsService } from '../utils';
import { authorizedAPI } from '@/config/axios.config';

const utils = new UtilsService();

class FileService {
  // POST /files/upload
  async uploadFile({ file, folder }: FileUploadDto): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('private', 'true');
    
    if (folder) {
      formData.append('folder', folder);
    }

    return utils.handleApiRequest(() =>
      authorizedAPI.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  // DELETE /files/{id}
  async deleteFile(id: string): Promise<FileDeleteResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.delete(`/files/${id}`)
    );
  }

  // GET /files/{id}
  async getFileById(id: string): Promise<FileResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/${id}`)
    );
  }

  // GET /files/serve/by-id/{id}
  async serveFileById(id: string): Promise<FileServeResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/serve/by-id/${id}`)
    );
  }

  // GET /files/presigned-url/by-id/{id}
  async getPresignedUrlById(id: string): Promise<PresignedUrlResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/presigned-url/by-id/${id}`)
    );
  }

  // GET /files/presigned-url/by-url/{fileUrl}
  async getPresignedUrlByUrl(fileUrl: string): Promise<PresignedUrlResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/presigned-url/by-url/${fileUrl}`)
    );
  }

  // GET /files/serve/signed/{id}
  async serveFileSigned(id: string): Promise<FileServeResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/serve/signed/${id}`)
    );
  }

  // GET /files/serve/{fileUrl}
  async serveFileByUrl(fileUrl: string): Promise<FileServeResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/files/serve/${fileUrl}`)
    );
  }
}

export const fileService = new FileService();
