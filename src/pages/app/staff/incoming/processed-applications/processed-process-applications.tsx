import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuthStore } from "@/store/use-auth-store";
import { useGetAllUsers } from "@/hooks/user/use-user";
import { useGetProcessedApplicationsForProcess } from "@/hooks/process/use-proccessed-applications";
import { ProcessDetailList } from "@/components/process";

const ProcessedProcesses: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { processId } = useParams();

  if (!processId || !user?.id) {
    return <p className="mt-8 text-center text-primary">{t('processManagement.loading')}</p>;
  }

  const { data: responseData, isLoading, isError } = useGetProcessedApplicationsForProcess({
    userId: user.id,
    processId: processId as string,
  });

  const { data: users = [] } = useGetAllUsers();

  const data = responseData?.data || [];

  return (
    <ProcessDetailList
      data={data}
      isLoading={isLoading}
      isError={isError}
      processId={processId}
      title={t('processManagement.processedApplications')}
      loadingMessage={t('processManagement.loading')}
      errorMessage={t('processManagement.errorLoadingData')}
      noDataMessage={t('processManagement.noProcessedApplicationsFound')}
      baseRoute="/staff/incoming/processed-applications"
      showEditButton={false}
      users={users}
    />
  );
};

export default ProcessedProcesses;
