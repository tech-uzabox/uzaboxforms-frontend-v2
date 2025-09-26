import React from 'react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';

export const ParagraphQuestion: React.FC<QuestionItemProps> = ({ question, sectionIndex, questionIndex, isMinimized }) => {
  const { t } = useTranslation();
  const { sections, updateSection } = useFormStore();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedQuestion = { ...question, [name]: value };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  return (
    <div className='space-y-4'>
      <div className='question-container'>
        <label className='main-label'>{t('questionDesign.label')}</label>
        <input
          name="label"
          value={question.label || ''}
          onChange={handleChange}
          className="main-input"
          placeholder={t('questionDesign.paragraph')}
        />
      </div>
      {!isMinimized && (<>
        <div className='question-container'>
          <label className='main-label'>{t('questionDesign.required')}</label>
          <select
            name="required"
            value={question.required || ''}
            onChange={handleChange}
            className="main-input"
          >
            <option value="">{t('questionDesign.chooseAnAnswer')}</option>
            <option value="yes">{t('questionDesign.yes')}</option>
            <option value="no">{t('questionDesign.no')}</option>
          </select>
        </div>
        <div className='question-container'>
          <label className='main-label'>{t('questionDesign.minCharacters')}</label>
          <input
            type="number"
            name="minCharacters"
            value={question.minCharacters || ''}
            onChange={handleChange}
            className="main-input"
            placeholder={t('questionDesign.minCharacters')}
          />
        </div>
        <div className='question-container'>
          <label className='main-label'>{t('questionDesign.maxCharacters')}</label>
          <input
            type="number"
            name="maxCharacters"
            value={question.maxCharacters || ''}
            onChange={handleChange}
            className="main-input"
            placeholder={t('questionDesign.maxCharacters')}
          />
        </div>
      </>)}
    </div>
  );
};