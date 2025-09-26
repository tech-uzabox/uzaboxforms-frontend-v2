
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardService, type DashboardParams, type CreateDashboardData } from "@/services/dashboard";

export const useGetAllDashboards = (params?: { search?: string; ownerId?: string }) => {
    return useQuery<any, Error>({
        queryKey: ["dashboards", params],
        queryFn: () => dashboardService.getAllDashboards(params),
    });
};

export const useGetDashboard = (id: string) => {
    return useQuery<any, Error>({
        queryKey: ["dashboard", id],
        queryFn: () => dashboardService.getDashboardById(id),
        enabled: !!id,
    });
};

export const useCreateDashboard = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, CreateDashboardData>({
        mutationFn: dashboardService.createDashboard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboards"] });
        },
    });
};

export const useUpdateDashboard = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, DashboardParams>({
        mutationFn: dashboardService.updateDashboard,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["dashboards"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", variables.id] });
        },
    });
};

export const useDeleteDashboard = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, string>({
        mutationFn: dashboardService.deleteDashboard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboards"] });
        },
    });
};

export const useUpdateWidgetOrder = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { id: string; widgetOrder: string[] }>({
        mutationFn: ({ id, widgetOrder }) => dashboardService.updateWidgetOrder(id, widgetOrder),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["dashboards"] });
        },
    });
};
