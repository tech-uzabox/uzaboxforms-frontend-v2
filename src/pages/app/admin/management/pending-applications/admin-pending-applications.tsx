import { useTranslation } from 'react-i18next';
import { useGetApplications } from '@/hooks';
import ApplicationsList from "@/components/applications/applications-list";

const AdminPendingApplicationsPage = () => {
  const { data: responseData, isLoading, isError } = useGetApplications('pending', true);
  const { t } = useTranslation();

  const data = responseData?.data || [];

  return (
    <ApplicationsList
      data={data}
      isLoading={isLoading}
      isError={isError}
      title={t('processManagement.allPendingApplicationsAdmin')}
      loadingMessage={t('processManagement.loading')}
      errorMessage={t('processManagement.errorOccurredWhileFetchingPendingApplications')}
      searchPlaceholder={t('processManagement.search')}
      baseRoute="/admin/management/pending-applications"
    />
  );
};

export default AdminPendingApplicationsPage;