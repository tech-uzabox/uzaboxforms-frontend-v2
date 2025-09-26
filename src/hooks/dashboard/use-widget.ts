
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { widgetService, type WidgetParams, type CreateWidgetData } from "@/services/dashboard";

export const useGetAllWidgets = (params?: { dashboardId?: string; type?: string }) => {
    return useQuery<any, Error>({
        queryKey: ["widgets", params],
        queryFn: () => widgetService.getAllWidgets(params),
    });
};

export const useGetWidget = (id: string, options?: { enabled?: boolean }) => {
    return useQuery<any, Error>({
        queryKey: ["widget", id],
        queryFn: () => widgetService.getWidgetById(id),
        enabled: options?.enabled !== false && !!id,
    });
};

export const useGetWidgetData = (id: string, refresh = false) => {
    return useQuery<any, Error>({
        queryKey: ["widget-data", id, refresh],
        queryFn: () => widgetService.getWidgetData(id, refresh),
        enabled: !!id,
    });
};

export const useCreateWidget = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, CreateWidgetData>({
        mutationFn: widgetService.createWidget,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["widgets"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", variables.dashboardId] });
        },
    });
};

export const useUpdateWidget = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, WidgetParams>({
        mutationFn: widgetService.updateWidget,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["widgets"] });
            queryClient.invalidateQueries({ queryKey: ["widget", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["widget-data", variables.id] });
        },
    });
};

export const useDeleteWidget = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, string>({
        mutationFn: widgetService.deleteWidget,
        onSuccess: (_, widgetId) => {
            queryClient.invalidateQueries({ queryKey: ["widgets"] });
            queryClient.invalidateQueries({ queryKey: ["dashboards"] });
            
            // Invalidate all individual dashboard queries to ensure UI updates
            queryClient.invalidateQueries({ 
                predicate: (query) => {
                    return query.queryKey[0] === "dashboard";
                }
            });
            
            // Also invalidate the specific widget query
            queryClient.invalidateQueries({ queryKey: ["widget", widgetId] });
            queryClient.invalidateQueries({ queryKey: ["widget-data", widgetId] });
        },
    });
};

export const useBulkRefreshWidgets = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, string[]>({
        mutationFn: widgetService.bulkRefreshWidgets,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["widget-data"] });
        },
    });
};
