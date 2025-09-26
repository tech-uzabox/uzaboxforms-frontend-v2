import type {  
  UploadImageProps, 
  UploadFileProps, 
  ImageUploadResponse, 
  ImageDeleteResponse, 
  GetAllImagesResponse 
} from "@/types";
import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";
 

const utils = new UtilsService();

class ManagementService {
  // Upload file directly to management endpoint
  async uploadImage({ file, type }: UploadFileProps): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("private", "true");

    return utils.handleApiRequest(() =>
      authorizedAPI.post("/management/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
  }

  deleteImage(formData: UploadImageProps): Promise<ImageDeleteResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.delete("/management/delete-image", { data: formData })
    );
  }

  getAllImages(): Promise<GetAllImagesResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get("/management/get-all-images")
    );
  }
}

export const managementService = new ManagementService();
