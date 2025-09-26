import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

class AnalyticsService {
    getFormAnalytics(processId: string, formId: string): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get(`/analytics/form/${processId}/${formId}`)
        );
    }

    getApplicationsAnalytics(): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get("/analytics/applications")
        );
    }

    getProcessesAnalytics(): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get("/analytics/processes")
        );
    }

    getFormResponsesAnalytics(): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get("/analytics/form-responses")
        );
    }

    getMonthlyApplicantProcessesCount(): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get("/analytics/monthly-applicant-processes-count")
        );
    }

    getProcessDistribution(): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get("/analytics/process-distribution")
        );
    }
}

export const analyticsService = new AnalyticsService();
