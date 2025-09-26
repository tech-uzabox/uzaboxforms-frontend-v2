import { useTranslation } from 'react-i18next';
import { useFormResponseStore } from '@/store';
import React, { useEffect, useState } from 'react';
import CustomInput from '@/components/custom-input';

interface NumberProps {
  question: any;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const NumberAnswer: React.FC<NumberProps> = ({ question, sectionId, sectionName, setValidationErrors }) => {
  const { t } = useTranslation();
  const { formResponses, setResponse } = useFormResponseStore();

  // Find existing response for this question, if any
  const existingSection = formResponses[sectionId];
  const existingResponse = existingSection?.questions[question.id]?.response || '';

  const [value, setValue] = useState<string>(existingResponse);
  const [validationError, _setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (question.required == 'yes' && !value) {
      setValidationErrors(sectionId, question.id, `${question.label} ${t('forms.isRequired')}`);
    } else {
      setValidationErrors(sectionId, question.id, null);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let error: string | null = null;

    // Validate based on question attributes
    if (question.maxCharacters && inputValue.length > question.maxCharacters) {
      error = `Value exceeds maximum length of ${question.maxCharacters}`;
    } else if (question.attributes) {
      const numericValue = parseFloat(inputValue);
      const attributeValue = parseFloat(question.attributeValue || '0');

      switch (question.attributes) {
        case 'greater-than':
          if (numericValue <= attributeValue) error = `Value must be greater than ${attributeValue}`;
          break;
        case 'greater-equals':
          if (numericValue < attributeValue) error = `Value must be greater or equal to ${attributeValue}`;
          break;
        case 'equals':
          if (numericValue !== attributeValue) error = `Value must be equal to ${attributeValue}`;
          break;
        case 'not-equals':
          if (numericValue === attributeValue) error = `Value must not be equal to ${attributeValue}`;
          break;
        case 'less-than':
          if (numericValue >= attributeValue) error = `Value must be less than ${attributeValue}`;
          break;
        case 'less-equals':
          if (numericValue > attributeValue) error = `Value must be less or equal to ${attributeValue}`;
          break;
        case 'between':
          const [min, max] = (question.AttributeValue || '').split(',').map((val: any) => parseFloat(val.trim()));
          if (numericValue < min || numericValue > max) error = `Value must be between ${min} and ${max}`;
          break;
        default:
          break;
      }
    }

    setValue(inputValue);
    setResponse(
      sectionId,
      sectionName,
      question.id,
      question.type,
      question.label as string,
      inputValue
    );

    if (error) {
      setValidationErrors(sectionId, question.id, error);
    } else {
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
        pattern="\d*"
        maxLength={question.maxCharacters}
        placeholder={question.label}
        required={question.required === 'yes'}
        containerStyles='!rounded mt-1'
        inputStyles='!h-[48px]'
        value={value}
        onChange={handleChange}
      />
      {validationError && <p className="text-red-500 text-sm mt-1">{validationError}</p>}
    </div>
  );
};