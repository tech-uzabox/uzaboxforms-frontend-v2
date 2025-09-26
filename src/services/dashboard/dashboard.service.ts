import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

export interface DashboardParams {
    id?: string;
    formData?: any;
}

export interface CreateDashboardData {
    name: string;
    description?: string;
    allowedUsers?: string[];
    allowedRoles?: string[];
}

class DashboardService {
    getAllDashboards(params?: { search?: string; ownerId?: string }): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get("/dashboards", { params }));
    }

    getDashboardById(id: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get(`/dashboards/${id}`));
    }

    createDashboard(formData: CreateDashboardData): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.post("/dashboards", formData));
    }

    updateDashboard({ formData, id }: DashboardParams): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.patch(`/dashboards/${id}`, formData));
    }

    deleteDashboard(id: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.delete(`/dashboards/${id}`));
    }

    updateWidgetOrder(id: string, widgetOrder: string[]): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.put(`/dashboards/${id}/widget-order`, { widgetOrder }));
    }
}

export const dashboardService = new DashboardService();
