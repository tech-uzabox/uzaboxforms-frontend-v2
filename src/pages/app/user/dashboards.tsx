import {
  DashboardLoadingSkeleton,
  DashboardEmptyState,
  DashboardErrorState,
  DashboardHeader,
  DashboardResultsInfo,
  DashboardsGrid,
} from "@/components/dashboard";
import { useState } from "react";
import { useGetAllDashboards } from "@/hooks";

export default function DashboardsPage() {
  const [searchQuery, _setSearchQuery] = useState("");

  const {
    data: dashboardsResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllDashboards({
    search: searchQuery || undefined,
  });

  const dashboards = dashboardsResponse|| [];
  const totalCount = dashboardsResponse || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <DashboardHeader />

      {isLoading ? (
        <DashboardLoadingSkeleton />
      ) : error ? (
        <DashboardErrorState error={error as Error} onRetry={refetch} />
      ) : dashboards.length === 0 ? (
        <DashboardEmptyState searchQuery={searchQuery} />
      ) : (
        <DashboardsGrid dashboards={dashboards} />
      )}

      <DashboardResultsInfo currentCount={dashboards.length} totalCount={totalCount} />
    </div>
  );
}
