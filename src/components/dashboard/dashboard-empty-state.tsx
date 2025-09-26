import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/ui/empty-state";

interface DashboardEmptyStateProps {
  searchQuery: string;
}

export function DashboardEmptyState({ searchQuery }: DashboardEmptyStateProps) {
  const { t } = useTranslation();
  
  const title = searchQuery ? t('dashboards.noDashboardsFound') : t('dashboards.noDashboardsAvailable');
  const description = searchQuery
    ? t('dashboards.noDashboardsMatch', { query: searchQuery })
    : t('dashboards.noAccessToDashboards');

  return (
    <EmptyState
      title={title}
      description={description}
      icon={TrendingUp}
    />
  );
}
