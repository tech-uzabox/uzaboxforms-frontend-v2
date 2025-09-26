import { toast } from 'sonner';
import Section from './Section';
import { useFormStore } from '@/store';
import React, { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { UpdateFormDto } from '@/services/form';
import { useUpdateForm } from '@/hooks/form/use-form';

interface FormWorkFlowProps {
  formData?: {
    name?: string;
    type?: 'INTERNAL' | 'EXTERNAL';
    status?: 'ENABLED' | 'DISABLED';
    archived?: boolean;
  };
  folderId?: string | null;
}

const FormWorkFlow: React.FC<FormWorkFlowProps> = ({ formData }) => {
  const { t } = useTranslation();
  const { sections, formId } = useFormStore();
  const updateFormMutation = useUpdateForm();

  const validateForm = (): boolean => {
    let isValid = true;
    if (!formId) {
      toast.error(t('questionDesign.selectFormName'));
      isValid = false;
    }

    sections?.forEach((section, index) => {
      if (!section.name) {
        toast.error(t('questionDesign.sectionMustHaveName', { index: index + 1 }));
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      const updateData: UpdateFormDto = {
        design: sections || [],
        ...(formData?.name && { name: formData.name }),
        ...(formData?.type && { type: formData.type }),
        ...(formData?.status && { status: formData.status }),
        ...(formData?.archived !== undefined && { archived: formData.archived }),
      };
      
      await updateFormMutation.mutateAsync({ 
        id: formId, 
        data: updateData 
      });
    } catch (error) {
      toast.error(t('questionDesign.savingFormFailed'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {sections && sections.map((section, index) => (
        <Section
          key={index}
          sectionIndex={index}
          section={section}
          totalSections={sections.length}
        />
      ))}
      <div className="w-full flex justify-center">
        <button type="submit" className="main-dark-button">
          {updateFormMutation.isPending ? (
            <p>{t('questionDesign.savingForm')}</p>
          ) : (
            <p>{t('questionDesign.saveForm')}</p>
          )}
        </button>
      </div>
    </form>
  );
};

export default FormWorkFlow;