import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/ui/empty-state";

export function DashboardWidgetsEmptyState() {
  const { t } = useTranslation();
  
  return (
    <EmptyState
      title={t('dashboards.noWidgetsConfigured')}
      description={t('dashboards.noWidgetsDescription')}
      icon={Settings}
    />
  );
}
