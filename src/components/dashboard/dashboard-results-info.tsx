import { useTranslation } from "react-i18next";

interface DashboardResultsInfoProps {
  currentCount: number;
  totalCount: number;
}

export function DashboardResultsInfo({ currentCount, totalCount }: DashboardResultsInfoProps) {
  const { t } = useTranslation();

  if (currentCount === 0) return null;

  return (
    <div className="mt-8 text-center text-sm text-gray-500">
      {t('dashboards.showingResults', { current: currentCount, total: (totalCount as any)?.length })}
    </div>
  );
}
