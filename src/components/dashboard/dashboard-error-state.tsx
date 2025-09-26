import { useTranslation } from "react-i18next";
import { ErrorState } from "@/components/ui/error-state";

interface DashboardErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function DashboardErrorState({ error, onRetry }: DashboardErrorStateProps) {
  const { t } = useTranslation();
  
  return (
    <ErrorState
      error={error}
      onRetry={onRetry}
      title={t('dashboards.failedToLoadDashboards')}
    />
  );
}
