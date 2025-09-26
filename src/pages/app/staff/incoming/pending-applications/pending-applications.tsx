import { useTranslation } from 'react-i18next';
import { useGetApplications } from "@/hooks/process";
import ApplicationsList from "@/components/applications/applications-list";

const PendingApplicationsPage = () => {
  const { t } = useTranslation();
  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetApplications('pending');

  const data = responseData?.data || [];

  return (
    <ApplicationsList
      data={data}
      isLoading={isLoading}
      isError={isError}
      title={t('processManagement.pendingApplications')}
      loadingMessage={t('processManagement.loading')}
      errorMessage={t('processManagement.anErrorOccurredWhileFetchingPendingApplications')}
      searchPlaceholder={t('processManagement.search')}
      baseRoute="/staff/incoming/pending-applications"
    />
  );
};

export default PendingApplicationsPage;
