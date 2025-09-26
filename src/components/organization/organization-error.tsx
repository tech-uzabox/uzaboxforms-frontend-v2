import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

interface OrganizationErrorProps {
  error: Error;
  onRetry: () => void;
}

export const OrganizationError = ({ error, onRetry }: OrganizationErrorProps) => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-10 text-destructive">
      <p className="mb-4">
        {t('processManagement.errorLoadingOrganizationData')} {error.message}
      </p>
      <Button onClick={onRetry}>
        {t('processManagement.tryAgain')}
      </Button>
    </div>
  );
};
