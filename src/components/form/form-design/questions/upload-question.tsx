import React from 'react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';

export const UploadQuestion: React.FC<QuestionItemProps> = ({ question, sectionIndex, questionIndex, isMinimized }) => {
  const { t } = useTranslation();
  const { sections, updateSection } = useFormStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedQuestion = { ...question, [name]: value };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  return (
    <div className='space-y-4'>
      <div className='question-container'>
        <label className='main-label'>{t('questionDesign.label')} </label>
        <input
          type="text"
          name="label"
          value={question.label || ''}
          onChange={handleChange}
          className="main-input"
          placeholder={t('questionDesign.uploadLabel')}
        />
      </div>
      {!isMinimized && (
        <>
          <div className='question-container'>
            <label className='main-label'>{t('questionDesign.required')} </label>
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
            <label className='main-label'>{t('questionDesign.document')} </label>
            <select
              name="documentType"
              value={question.documentType || ''}
              onChange={handleChange}
              className="main-input"
            >
              <option value="">{t('questionDesign.chooseAnAnswer')}</option>
              <option value="pdf">{t('questionDesign.pdf')}</option>
              <option value="image">{t('questionDesign.image')}</option>
              <option value="document">{t('questionDesign.documentType')}</option>
              <option value="spreadsheet">{t('questionDesign.spreadsheet')}</option>
              <option value="presentation">{t('questionDesign.presentation')}</option>
              <option value="audio">{t('questionDesign.audio')}</option>
              <option value="video">{t('questionDesign.video')}</option>
            </select>
          </div>
          <div className='question-container'>
            <label className='main-label'>{t('questionDesign.maxFileSize')} </label>
            <input
              type="number"
              name="maxFileSize"
              value={question.maxFileSize || ''}
              onChange={handleChange}
              className="main-input"
              placeholder={t('questionDesign.maxFileSizePlaceholder')}
            />
          </div>
        </>
      )}
    </div>
  );
};