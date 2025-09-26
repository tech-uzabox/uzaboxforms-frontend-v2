import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formStore } from '@/store/form/form-store';
import FormConfigComponent from './form-config-component';
import AddForm from '@/components/form/form-design/add-form';
import { FormListComponentProps } from '@/types/process.types';

const FormListComponent: React.FC<FormListComponentProps> = ({
  forms,
  formOptions,
  onAddForm,
  onRemoveForm,
  onUpdateFormField,
  onMoveFormUp,
  onMoveFormDown,
  checkDuplicateForm,
}) => {
  const { t } = useTranslation();
  const { formList } = formStore();
  const [formOpenStates, setFormOpenStates] = useState<Record<string, boolean>>({});

  // Update form open states when forms change - preserve existing states
  React.useEffect(() => {
    setFormOpenStates((prev) => {
      const newStates: Record<string, boolean> = {};
      
      // Initialize all forms as closed by default, but preserve existing states
      forms.forEach((form, index) => {
        const formKey = `${form.formId}-${index}`;
        newStates[formKey] = prev[formKey] ?? false;
      });
      
      return newStates;
    });
  }, [forms]);

  const toggleFormOpen = (index: number) => {
    setFormOpenStates((prev) => {
      const form = forms[index];
      if (!form) return prev;
      
      const formKey = `${form.formId}-${index}`;
      return {
        ...prev,
        [formKey]: !prev[formKey]
      };
    });
  };

  const handleSelectForm = (index: number) => (formId: string) => {
    if (checkDuplicateForm(formId)) {
      return;
    }
    onAddForm(index, formId);
  };

  // Filter out already added forms from options
  const getFilteredFormOptions = () => {
    const addedFormIds = forms.map(form => form.formId);
    return formOptions.filter(option => !addedFormIds.includes(option.value));
  };

  const filteredOptions = getFilteredFormOptions();
  const hasAvailableForms = filteredOptions.length > 0;

  return (
    <div>
      {/* Add first form */}
      <div className="mb-4">
        {hasAvailableForms ? (
          <AddForm 
            name={t('processManagement.addForm')} 
            options={filteredOptions} 
            onSelect={handleSelectForm(0)} 
          />
        ) : (
          <div className="text-sm text-gray-500 italic">
            {t('processManagement.allFormsAdded')}
          </div>
        )}
      </div>

      {/* Form list */}
      {forms.map((form, index) => {
        const formData = formList?.find((f: any) => f.id === form.formId);
        if (!formData) return null;

        const formKey = `${form.formId}-${index}`;
        return (
          <FormConfigComponent
            key={formKey}
            form={form}
            index={index}
            formData={formData}
            isOpen={formOpenStates[formKey] ?? false}
            onToggle={() => toggleFormOpen(index)}
            onMoveUp={() => onMoveFormUp(index)}
            onMoveDown={() => onMoveFormDown(index)}
            onRemove={() => onRemoveForm(index)}
            onUpdateField={(field, value) => onUpdateFormField(index, field, value)}
            onAddForm={handleSelectForm(index + 1)}
            formOptions={filteredOptions}
            canMoveUp={index > 0}
            canMoveDown={index < forms.length - 1}
          />
        );
      })}
    </div>
  );
};

export default FormListComponent;
