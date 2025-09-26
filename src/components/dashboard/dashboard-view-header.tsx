import { PageHeader } from "@/components/ui/page-header";
import { RefreshButton } from "@/components/ui/refresh-button";

interface DashboardViewHeaderProps {
  dashboardName: string;
  onRefresh: () => void;
  refreshing: boolean;
  hasWidgets: boolean;
}

export function DashboardViewHeader({
  dashboardName,
  onRefresh,
  refreshing,
  hasWidgets
}: DashboardViewHeaderProps) {
  return (
    <PageHeader title={dashboardName}>
      <RefreshButton
        onRefresh={onRefresh}
        refreshing={refreshing}
        disabled={!hasWidgets}
      />
    </PageHeader>
  );
}
