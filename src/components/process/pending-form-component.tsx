import { toast } from 'sonner';
import { useGetAllUsers } from '@/hooks';
import { userStore } from '@/store/user';
import { useSendbackProcess } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { useGetProcessAndForm } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { formStore } from '@/store/form/form-store';
import { useAuthStore } from '@/store/use-auth-store';
import { usecreateProcessedApplication } from '@/hooks';
import FormAnswer from '../form/form-answer/form-answer';
import SearchUser from '@/components/settings/search-user';
import { useFormStore } from '@/store/form-design/form-store';
import React, { type FormEvent, useEffect, useState } from 'react';
import { useGetAllForms, useGetFormById } from '@/hooks/form/use-form';
import { useFormResponseStore } from '@/store/form/use-form-response-store';

interface PendingFormProps {
    formId: string;
    processId: string;
    applicantProcessId: string;
    completedFormIds: any;
}

const PendingFormComponent: React.FC<PendingFormProps> = ({ formId, processId, applicantProcessId, completedFormIds }) => {
    const { t } = useTranslation();
    const { setFormList } = formStore();
    const { formResponses } = useFormResponseStore();
    const { user } = useAuthStore();
    const { setUsers } = userStore();
    const navigate = useNavigate();

    const { setFormId, setSections, sections } = useFormStore();
    const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
    const [selectedNextStaffId, setSelectedNextStaffId] = useState<string>();

    const createProcessedApplicationMutation = usecreateProcessedApplication();
    const sendbackProcessMutation = useSendbackProcess();

    const { data: formNameData, isLoading: formNameLoading } = useGetAllForms();
    const { data: formDesignData, isLoading: formDesignLoading } = useGetFormById(formId);
    const { data: processAndForm, isLoading: processAndFormLoading } = useGetProcessAndForm(processId, formId);

    // Find the specific process form by formId
    const processForm = processAndForm?.data?.forms?.find((pf: any) => pf.formId === formId);

    // All hooks must be called before any conditional returns
    const staticUsersQuery = useGetAllUsers({ names: ["Staff"] });
    const dynamicUsersQuery = useGetAllUsers({ roleIds: processForm?.nextStepRoles });

    useEffect(() => {
        if (formNameData) {
            setFormList(formNameData);
        }
    }, [formNameData, setFormList]);

    useEffect(() => {
        if (formId && formNameData && formDesignData) {
            // Handle both old structure (sections) and new structure (design)
            const sections = formDesignData.sections || formDesignData.design || [];
            setSections(sections);
            setFormId(formId);
        }
    }, [formId, formNameData, formDesignData, setSections, setFormId]);

    useEffect(() => {
        if (processForm?.nextStepType === "STATIC") {
            setUsers(staticUsersQuery.data);
        } else if (processForm?.nextStepType === "DYNAMIC" && processForm?.nextStepSpecifiedTo === "SINGLE_STAFF") {
            setUsers(dynamicUsersQuery.data);
        }
    }, [staticUsersQuery.data, dynamicUsersQuery.data, processForm]);


    // Show loading state if any critical data is still loading
    if (processAndFormLoading || formDesignLoading || formNameLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('processManagement.loading')}</p>
                </div>
            </div>
        );
    }

    // Show error state if processForm is not found
    if (!processForm) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-red-600">{t('processManagement.formNotFound')}</p>
                    <p className="text-sm text-gray-500 mt-2">Form ID: {formId}</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (!user?.id) {
            toast.error(t('processManagement.youMustBeLoggedIn'));
            return;
        }

        if ((processForm?.nextStepType === "DYNAMIC" &&
                processForm?.nextStepSpecifiedTo === "SINGLE_STAFF") && !selectedNextStaffId) {
            toast.error(t('processManagement.selectStaffToSubmitTo'));
            return;
        }

        try {
            const prResponse = await createProcessedApplicationMutation.mutateAsync({
                userId: user.id,
                processId,
                applicantProcessId,
                formId,
                nextStaff: selectedNextStaffId,
                responses: formResponses,
            });

            if (prResponse) {
                toast.success(t('common.processUpdatedSuccessfully'));
                navigate('/staff/incoming/pending-applications');
            } else {
                toast.error(t('processManagement.submissionFailed'));
            }
        } catch (error) {
            toast.error(t('processManagement.anErrorOccurred'));
            console.error('Submission error:', error);
        }
    };

    const handleSendBackProcess = async () => {
        try {
            const response = await sendbackProcessMutation.mutateAsync({ applicantProcessId, formId });
            if (response.success) {
                toast.success(t('processManagement.sentBackSuccessfully'));
                navigate('/staff/incoming/pending-applications');
            }
        } catch (error) {
            toast.error(t('processManagement.anErrorOccurred'));
            console.error('Send back error:', error);
        }
    };

    return (
        <form className="">
            <div className='flex items-center justify-end w-full pr-4'>
                {completedFormIds.length > 1 && (
                    <button type='button' className='main-dark-button' onClick={handleSendBackProcess}>
{sendbackProcessMutation.isPending ? t('processManagement.sending') : t('processManagement.sendBack')}
                    </button>
                )}
            </div>

            <FormAnswer setCurrentFormSectionId={setCurrentSectionId} />

            {sections && sections.length > 0 && sections.findIndex((section) => section.id === currentSectionId) === sections.length - 1 && (
                <div className='md:px-4 space-y-4'>
                    {(processForm?.nextStepType === "DYNAMIC" &&
                            processForm?.nextStepSpecifiedTo === "SINGLE_STAFF") && (
                            <div className='max-w-md space-y-1'>
                                <div className='main-label font-medium'>{t('processManagement.selectStaffToSubmitTo')}</div>
                                <SearchUser setUserId={setSelectedNextStaffId} />
                            </div>
                        )}

                    <button
                        type="button"
                        className={`main-dark-button text-sm ${createProcessedApplicationMutation.isPending && '!bg-darkBlue/60'}`}
                        onClick={handleSubmit}
                        disabled={createProcessedApplicationMutation.isPending}
                    >
{createProcessedApplicationMutation.isPending ? t('processManagement.submitting') : t('processManagement.submit')}
                    </button>
                </div>
            )}
        </form>
    );
};

export default PendingFormComponent;