import { ProcessTypes } from '@/types';
import { UtilsService } from '../utils';
import { authorizedAPI } from "@/config/axios.config";
import { CreateProcessData, UpdateProcessData } from '@/types/process.types';

const utils = new UtilsService();

class ProcessService {
    // Process Management
    getAllProcesses(): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get('/processes'));
    }

    createProcess(processData: CreateProcessData): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.post('/processes', processData));
    }

    updateProcess(processId: string, processData: UpdateProcessData): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.patch(`/processes/${processId}`, processData));
    }

    getProcessById({ queryKey }: any) {
        const [_, formId] = queryKey;
        return utils.handleApiRequest(() => authorizedAPI.get(`/processes/${formId}`));
    }

    duplicateProcess({ id }: { id: string }): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.post(`/processes/duplicate`, { processId: id }));
    }

    getProcessesByFormId(formId: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get(`/processes/form/${formId}`));
    }

    // Note: Incoming applications methods moved to userIncomingService and adminIncomingService

    sendbackProcess({ applicantProcessId, formId }: ProcessTypes): Promise<any> {
        return utils.handleApiRequest(() =>
            authorizedAPI.patch(`/pending-processes/sendback/${applicantProcessId}`, { formId })
        );
    }

}

export const processService = new ProcessService();
