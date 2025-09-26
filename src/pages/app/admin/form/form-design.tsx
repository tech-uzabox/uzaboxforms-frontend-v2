import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useFormStore, formStore } from '@/store';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGetFormById, useGetAllForms } from '@/hooks/form/use-form';
import FormWorkFlow from '@/components/form/form-design/form-work-flow';
import { useBreadcrumbStore } from '@/store/ui';

const FormDesign = () => {
  const { t } = useTranslation();
  const { formId, setFormId, initializeForm, setSections } = useFormStore();
  const { setFormList } = formStore();
  const { setCustomBreadcrumbItems } = useBreadcrumbStore();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const formIdData = params?.formId as string;
  const folderId = searchParams.get('folderId');
  const [formName, setFormName] = useState(t('processManagement.loading'));

  const { data: formData, isLoading, error } = useGetFormById(formIdData);
  const { data: formNameData, isLoading: isLoadingNames } = useGetAllForms();
  const [isUploading, setIsUploading] = useState(false);
  const [_currentDomain, setCurrentDomain] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentDomain(window.location.hostname);
    }
  }, []);

  const handleUploadPDF = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      toast.error(t('processManagement.pleaseSelectValidPdfFile'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const response = await axios.post('/api/upload-form', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const mappedSections = response.data.schema.sections.map(
        (section: any, sectionIndex: number) => ({
          ...section,
          id: `section-${Date.now() + sectionIndex}`,
          questions: section.questions.map((question: any, questionIndex: number) => ({
            ...question,
            id: `question-${Date.now() + sectionIndex + questionIndex}`,
          })),
        })
      );

      if (response.data) {
        setSections(mappedSections);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error(t('processManagement.failedToUploadPdf'));
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  // Set form names when formNameData is loaded
  useEffect(() => {
    if (formNameData && !isLoadingNames) {
      setFormList(formNameData);
    }
  }, [formNameData, isLoadingNames, setFormList]);

  // Update form details when both formNameData and form design data are loaded
  useEffect(() => {
    if (!isLoading && !isLoadingNames && formIdData) {
      if (formIdData !== formId) {
        initializeForm();
      }
      
      setFormId(formIdData as string);
      
      // Handle form name from formNameData if available
      if (formNameData) {
        const foundForm = formNameData?.find((form: any) => form.id === formIdData);
        setFormName(foundForm?.name || formData?.name || "Form");
      } else if (formData?.name) {
        setFormName(formData.name);
      }
      
      // Handle form design - treat null the same as empty array
      if (formData?.design && Array.isArray(formData.design) && formData.design.length > 0) {
        setSections(formData.design);
      } else {
        // Initialize with empty form if no design exists or design is null/empty
        initializeForm();
      }
    }
  }, [formIdData, formNameData, formData, isLoading, isLoadingNames, formId, setFormId, initializeForm, setSections]);

  // Set custom breadcrumbs with form name
  useEffect(() => {
    if (formName && formName !== t('processManagement.loading')) {
      setCustomBreadcrumbItems([
        { name: t('sidebar.home'), href: '/' },
        { name: t('sidebar.forms'), href: '/admin/form' },
        { name: formName, href: '' }
      ]);
    } else {
      setCustomBreadcrumbItems(null);
    }
  }, [formName, t, setCustomBreadcrumbItems]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setCustomBreadcrumbItems(null);
    };
  }, [setCustomBreadcrumbItems]);

  // Handle error state
  if (error) {
    return (
      <main className='p-4 space-y-6'>
        <h1 className="text-2xl font-semibold text-center text-red-600">{t('processManagement.errorLoadingForm')}</h1>
        <p className="text-center text-gray-600">{t('processManagement.failedToLoadFormData')}</p>
      </main>
    );
  }

  if (isLoading || isLoadingNames) {
    return (
      <main className='p-4 space-y-6'>
        <h1 className="text-2xl font-semibold text-center">{t('processManagement.loading')}</h1>
      </main>
    );
  }

  // Check if we have the required data for existing forms
  if (formIdData && (!formData || !formNameData)) {
    return (
      <main className='p-4 space-y-6'>
        <h1 className="text-2xl font-semibold text-center">{t('processManagement.formNotFound')}</h1>
        <p className="text-center text-gray-600">{t('processManagement.requestedFormCouldNotBeFound')}</p>
      </main>
    );
  }

  return (
    <div className="relative">
      {/* Full-Screen Modal with Animation */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-blue-900 rounded-lg shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                className="relative w-24 h-24"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 blur-md"></div>
                <div className="absolute inset-2 rounded-full bg-blue-600"></div>
              </motion.div>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos((i * Math.PI) / 3) * 60, 0],
                    y: [0, Math.sin((i * Math.PI) / 3) * 60, 0],
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 0.4, 0.8],
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
              <motion.div
                className="absolute w-40 h-40 rounded-full bg-blue-500 opacity-10"
                animate={{
                  scale: [1, 2],
                  opacity: [0.2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.h2
                className="mt-6 text-2xl font-semibold text-white"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {t('processManagement.uzaAiJenga')}
              </motion.h2>
              <motion.p
                className="mt-2 text-sm text-blue-200"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {t('processManagement.processingYourPdf')}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="p-4 space-y-6 max-w-screen-md mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-center">{formName}</h1>
          <div>
            <motion.label
              className={`relative inline-block py-2.5 px-6 rounded-lg text-white font-medium cursor-pointer overflow-hidden bg-gradient-to-r from-darkBlue to-darkBlue/70
                ${isUploading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-darkBlue/50'}`}
              animate={{
                scale: isUploading ? [1, 1.05, 1] : 1,
                boxShadow: isUploading
                  ? [
                      "0 0 0 0 rgba(59, 130, 246, 0)",
                      "0 0 15px 5px rgba(59, 130, 246, 0.6)",
                      "0 0 0 0 rgba(59, 130, 246, 0)",
                    ]
                  : "0 0 0 0 rgba(59, 130, 246, 0)",
              }}
              transition={{
                scale: { duration: 1.5, repeat: isUploading ? Infinity : 0, ease: "easeInOut" },
                boxShadow: { duration: 1.5, repeat: isUploading ? Infinity : 0, ease: "easeInOut" },
              }}
              whileTap={isUploading ? {} : { scale: 0.95 }}
            >
              <motion.span
                className="absolute inset-0 bg-primary opacity-0"
                animate={{
                  opacity: isUploading ? [0, 0.3, 0] : [0, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Text Content */}
              <span className="relative z-10 text-sm whitespace-nowrap">
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full"
                    />
                    {t('processManagement.processing')}
                  </span>
                ) : (
                  t('processManagement.uploadPdfToAi')
                )}
              </span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUploadPDF}
                className="hidden"
                disabled={isUploading}
              />
            </motion.label>
          </div>
        </div>
        <FormWorkFlow formData={formData} folderId={folderId} />
      </main>
    </div>
  );
};

export default FormDesign;