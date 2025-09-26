import React from 'react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import { RoleSelector } from '@/components/ui';
import type { QuestionItemProps } from '@/types';

export const AddUsersQuestion: React.FC<QuestionItemProps> = ({ question, sectionIndex, questionIndex, isMinimized }) => {
  const { t } = useTranslation();
  const { sections, updateSection } = useFormStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedQuestion = { ...question, [name]: value };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedQuestion = { ...question, [name]: parseInt(value) || 0 };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const updatedQuestion = { ...question, [name]: checked };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const handleRolesChange = (roles: string[]) => {
    const updatedQuestion = { ...question, selectedRoles: roles };
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
            <label className='main-label'>{t('questionDesign.userSelectionType')} </label>
            <select
              name="userSelectionType"
              value={question.userSelectionType || 'all-users'}
              onChange={handleChange}
              className="main-input"
            >
              <option value="all-users">{t('questionDesign.allUsers')}</option>
              <option value="specific-roles">{t('questionDesign.selectSpecificRoles')}</option>
            </select>
          </div>

          {question.userSelectionType === 'specific-roles' && (
            <div className='question-container'>
              <RoleSelector
                selectedRoles={question.selectedRoles || []}
                onRolesChange={handleRolesChange}
                label={t('questionDesign.selectRoles')}
                placeholder={t('questionDesign.selectRolesPlaceholder')}
                required
              />
            </div>
          )}

          <div className='question-container'>
            <label className='main-label'>{t('questionDesign.allowMultipleSelections')} </label>
            <div className='flex items-center space-x-2'>
              <input
                type="checkbox"
                name="allowMultipleSelections"
                checked={question.allowMultipleSelections || false}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-darkBlue focus:ring-darkBlue border-gray-300 rounded"
              />
              <span className='text-sm'>{t('questionDesign.allowUsersToSelectMultipleUsers')}</span>
            </div>
          </div>

          {question.allowMultipleSelections && (
            <div className='question-container'>
              <label className='main-label'>{t('questionDesign.maximumUserSelections')} </label>
              <input
                type="number"
                name="maxUserSelections"
                value={question.maxUserSelections || 1}
                onChange={handleNumberChange}
                className="main-input"
                min="1"
                placeholder={t('questionDesign.maximumNumberOfUsers')}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};