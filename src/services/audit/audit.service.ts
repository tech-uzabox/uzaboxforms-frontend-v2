import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

export interface AuditLogFilters {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
}

class AuditService {
    getAuditLogs(filters?: AuditLogFilters): Promise<any> {
        const params = new URLSearchParams();
        
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }
        
        return utils.handleApiRequest(() => 
            authorizedAPI.get(`/logs?${params.toString()}`)
        );
    }

    getAuditLogTypes(): Promise<any> {
        return utils.handleApiRequest(() => 
            authorizedAPI.get("/logs/types")
        );
    }
}

export const auditService = new AuditService();
