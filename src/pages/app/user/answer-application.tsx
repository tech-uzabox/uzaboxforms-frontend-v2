import {
    useAuthStore,
    userStore,
    useFormResponseStore,
    useValidationErrorsStore,
    useFormStore
} from '@/store';
import {
    useGetAllUsers,
    useGetAllForms,
    useCreateApplicantProcess,
    useSubmitFormResponse,
    useGetProcessAndForm
} from '@/hooks';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { formStore } from '@/store/form/form-store';
import { useNavigate, useParams } from 'react-router-dom';
import SearchUser from '@/components/settings/search-user';
import React, { FormEvent, useEffect, useState } from 'react';
import FormAnswer from '@/components/form/form-answer/form-answer';

const AnswerApplicationPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const { setUsers } = userStore()
    const { setFormList } = formStore();
    const { formResponses, clearFormResponses } = useFormResponseStore();
    const { validationErrors, clearValidationErrors } = useValidationErrorsStore();
    const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
    const [selectedNextStaffId, setSelectedNextStaffId] = useState()

    const submitResponseMutation = useSubmitFormResponse();
    const createApplicantProcessMutation = useCreateApplicantProcess();

    const { setFormId, setSections, sections, clearForm } = useFormStore();
    const params = useParams();
    const processId = params?.processId as string;
    const formId = params?.formId as string;

    const [formName, setFormName] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);

    const { data: formNameData } = useGetAllForms();

    const { data: processAndForm } = useGetProcessAndForm(processId, formId);

    // Find the specific process form by formId
    const processForm = processAndForm?.data?.forms?.find((pf: any) => pf.formId === formId);

    const staticUsersQuery = useGetAllUsers({ names: ["Staff"] });
    const dynamicUsersQuery = useGetAllUsers({ roleIds: processForm?.nextStepRoles });

    useEffect(() => {
        if (processForm?.nextStepType === "STATIC") {
            setUsers(staticUsersQuery.data)
        } else if (processForm?.nextStepType === "DYNAMIC" && processForm?.nextStepSpecifiedTo === "SINGLE_STAFF") {
            setUsers(dynamicUsersQuery.data)
        }
    }, [staticUsersQuery.data, dynamicUsersQuery.data, processForm])

    const navigate = useNavigate();

    // Reset all form state when component unmounts or formId changes
    useEffect(() => {
        return () => {
            clearForm();
            clearFormResponses();
            clearValidationErrors();
        };
    }, [formId]);

    useEffect(() => {
        if (formNameData) {
            setFormList(formNameData);
        }
    }, [formNameData, setFormList]);

    useEffect(() => {
        if (!formId || !formNameData || !processAndForm) return;

        // Only proceed if we have all required data
        const foundForm = formNameData?.find((form: any) => form.id === formId);
        if (!foundForm) {
            toast.error(t('answerApplication.formNotFound'));
            navigate('/');
            return;
        }
        // console.log(foundForm)
        // Initialize form state
        setSections(foundForm.design);
        setFormId(formId);
        setFormName(foundForm.name);
        setIsInitialized(true);

    }, [formId, formNameData, processAndForm, setSections, setFormId, navigate]);

    const handleSubmit = async (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        // Validate user is logged in
        if (!user?.id) {
            toast.error(t('answerApplication.mustBeLoggedIn'));
            return;
        }

        // Validate form responses
        const allErrors = Object.values(validationErrors).flatMap((sectionErrors) =>
            Object.values(sectionErrors)
        );
        const nonNullErrors = allErrors.filter((error) => error !== null);
        if (nonNullErrors.length > 0) {
            toast.error(nonNullErrors[0] as string);
            return;
        }

        if ((processForm?.nextStepType === "DYNAMIC" &&
            processForm?.nextStepSpecifiedTo === "SINGLE_STAFF") && !selectedNextStaffId) {
            toast.error(t('answerApplication.selectStaffToSubmit'));
            return;
        }

        try {
            // Submit formResponses in JSON format with all necessary information
            const apResponse = await createApplicantProcessMutation.mutateAsync({
                applicantId: user.id,
                processId,
                formId,
                nextStaff: selectedNextStaffId,
                responses: formResponses, // Now using JSON format directly
            });

            if (apResponse) {
                clearForm();
                clearFormResponses();
                clearValidationErrors();
                toast.success(t('common.applicationSubmittedSuccessfully'));
                navigate('/');
            } else {
                toast.error(t('answerApplication.failedToCreateProcess'));
            }

        } catch (error) {
            console.error('Submission error:', error);
            toast.error(t('answerApplication.submissionError'));
        }
    };

    if (!isInitialized) {
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-center py-8 text-primary">{t('answerApplication.loadingForm')}</p>
            </div>
        );
    }

    return (
        <form className="p-4 lg:p-8 space-y-6 max-w-screen-lg mx-auto flex flex-col h-full">
            <h1 className="text-2xl font-medium text-[#001A55] text-center">{formName}</h1>
            <FormAnswer setCurrentFormSectionId={setCurrentSectionId} />
            {sections && sections.length > 0 && sections.findIndex((section) => section.id === currentSectionId) === sections.length - 1 && (
                <div className='md:px-4 space-y-4'>
                    {(processForm?.nextStepType === "DYNAMIC" && processForm?.nextStepSpecifiedTo === "SINGLE_STAFF") ? (
                        <div className='max-w-md space-y-1'>
                            <div className='main-label font-medium'>{t('answerApplication.selectStaffToSubmit')}</div>
                            <SearchUser setUserId={setSelectedNextStaffId} />
                        </div>
                    ) : (
                        <div></div>
                    )}

                    <button
                        type="button"
                        className={`main-dark-button text-sm ${createApplicantProcessMutation.isPending && '!bg-darkBlue/60'}`}
                        onClick={handleSubmit}
                        disabled={createApplicantProcessMutation.isPending || submitResponseMutation.isPending}
                    >
                        {createApplicantProcessMutation.isPending || submitResponseMutation.isPending ? t('answerApplication.submitting') : t('answerApplication.submit')}
                    </button>
                </div>
            )}
        </form>
    );
};

export default AnswerApplicationPage;
