import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import { useGetAllAddToDatabases } from '@/hooks';
import React, { useEffect, useState } from 'react';
import type { LevelTypes, QuestionItemProps, QuestionTypes } from '@/types';

export const AddToDatabaseQuestion: React.FC<QuestionItemProps> = ({ question, questionIndex, sectionIndex, isMinimized }) => {
  const { t } = useTranslation();
  const { sections, updateSection } = useFormStore();
  const { data: addToDatabases, isLoading } = useGetAllAddToDatabases();
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(question.addToDatabaseId || null);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(question.selectedLevelId || null);

  useEffect(() => {
    // Sync selectedDatabase and selectedLevelId with question data from the store
    setSelectedDatabase(question.addToDatabaseId || null);
    setSelectedLevelId(question.selectedLevelId || null);
  }, [question]);

  const updateQuestion = (updatedQuestion: QuestionTypes) => {
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const handleDatabaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDatabaseId = e.target.value;
    const selectedDatabaseData = addToDatabases?.find((db: any) => db.id === newDatabaseId);
    const firstLevelId = selectedDatabaseData?.levels[0]?.levelId || null;

    setSelectedDatabase(newDatabaseId);
    setSelectedLevelId(firstLevelId);

    updateQuestion({
      ...question,
      addToDatabaseId: newDatabaseId,
      selectedLevelId: firstLevelId,
    });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedLevelId = e.target.value;
    setSelectedLevelId(newSelectedLevelId);
    updateQuestion({ ...question, selectedLevelId: newSelectedLevelId });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedQuestion = { ...question, [name]: value };
    const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  return (
    <div className="space-y-4">
      <div className='question-container'>
        <label className='main-label'>{t('questionDesign.label')} </label>
        <input
          type="text"
          name="label"
          value={question.label || ''}
          onChange={handleChange}
          className="main-input"
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
            <label htmlFor="database-select" className="main-label">{t('questionDesign.selectDatabase')}</label>
            <select
              id="database-select"
              className="main-input"
              value={selectedDatabase || ''}
              onChange={handleDatabaseChange}
              disabled={isLoading}
            >
              <option value="" disabled>{t('questionDesign.selectADatabase')}</option>
              {addToDatabases?.map((db: any) => (
                <option key={db.id} value={db.id}>
                  {db.name}
                </option>
              ))}
            </select>
          </div>

          {selectedDatabase && (
            <div className='question-container'>
              <label htmlFor="database-select" className="main-label">{t('questionDesign.selectLevel')}</label>
              <select
                id="level-select"
                className="main-input"
                value={selectedLevelId || ''}
                onChange={handleLevelChange}
              >
                <option value="" disabled>{t('questionDesign.selectALevel')}</option>
                {addToDatabases?.find((db: any) => db.id === selectedDatabase)?.levels.map((level: LevelTypes) => (
                  <option key={level.levelId} value={level.levelId}>
                    {level.levelName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
};