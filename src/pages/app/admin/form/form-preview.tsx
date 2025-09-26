import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { useFormStore, formStore } from '@/store'
import FormAnswer from '@/components/form/form-answer/form-answer';
import { useGetFormById } from '@/hooks/form/use-form';
import { useBreadcrumbStore } from '@/store/ui';

const FormDetail = () => {
    const { setFormList } = formStore()
    const { t } = useTranslation();
    const { setFormId, setSections } = useFormStore()
    const { setCustomBreadcrumbItems } = useBreadcrumbStore();
    const params = useParams()
    const formIdData = params?.formId as string
    const { data: formData, isLoading, error } = useGetFormById(formIdData)
    const [_currentSectionId, setCurrentSectionId] = useState<string | null>(null);

    useEffect(() => {
        if (formData) {
            setFormList([formData]);
        }
    }, [formData, setFormList]);

    useEffect(() => {
        if (formIdData && formData) {
            setSections(formData.design || [])
            setFormId(formIdData as string);
        }
    }, [formIdData, formData, setSections, setFormId]);

    // Set custom breadcrumbs with form name
    useEffect(() => {
        if (formData) {
            setCustomBreadcrumbItems([
                { name: t('sidebar.home'), href: '/' },
                { name: t('sidebar.forms'), href: '/admin/form' },
                { name: formData.name, href: '' }
            ]);
        } else {
            setCustomBreadcrumbItems(null);
        }
    }, [formData, t, setCustomBreadcrumbItems]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setCustomBreadcrumbItems(null);
        };
    }, [setCustomBreadcrumbItems]);

    if (error) {
        return (
            <div className='p-6 text-center'>
                <h1 className="text-2xl font-semibold text-red-600">{t('processManagement.errorLoadingForm')}</h1>
                <p className="text-gray-600">{t('processManagement.failedToLoadFormData')}</p>
            </div>
        )
    }

    if(isLoading){
        return (
            <div className='p-6 text-center'>{t('processManagement.loading')}</div>
        )
    }

    if (!formIdData || !formData) {
        return (
            <div className='p-6 text-center'>
                <h1 className="text-2xl font-semibold">{t('processManagement.formNotFound')}</h1>
                <p className="text-gray-600">{t('processManagement.requestedFormCouldNotBeFound')}</p>
            </div>
        )
    }

    // Form data is already available from formData

    // Check if form has a design
    if (!formData?.design || formData.design.length === 0) {
        return (
            <main className='p-4 space-y-6 max-w-screen-lg mx-auto flex flex-col h-full'>
                <h1 className="text-2xl text-center font-medium">
                    {formData?.name || t('processManagement.nameNotFound')}
                </h1>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-600 mb-4">
                        {t('processManagement.noDesignFound')}
                    </h2>
                    <p className="text-gray-500">
                        {t('processManagement.formHasNoDesign')}
                    </p>
                </div>
            </main>
        )
    }

    return (
        <main className='p-4 space-y-6 max-w-screen-lg mx-auto flex flex-col h-full'>
            <h1 className="text-2xl text-center font-medium">
                {formData?.name || t('processManagement.nameNotFound')}
            </h1>
            <FormAnswer setCurrentFormSectionId={setCurrentSectionId} />
        </main>
    )
}

export default FormDetail