import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useFormStore } from "@/store/form-design/form-store";
import FormAnswer from "@/components/form/form-answer/form-answer";

const FormAIPreview = ({
  name,
  formId,
  sections,
}: {
  sections: any;
  name: string;
  formId: string;
}) => {
  const { t } = useTranslation();
  const { setFormId, setSections } = useFormStore();
  const [_currentSectionId, setCurrentSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (formId) {
      if (sections) {
        setSections(sections);
      }
      setFormId(formId as string);
    }
  }, [formId, name, sections]);

  return (
    <main className="p-4 space-y-6 w-full mx-auto flex flex-col h-full">
      <h1 className="text-2xl text-center font-medium">
        {name || t('processManagement.nameNotFound')}
      </h1>
      <FormAnswer setCurrentFormSectionId={setCurrentSectionId} />
    </main>
  );
};

export default FormAIPreview;
