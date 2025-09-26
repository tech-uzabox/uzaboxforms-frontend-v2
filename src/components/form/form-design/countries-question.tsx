import React from 'react';
import { useFormStore } from '@/store';
import { QuestionItemProps } from '@/types';
import { useTranslation } from 'react-i18next';

const CountriesQuestion: React.FC<QuestionItemProps> = ({ question, sectionIndex, questionIndex, isMinimized }) => {
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
    <div className='space-y-6'>
      <div className='question-container'>
        <label className='main-label'>{t('questionDesign.label')} </label>
        <input
          type="text"
          name="label"
          value={question.label || ''}
          onChange={handleChange}
          className="main-input"
          placeholder={t('questionDesign.label')}
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
            <label className='main-label'>{t('questionDesign.region')}</label>
            <select
              name="countryLevel"
              value={question.countryLevel}
              onChange={handleChange}
              className="main-input"
            >
              <option value="" disabled selected>{t('questionDesign.pleaseSelectRegion')}</option>
              <option value="africa">{t('questionDesign.africa')}</option>
              <option value="world">{t('questionDesign.world')}</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default CountriesQuestion;
