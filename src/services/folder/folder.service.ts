import type {
  CreateFolderRequest,
  UpdateFolderRequest,
  FolderResponse,
  FoldersResponse,
  DeleteFolderResponse,
} from "@/types";
import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

class FolderService {
  // POST /folders - Create a new folder
  async createFolder(data: CreateFolderRequest): Promise<FolderResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.post("/folders", data)
    );
  }

  // GET /folders - Get all folders
  async getAllFolders(): Promise<FoldersResponse> {
    return utils.handleApiRequest(() => authorizedAPI.get("/folders"));
  }

  // GET /folders/{id} - Get a folder by ID
  async getFolderById(id: string): Promise<FolderResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/folders/${id}`)
    );
  }

  // PATCH /folders/{id} - Update a folder
  async updateFolder(
    id: string,
    data: UpdateFolderRequest
  ): Promise<FolderResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.patch(`/folders/${id}`, data)
    );
  }

  // DELETE /folders/{id} - Delete a folder
  async deleteFolder(id: string): Promise<DeleteFolderResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.delete(`/folders/${id}`)
    );
  }
}

export const folderService = new FolderService();
