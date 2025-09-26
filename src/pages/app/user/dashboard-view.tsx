import { useGetDashboard } from "@/hooks";
import { Layouts } from "react-grid-layout";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IWidget } from "@/types/dashboard.types";
import { useCallback, useEffect, useState } from "react";
import { ErrorState, LoadingSkeleton } from "@/components/ui";
import { useBulkRefreshWidgets, useGetAllWidgets } from "@/hooks";
import { buildDefaultLayouts, toRGLLayouts } from "@/utils/layout-update";
import { DashboardViewHeader, DashboardViewContent } from "@/components/dashboard";

export default function DashboardViewClient() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [_lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [layouts, setLayouts] = useState<Layouts | null>(null);
  const { dashboardId } = useParams<{ dashboardId: string }>();

  const {
    data: dashboardResponse,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useGetDashboard(dashboardId as string);
  const dashboard = dashboardResponse;

  const {
    data: widgetsResponse,
    isLoading: widgetsLoading,
    error: widgetsError,
    refetch: refetchWidgets,
  } = useGetAllWidgets({ dashboardId: dashboardId as string });

  const bulkRefreshMutation = useBulkRefreshWidgets();

  const widgets = widgetsResponse?.data || [];
  const isLoading = dashboardLoading || widgetsLoading;
  const error = dashboardError || widgetsError;

  useEffect(() => {
    if (dashboard && widgets.length > 0) {
      if (dashboard.layout?.layouts) {
        setLayouts(toRGLLayouts(dashboard.layout.layouts));
      } else {
        setLayouts(buildDefaultLayouts(widgets));
      }
    }
  }, [dashboard, widgets]);

  const handleRefreshAll = useCallback(async () => {
    if (widgets.length === 0) return;
    setRefreshing(true);
    try {
      const widgetIds = widgets.map((w: any) => w.id);
      await bulkRefreshMutation.mutateAsync(widgetIds);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to refresh widgets:", err);
    } finally {
      setRefreshing(false);
    }
  }, [widgets, bulkRefreshMutation]);

  const handleRetry = useCallback(() => {
    refetchDashboard();
    refetchWidgets();
  }, [refetchDashboard, refetchWidgets]);

  useEffect(() => {
    const hasRealTimeWidgets = widgets.some((w: any) => w.realTime?.enabled);
    if (!hasRealTimeWidgets) return;
    const interval = setInterval(() => {
      handleRefreshAll();
    }, 60000);
    return () => clearInterval(interval);
  }, [widgets, handleRefreshAll]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <LoadingSkeleton type="header" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ErrorState
          error={(error as Error)?.message || t('dashboard.noData')}
          onRetry={handleRetry}
          title={t('dashboard.loading')}
        />
      </div>
    );
  }

  const orderedWidgets =
    dashboard.layout?.order?.length > 0
      ? dashboard.layout.order
          .map((id: string) => widgets.find((w: any) => w.id === id))
          .filter(Boolean) as IWidget[]
      : widgets;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <DashboardViewHeader
        dashboardName={dashboard.name}
        onRefresh={handleRefreshAll}
        refreshing={refreshing}
        hasWidgets={widgets.length > 0}
      />

      <DashboardViewContent
        widgets={widgets}
        layouts={layouts}
        orderedWidgets={orderedWidgets}
      />
    </div>
  );
}
