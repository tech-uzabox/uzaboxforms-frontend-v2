import React from 'react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';
import SearchSection from '@/components/form/form-design/search-section';

export const DropDownQuestion: React.FC<QuestionItemProps> = ({ question, sectionIndex, questionIndex, isMinimized }) => {
  const { t } = useTranslation();
  const { sections, updateSection } = useFormStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedQuestion = { ...question, [name]: value };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...(question.options || [])];
    updatedOptions[index] = value;
    const updatedQuestion = { ...question, options: updatedOptions };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const addOption = () => {
    const updatedOptions = [...(question.options || []), ''];
    const updatedQuestion = { ...question, options: updatedOptions };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const removeOption = (index: number) => {
    const updatedOptions = [...(question.options || [])];
    updatedOptions.splice(index, 1);
    const updatedQuestion = { ...question, options: updatedOptions };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const handleSelectSection = (optionIndex: number, value: string) => {
    const updatedNextSections = { ...(question.nextSections || {}), [optionIndex]: value };
    const updatedQuestion = { ...question, nextSections: updatedNextSections };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const sectionOptions = sections.map((section, index) => ({
    title: `${t('common.section')} ${index + 1}: ${section.name}`,
    value: section.id,
  }));

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
            <label className='main-label'>{t('questionDesign.dropdownType')} </label>
            <select
              name="dropdownType"
              value={question.dropdownType || 'simple'}
              onChange={handleChange}
              className="main-input"
            >
              <option value="simple">{t('questionDesign.simple')}</option>
              <option value="with-next-section">{t('questionDesign.withNextSection')}</option>
              <option value="from-database">{t('questionDesign.fromDatabase')}</option>
            </select>
          </div>

          <div className='space-y-4'>
            {question.options && question.options.map((option, index) => (
              <div key={index} className='flex items-center space-x-4'>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="main-input"
                  placeholder={`${t('questionDesign.option')} ${index + 1}`}
                />
                {question.dropdownType === 'with-next-section' && (
                  <SearchSection
                    options={sectionOptions}
                    value={question.nextSections?.[index] || ''}
                    onSelect={(value) => handleSelectSection(index, value)}
                  />
                )}
                <button type="button" onClick={() => removeOption(index)} className="text-red-500">X</button>
              </div>
            ))}
            <button type="button" onClick={addOption} className="text-darkBlue float-right">{t('questionDesign.addNewOption')}</button>
          </div>
        </>
      )}
    </div>
  );
};