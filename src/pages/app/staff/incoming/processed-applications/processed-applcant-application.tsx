import React from 'react';
import { useGetAllForms } from '@/hooks';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/use-auth-store';
import { useGetSingleProcessedApplication } from '@/hooks';
import UserFormResponses from '@/components/process/user-form-responses';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProcessedApplicationPage: React.FC = () => {
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const params = useParams();
    const processId = params.processId as string;
    const applicantProcessId = params.applicantProcessId as string;

    if (!processId || !user?.id || !applicantProcessId) {
        return <p className='mt-8 text-center text-primary'>{t('processManagement.loading')}</p>;
    }

    const { data, isLoading, isError } = useGetSingleProcessedApplication({
        userId: user.id,
        processId: processId,
        applicantProcessId: applicantProcessId
    });

    const { data: formNamesData } = useGetAllForms();

    if (isLoading) {
        return <p className='mt-8 text-center text-primary'>{t('processManagement.loading')}</p>;
    }

    if (isError) {
        return <p className='mt-8 text-center text-red-500'>{t('processManagement.errorLoadingData')}</p>;
    }

    // Ensure formNamesData is an array
    const formNamesArray = Array.isArray(formNamesData?.data) ? formNamesData.data : [];

    // Create a map of form names by their IDs
    const formNameMap: Record<string, string> = formNamesArray.reduce((acc: any, form: any) => {
        acc[form.id] = form.name;
        return acc;
    }, {});

    // Using optional chaining to avoid errors if data is not available
    const completedFormIds: string[] = data?.applicantProcess?.completedForms || [];

    return (
        <div className="max-w-screen-lg mx-auto overflow-x-hidden">
            <h1 className="text-2xl font-medium mb-6 text-center text-black">
                {data?.process?.name}
            </h1>
            <Tabs defaultValue={completedFormIds[0] || 'dummy'} className="w-full">
                <TabsList
                    className='bg-white space-x-4 justify-start pb-6 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent overflow-y-hidden'
                    style={{ scrollbarWidth: 'thin' }}
                >
                    {completedFormIds.map((formId) => (
                        <TabsTrigger
                            key={formId}
                            value={formId}
                            className='bg-white data-[state=active]:shadow-none data-[state=active]:border-b-[2.4px] border-[#012473] rounded-lg data-[state=active]:text-[#012473] text-black'
                        >
                            {formNameMap[formId] || t('processManagement.unknownForm')}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {completedFormIds.map((formId) => (
                    <TabsContent key={formId} value={formId} className='border-none' >
                        <UserFormResponses
                            userId={user?.id}
                            processId={processId}
                            applicantProcessId={applicantProcessId}
                            formId={formId}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default ProcessedApplicationPage;