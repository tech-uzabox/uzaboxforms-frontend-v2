import React from 'react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';

export const AddUrlQuestion: React.FC<QuestionItemProps> = ({ question, questionIndex, sectionIndex, isMinimized }) => {
  const { t } = useTranslation();
  const { sections, updateSection } = useFormStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedQuestion = { ...question, [name]: value };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  return (
    <div className='space-y-2'>
      <div className='question-container'>
        <label className='main-label'>{t('questionDesign.label')}</label>
        <input
          type="text"
          name="label"
          value={question.label || ''}
          onChange={handleChange}
          className="main-input"
        />
      </div>
      {!isMinimized &&
        <div className='question-container'>
          <label className='main-label'>{t('questionDesign.url')}</label>
          <input
            type='text'
            name='urlName'
            value={question.urlName || ''}
            onChange={handleChange}
            className="main-input"
            placeholder={t('questionDesign.urlPlaceholder')}
          />
        </div>}
    </div>
  );
};