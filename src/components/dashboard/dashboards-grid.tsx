import { DashboardCard } from "./dashboard-card";
import { IDashboard } from "@/types/dashboard.types";

interface DashboardsGridProps {
  dashboards: IDashboard[];
}

export function DashboardsGrid({ dashboards }: DashboardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dashboards.map((dashboard) => (
        <DashboardCard key={dashboard.id} dashboard={dashboard} />
      ))}
    </div>
  );
}
