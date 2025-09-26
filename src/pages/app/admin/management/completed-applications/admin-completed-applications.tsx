import { useTranslation } from 'react-i18next';
import { useGetApplications } from '@/hooks';
import ApplicationsList from "@/components/applications/applications-list";

const AdminCompletedApplicationsPage = () => {
  const { data: responseData, isLoading, isError } = useGetApplications('completed', true);
  const { t } = useTranslation();

  const data = responseData?.data || [];

  return (
    <ApplicationsList
      data={data}
      isLoading={isLoading}
      isError={isError}
      title={t('processManagement.allCompletedApplicationsAdmin')}
      loadingMessage={t('processManagement.loading')}
      errorMessage={t('processManagement.errorOccurredWhileFetchingCompletedApplications')}
      searchPlaceholder={t('processManagement.search')}
      baseRoute="/admin/management/completed-applications"
    />
  );
};

export default AdminCompletedApplicationsPage;