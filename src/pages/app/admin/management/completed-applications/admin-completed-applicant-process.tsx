import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetSingleApplication } from '@/hooks';
import { ApplicationDetailView } from '@/components/process';

const AdminCompletedProcessApplicationPage: React.FC = () => {
    const params = useParams();
    const applicantProcessId = params.applicantProcessId as string;

    const { data, isLoading, isError } = useGetSingleApplication(applicantProcessId);

    return (
        <ApplicationDetailView
            data={data}
            isLoading={isLoading}
            isError={isError}
            isAdmin={true}
            applicationType="completed"
            showEditButton={false}
        />
    );
};

export default AdminCompletedProcessApplicationPage;
