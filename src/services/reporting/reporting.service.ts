import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

class ReportingService {
    getProcessesReport(): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get("/reporting/processes")
        );
    }

    getProcessReport(processId: string): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get(`/reporting/processes/${processId}`)
        );
    }
}

export const reportingService = new ReportingService();
