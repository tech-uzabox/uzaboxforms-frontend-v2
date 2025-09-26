import type { QuestionTypes } from '@/types';
import { useTranslation } from 'react-i18next';
import { useFormResponseStore } from '@/store';
import React, { useEffect, useState } from 'react';
import CustomInput from '@/components/custom-input';


interface ShortTextProps {
  question: QuestionTypes;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const ShortTextAnswer: React.FC<ShortTextProps> = ({ question, sectionId, sectionName, setValidationErrors }) => {
  const { t } = useTranslation();
  const { formResponses, setResponse } = useFormResponseStore();

  const existingSection = formResponses[sectionId];
  const existingResponse = existingSection?.questions?.[question.id]?.response || '';

  const [value, setValue] = useState(existingResponse);

  useEffect(() => {
    if (question.required == 'yes' && !value) {
      setValidationErrors(sectionId, question.id, `${question.label} ${t('forms.isRequired')}`);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    // Save response
    setResponse(
      sectionId,
      sectionName,
      question.id,
      question.type,
      question.label as string,
      inputValue
    );

    // Validation for required field
    if (question.required == 'yes' && !inputValue) {
      setValidationErrors(sectionId, question.id, `${question.label} ${t('forms.isRequired')}`);
    } 
    // Validation for max characters
    else if (question.maxCharacters && inputValue.length > question.maxCharacters) {
      setValidationErrors(sectionId, question.id, `${question.label} must be less than ${question.maxCharacters} characters`);
    }
    else {
      setValidationErrors(sectionId, question.id, null);
    }
  };

  return (
    <div className="mb-4">
      <label className="main-label">
        {question.label} {question.required == 'yes' && <span className="text-red-500">*</span>}
      </label>
      <CustomInput
        type="text"
        maxLength={question.maxCharacters}
        placeholder={`Enter up to ${question.maxCharacters} characters`}
        containerStyles='!rounded mt-1'
        inputStyles='!h-[48px]'
        value={value}
        required={question.required === 'yes'}
        onChange={handleChange}
      />
    </div>
  );
};