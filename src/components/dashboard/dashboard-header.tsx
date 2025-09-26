import { useTranslation } from 'react-i18next';

interface DashboardHeaderProps {
  title?: string;
  description?: string;
}

export function DashboardHeader({ 
  title, 
  description 
}: DashboardHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#3F4247] mb-2">
        {title || t('dashboards.title')}
      </h1>
      <p className="text-gray-600">
        {description || t('dashboards.description')}
      </p>
    </div>
  );
}
