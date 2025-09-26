import { authorizedAPI } from "@/config/axios.config";
import { UtilsService } from "../utils";

const utils = new UtilsService();

export interface formDataTypes{
    userId: string;
    processId: string;
    applicantProcessId: string;
    formId: string;
    formRoleIds: string[];
}

class ProcessedApplicationsService {
    createProcessedApplication(formData: formDataTypes): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.post('/processed-applications', formData));
    }

    getProcessedApplications({ queryKey }: any): Promise<any> {
        const [_, userId] = queryKey;
        return utils.handleApiRequest(() => authorizedAPI.get(`/processed-applications/${userId}`));
    }

    getProcessedApplicationsForProcess({ queryKey }: any): Promise<any> {
        const [_, userId, processId] = queryKey;
        return utils.handleApiRequest(() => authorizedAPI.get(`/processed-applications/${userId}/${processId}`));
    }

    getSingleProcessedApplication({ queryKey }: any): Promise<any> {
        const [_, userId, processId, applicantProcessId] = queryKey;
        return utils.handleApiRequest(() => authorizedAPI.get(`/processed-applications/${userId}/${processId}/${applicantProcessId}`));
    }
}

export const processedApplicationsService = new ProcessedApplicationsService();
