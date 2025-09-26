import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/use-auth-store';
import { useGetSingleApplication } from '@/hooks/process';
import { ApplicationDetailView } from '@/components/process';

const ProcessApplicationPage: React.FC = () => {
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const params = useParams();
    const processId = params.processId as string;
    const applicantProcessId = params.applicantProcessId as string;

    if (!processId || !user?.id || !applicantProcessId) {
        return <p className='mt-8 text-center text-primary'>{t('processManagement.loading')}</p>;
    }

    const { data, isLoading, isError } = useGetSingleApplication(applicantProcessId);

    return (
        <ApplicationDetailView
            data={data}
            isLoading={isLoading}
            isError={isError}
            isAdmin={false}
            applicationType="disabled"
            showEditButton={false}
        />
    );
};

export default ProcessApplicationPage;