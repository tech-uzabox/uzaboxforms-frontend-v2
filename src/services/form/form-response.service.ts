import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

export interface FormResponseValues {
    userId: string;
    processId: string;
    formId: string;
    responses: any;
    applicantProcessId: string
}

export interface PublicFormResponseValues extends Omit<FormResponseValues, 'userId' | 'applicantProcessId' | 'processId'> { }

class FormResponseService {
    submitFormResponse(data: FormResponseValues): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.post("/form-responses", data));
    }

    submitPublicFormResponse(data: PublicFormResponseValues): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.post("/form-responses/submit-public", data));
    }

    getAllResponses(): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get("/form-responses"));
    }

    getResponsesByUserId(userId: string): Promise<any> {
        return utils.handleApiRequest(() =>
            authorizedAPI.get(`/form-responses/by-user/${userId}`)
        );
    }

    getResponsesByUserIdAndFormId(
        userId: string,
        formId: string,
        applicantProcessId: string
    ): Promise<any> {
        return utils.handleApiRequest(() =>
            authorizedAPI.get(`/responses/${userId}/${formId}/${applicantProcessId}`)
        );
    }

    getFormResponseById(responseId: string): Promise<any> {
        return utils.handleApiRequest(() =>
            authorizedAPI.get(`/form-responses/${responseId}`)
        );
    }

    updateFormResponse(responseId: string, data: any): Promise<any> {
        return utils.handleApiRequest(() =>
            authorizedAPI.patch(`/form-responses/${responseId}`, data)
        );
    }

    deleteFormResponse(responseId: string): Promise<any> {
        return utils.handleApiRequest(() =>
            authorizedAPI.delete(`/form-responses/${responseId}`)
        );
    }

    submitFormResponseToProcess(data: any): Promise<any> {
        return utils.handleApiRequest(() =>
            authorizedAPI.post("/form-responses/submit", data)
        );
    }
}

export const formResponseService = new FormResponseService();
