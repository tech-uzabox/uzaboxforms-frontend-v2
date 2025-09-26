import { Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const OrganizationLoading = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">{t('processManagement.loadingOrganizationChart')}</span>
    </div>
  );
};
