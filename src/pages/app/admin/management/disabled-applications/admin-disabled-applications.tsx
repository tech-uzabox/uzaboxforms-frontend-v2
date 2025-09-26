import { useTranslation } from 'react-i18next';
import { useGetApplications } from '@/hooks';
import ApplicationsList from "@/components/applications/applications-list";

const AdminDisabledApplicationsPage = () => {
  const { data: responseData, isLoading, isError } = useGetApplications('disabled', true);
  const { t } = useTranslation();

  const data = responseData?.data || [];

  return (
    <ApplicationsList
      data={data}
      isLoading={isLoading}
      isError={isError}
      title={t('processManagement.allDisabledApplicationsAdmin')}
      loadingMessage={t('processManagement.loading')}
      errorMessage={t('processManagement.errorOccurredWhileFetchingDisabledApplications')}
      searchPlaceholder={t('processManagement.search')}
      baseRoute="/admin/management/disabled-applications"
    />
  );
};

export default AdminDisabledApplicationsPage;