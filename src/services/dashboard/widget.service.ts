import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

export interface WidgetParams {
    id?: string;
    formData?: CreateWidgetData | any;
}

export interface CreateWidgetData {
    dashboardId: string;
    title: string;
    description?: string;
    visualizationType: string;
    formId?: string;
    metrics?: Array<{
        id: string;
        label?: string;
        formId: string;
        fieldId?: string;
        systemField?: string;
        aggregation: string;
        appearance?: {
            color?: string;
            lineStyle?: string;
            barStyle?: string;
        };
    }>;
    groupBy?: {
        kind?: string;
        field?: string;
        fieldId?: string;
        systemField?: string;
        timeBucket?: string;
        dateGranularity?: string;
        includeMissing?: boolean;
    };
    dateRange?: {
        preset: string;
        from?: Date | string;
        to?: Date | string;
        startDate?: Date | string | null;
        endDate?: Date | string | null;
    };
    configuration?: {
        metrics?: any[];
        aggregationType?: string;
        filters?: any[];
        colorPalette?: string;
        showLegend?: boolean;
        showLabels?: boolean;
        appearance?: {
            backgroundColor?: string;
            paletteMode?: string;
            presetCategoricalPaletteId?: string;
            customSeriesColors?: string[];
            presetSequentialPaletteId?: string;
            legend?: boolean;
            barOrientation?: string;
            barCombinationMode?: string;
            lineStyle?: string;
            showPoints?: boolean;
            pointSize?: number;
            showGrid?: boolean;
            gridStyle?: string;
            gridColor?: string;
            showXAxisLabels?: boolean;
            showYAxisLabels?: boolean;
            xAxisLabelRotation?: number;
        };
        xField?: string;
        yField?: string;
        groupByField?: string;
        dateField?: string;
        valueField?: string;
        multiMetrics?: string[];
    };
    allowedUsers?: string[];
    allowedRoles?: string[];
    topN?: number;
    sort?: string;
    combinationMode?: string;
    options?: any;
    realTime?: {
        enabled: boolean;
        throttleSeconds: number;
    };
}

class WidgetService {
    getAllWidgets(params?: { dashboardId?: string; type?: string }): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get("/widgets", { params }));
    }

    getWidgetById(id: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get(`/widgets/${id}`));
    }

    getWidgetData(id: string, refresh = false): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get(`/widgets/${id}/data${refresh ? '?refresh=true' : ''}`));
    }

    createWidget(formData: CreateWidgetData): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.post("/widgets", formData));
    }

    updateWidget({ formData, id }: WidgetParams): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.put(`/widgets/${id}`, formData));
    }

    deleteWidget(id: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.delete(`/widgets/${id}`));
    }

    bulkRefreshWidgets(widgetIds: string[]): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.post("/widgets/bulk-refresh", { widgetIds }));
    }
}

export const widgetService = new WidgetService();
