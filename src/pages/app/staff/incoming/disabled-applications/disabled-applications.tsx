import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/use-auth-store';
import { useGetApplications } from '@/hooks/process';
import ApplicationsList from "@/components/applications/applications-list";

const DisabledApplicationsPage = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { data: responseData, isLoading, isError } = user?.id
    ? useGetApplications('disabled')
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
      title={t('processManagement.disabledApplications')}
      loadingMessage={t('processManagement.loading')}
      errorMessage={t('processManagement.anErrorOccurredWhileFetchingDisabledApplications')}
      searchPlaceholder={t('processManagement.search')}
      baseRoute="/staff/incoming/disabled-applications"
    />
  );
};

export default DisabledApplicationsPage;