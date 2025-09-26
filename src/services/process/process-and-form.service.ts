import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

export interface ProcessAndFormsTypes {
    id?: string;
    formData?: any;
}

class ProcessAndFormService {
    getAllProccessAndForms(): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get('/process-forms'));
    }

    createProcessAndForm(processId: string, formData: any): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.post(`/processes/submit-form/${processId}`, formData));
    }

    updateProcessAndForm({ formData, id }: ProcessAndFormsTypes): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.put(`/process-forms/${id}`, formData));
    }

    getProcessAndFormByProcessId({ queryKey }: any) {
        const [_, formId] = queryKey;
        return utils.handleApiRequest(() => authorizedAPI.get(`/process-forms/${formId}`));
    }

    getProccessAndForm({ queryKey }: any): Promise<any> {
        const [_, processId] = queryKey;
        return utils.handleApiRequest(() => authorizedAPI.get(`/processes/${processId}`));
    }
}

export const processAndFormService = new ProcessAndFormService();
