import { authorizedAPI } from "@/config/axios.config";
import { UtilsService } from "../utils";

const utils = new UtilsService();

class ReportsService {
    getProcesses(): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get('/reporting/processes'));
    }

    getAllApplicantProcessesPerProcess(processId: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get(`/reporting/processes/${processId}`));
    }
}

export const reportsService = new ReportsService();
