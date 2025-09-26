import type { QuestionTypes } from '@/types';
import { useTranslation } from 'react-i18next';
import { useFormResponseStore } from '@/store';
import React, { useEffect, useState } from 'react';

interface DropdownProps {
  question: QuestionTypes;
  sectionId: string;
  sectionName: string;
  onChange: (questionId: string, selectedOptionIndex: number) => void;
  setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const DropdownAnswer: React.FC<DropdownProps> = ({ question, sectionId, sectionName, onChange, setValidationErrors }) => {
  const { t } = useTranslation();
  const { formResponses, setResponse } = useFormResponseStore();

  // Ensure options is defined
  const options = question.options ?? [];

  // Find existing response for this question, if any
  const existingSection = formResponses[sectionId];
  const existingResponse = existingSection?.questions[question.id]?.response;

  // Initialize state with existing response, if any
  const initialSelectedIndex = options.indexOf(existingResponse ?? '');
  const [selectedOption, setSelectedOption] = useState<number | null>(initialSelectedIndex !== -1 ? initialSelectedIndex : null);

  useEffect(() => {
    if (question.required == 'yes' && selectedOption === null) {
      setValidationErrors(sectionId, question.id, `${question.label} ${t('forms.isRequired')}`);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value, 10);
    setSelectedOption(selectedIndex);

    const selectedLabel = options[selectedIndex] ?? '';
    setResponse(
      sectionId,
      sectionName,
      question.id,
      question.type,
      question.label as string,
      selectedLabel
    );

    onChange(question.id, selectedIndex);

    if (question.required == 'yes' && isNaN(selectedIndex)) {
      setValidationErrors(sectionId, question.id, `${question.label} ${t('forms.isRequired')}`);
    } else {
      setValidationErrors(sectionId, question.id, null);
    }
  };

  return (
    <div className="question-container">
      <label className="main-label mb-1">
        {question.label} {question.required == 'yes' && <span className="text-red-500">*</span>}
      </label>
      <select
        className="main-select"
        required={question.required === 'yes'}
        value={selectedOption !== null ? selectedOption : ''}
        onChange={handleChange}
      >
        <option value="" disabled>{t('forms.selectAnOption')}</option>
        {options.map((option: string, index: number) => (
          <option key={index} value={index}>{option}</option>
        ))}
      </select>
    </div>
  );
};