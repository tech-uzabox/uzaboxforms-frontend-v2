import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

class UploadLegacyService {
    uploadFilesApi(files: File[]): Promise<{ id: string; name: string }[]> {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        return utils.handleApiRequest(() =>
            authorizedAPI.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
        );
    }

    getJobStatusApi(id: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get(`/upload/status/${id}`));
    }
}

export const uploadLegacyService = new UploadLegacyService();
