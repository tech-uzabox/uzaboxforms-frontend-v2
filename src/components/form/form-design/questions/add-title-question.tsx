import React from 'react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';

export const AddTitleQuestion: React.FC<QuestionItemProps> = ({ question, questionIndex, sectionIndex, isMinimized }) => {
  const { t } = useTranslation();
  const { sections, updateSection } = useFormStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuestion = { ...question, titleName: e.target.value };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  return (
    !isMinimized &&
    <input
      value={question.titleName || ''}
      onChange={handleChange}
      className="main-input"
      placeholder={t('questionDesign.titleContent')}
    />
  );
};