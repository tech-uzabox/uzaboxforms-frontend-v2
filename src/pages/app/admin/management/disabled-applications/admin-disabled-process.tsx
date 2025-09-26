import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuthStore } from "@/store/use-auth-store";
import { useGetAllUsers } from "@/hooks/user/use-user";
import { useGetApplicationsForProcess } from "@/hooks/process";
import { ProcessDetailList } from "@/components/process";

const AdminDisabledProcesses: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { processId } = useParams();

  if (!processId || !user?.id) {
    return <p className="mt-8 text-center text-primary">{t('processManagement.loading')}</p>;
  }

  const { data: responseData, isLoading, isError } = useGetApplicationsForProcess(
    processId as string,
    'disabled',
    true // isAdmin = true
  );

  const { data: users = [] } = useGetAllUsers();
  const data = responseData?.data || [];

  return (
    <ProcessDetailList
      data={data}
      isLoading={isLoading}
      isError={isError}
      processId={processId}
      title={t('processManagement.disabledApplicationsAdminView')}
      loadingMessage={t('processManagement.loading')}
      errorMessage={t('processManagement.errorLoadingData')}
      noDataMessage={t('processManagement.noDisabledApplicationsFound')}
      baseRoute="/admin/management/disabled-applications"
      showEditButton={false} // Admin view-only
      users={users}
    />
  );
};

export default AdminDisabledProcesses;
