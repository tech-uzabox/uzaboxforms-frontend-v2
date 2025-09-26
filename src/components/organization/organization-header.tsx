import { RefreshCw } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

interface OrganizationHeaderProps {
  onRefresh: () => void;
}

export const OrganizationHeader = ({ onRefresh }: OrganizationHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end mb-4 gap-2 py-6">
      <div className='text-2xl font-semibold text-center mx-auto'>
        {t('processManagement.organizationChart')}
      </div>
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="mr-2 h-4 w-4" />
        {t('processManagement.refreshData')}
      </Button>
    </div>
  );
};
