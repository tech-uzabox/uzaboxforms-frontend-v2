import type { QuestionTypes } from '@/types';
import { useTranslation } from 'react-i18next';
import { useFormResponseStore } from '@/store';
import React, { useEffect, useState } from 'react';

interface CheckboxProps {
  question: QuestionTypes;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const CheckboxAnswer: React.FC<CheckboxProps> = ({ question, sectionId, sectionName, setValidationErrors }) => {
  const { t } = useTranslation();
  const { formResponses, setResponse } = useFormResponseStore();
  const options = question.options ?? [];
  const urls = question.urls ?? [];
  const existingSection = formResponses[sectionId];
  const existingResponse = existingSection?.questions[question.id]?.response || [];
  const initialSelectedOptions = options.map((option: string) => existingResponse.some((item: any) => item.option === option && item.checked));

  const [selectedOptions, setSelectedOptions] = useState<boolean[]>(initialSelectedOptions);

  useEffect(() => {
    let error: string | null = null;
    if (question.required === 'yes' && !selectedOptions.some(checked => checked)) {
      error = `${question.label} ${t('forms.isRequired')}`;
    }

    setValidationErrors(sectionId, question.id, error);
  }, [selectedOptions, question, sectionId]);

  const handleCheckboxChange = (index: number) => {
    const updatedOptions = selectedOptions.map((checked, i) =>
      i === index ? !checked : checked
    );
    setSelectedOptions(updatedOptions);

    const responseDetails = options.map((option: string, i: number) => ({
      option,
      checked: updatedOptions[i],
      url: urls[i] || '',
    }));

    let error: string | null = null;

    if (question.required === 'yes' && !updatedOptions.some(checked => checked)) {
      error = `${question.label} ${t('forms.isRequired')}`;
    }

    if (question.numberOfOptions) {
      const numSelected = updatedOptions.filter(checked => checked).length;
      if (question.selectOptions === 'select-at-least' && numSelected < question.numberOfOptions) {
        error = t('forms.selectAtLeast', { count: question.numberOfOptions });
      } else if (question.selectOptions === 'select-at-most' && numSelected > question.numberOfOptions) {
        error = t('forms.selectAtMost', { count: question.numberOfOptions });
      } else if (question.selectOptions === 'select-exactly' && numSelected !== question.numberOfOptions) {
        error = t('forms.selectExactly', { count: question.numberOfOptions });
      }
    }

    setValidationErrors(sectionId, question.id, error);

    setResponse(
      sectionId,
      sectionName,
      question.id,
      question.type,
      question.label as string,
      responseDetails as any
    );
  };

  return (
    <div className="mb-4">
      <label className="main-label">
        {question.label} {question.required === 'yes' && <span className="text-red-500">*</span>}
      </label>
      {options.map((option: string, index: number) => (
        <div key={index} className="flex items-center my-1">
          <input
            type="checkbox"
            id={`checkbox-${index}`}
            className="h-4 w-4 mr-2 border-none accent-[#001A55]"
            checked={selectedOptions[index]}
            onChange={() => handleCheckboxChange(index)}
          />
          <label htmlFor={`checkbox-${index}`} className="main-label">
            {urls[index] ? (
              <a
                href={urls[index] as string}
                target="_blank"
                rel="noopener noreferrer"
                className="text-darkBlue hover:underline"
              >
                {option}
              </a>
            ) : (
              option
            )}
          </label>
        </div>
      ))}
    </div>
  );
};