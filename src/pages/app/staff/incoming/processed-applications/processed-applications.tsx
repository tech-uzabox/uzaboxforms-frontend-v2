import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/use-auth-store';
import { useGetProcessedApplications } from '@/hooks';
import ApplicationsList from "@/components/applications/applications-list";

const ProcessedApplicationsPage = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { data: responseData, isLoading, isError } = user?.id
    ? useGetProcessedApplications(user.id)
    : { data: null, isLoading: false, isError: false };

  if (!user?.id) {
    return (
      <div className="text-center py-8 text-gray-700">
        {t('processManagement.loading')}
      </div>
    );
  }

  const data = responseData?.data || [];

  return (
    <ApplicationsList
      data={data}
      isLoading={isLoading}
      isError={isError}
      title={t('processManagement.processedApplications')}
      loadingMessage={t('processManagement.loading')}
      errorMessage={t('processManagement.anErrorOccurredWhileFetchingProcessedApplications')}
      searchPlaceholder={t('processManagement.search')}
      baseRoute="/staff/incoming/processed-applications"
    />
  );
};

export default ProcessedApplicationsPage;