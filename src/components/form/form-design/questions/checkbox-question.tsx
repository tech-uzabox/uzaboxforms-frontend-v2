import React from 'react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';

export const CheckboxQuestion: React.FC<QuestionItemProps> = ({ question, sectionIndex, questionIndex, isMinimized }) => {
  const { t } = useTranslation();
  const { sections, updateSection } = useFormStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedQuestion = { ...question, [name]: value };

    // Handle hyperlinkType changes
    if (name === 'hyperlinkType' && value === 'without-hyperlinks') {
      updatedQuestion = { ...updatedQuestion, urls: [] };
    } else if (name === 'hyperlinkType' && value === 'with-hyperlinks' && !updatedQuestion.urls) {
      updatedQuestion = { ...updatedQuestion, urls: question.options?.map(() => '') || [] };
    }

    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const handleOptionChange = (index: number, field: 'option' | 'url', value: string) => {
    // Optional URL validation
    if (field === 'url' && value && !value.match(/^https?:\/\/.+/)) {
      console.warn('Please enter a valid URL starting with http:// or https://');
      return;
    }
    const updatedOptions = [...(question.options || [])];
    const updatedUrls = [...(question.urls || [])];
    if (field === 'option') {
      updatedOptions[index] = value;
    } else {
      updatedUrls[index] = value;
    }
    const updatedQuestion = { ...question, options: updatedOptions, urls: updatedUrls };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const addOption = () => {
    const updatedOptions = [...(question.options || []), ''];
    const updatedUrls = question.hyperlinkType === 'with-hyperlinks' ? [...(question.urls || []), ''] : question.urls;
    const updatedQuestion = { ...question, options: updatedOptions, urls: updatedUrls };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const removeOption = (index: number) => {
    const updatedOptions = [...(question.options || [])];
    const updatedUrls = [...(question.urls || [])];
    updatedOptions.splice(index, 1);
    if (question.hyperlinkType === 'with-hyperlinks') {
      updatedUrls.splice(index, 1);
    }
    const updatedQuestion = { ...question, options: updatedOptions, urls: updatedUrls };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  return (
    <div className='space-y-6'>
      <div className='question-container'>
        <label className='main-label'>{t('questionDesign.label')}</label>
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
            <label className='main-label'>{t('questionDesign.hyperlinkType')}</label>
            <select
              name="hyperlinkType"
              value={question.hyperlinkType || ''}
              onChange={handleChange}
              className="main-input"
            >
              <option value="">{t('questionDesign.chooseAnOption')}</option>
              <option value="with-hyperlinks">{t('questionDesign.withHyperlinks')}</option>
              <option value="without-hyperlinks">{t('questionDesign.withoutHyperlinks')}</option>
            </select>
          </div>
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
            <label className='main-label'>{t('questionDesign.selectOptions')}</label>
            <select
              name="selectOptions"
              value={question.selectOptions || ''} // Default to empty string to avoid undefined
              onChange={handleChange}
              className="main-input"
            >
              <option value="">{t('questionDesign.chooseAnOption')}</option>
              <option value="select-at-least">{t('questionDesign.selectAtLeast')}</option>
              <option value="select-at-most">{t('questionDesign.selectAtMost')}</option>
              <option value="select-exactly">{t('questionDesign.selectExactly')}</option>
            </select>
          </div>
          <div className='question-container'>
            <label className='main-label'>{t('questionDesign.numberOfOptions')}</label>
            <input
              type="number"
              name="numberOfOptions"
              value={question.numberOfOptions || ''}
              onChange={handleChange}
              className="main-input"
              placeholder={t('questionDesign.numberHere')}
            />
          </div>
          <div className='space-y-4'>
            {question.options && question.options.map((option, index) => (
              <div key={index} className='flex items-center justify-between space-x-4'>
                <div className='flex w-full space-x-2'>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, 'option', e.target.value)}
                    className="main-input"
                    placeholder={`${t('questionDesign.option')} ${index + 1}`}
                  />
                  {question.hyperlinkType === 'with-hyperlinks' && (
                    <input
                      type="url"
                      value={question.urls?.[index] || ''}
                      onChange={(e) => handleOptionChange(index, 'url', e.target.value)}
                      className="main-input"
                      placeholder={`${t('questionDesign.urlForOption')} ${index + 1}`}
                    />
                  )}
                </div>
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