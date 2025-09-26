import { useFormStore } from '@/store';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';

export const DateRangeQuestion: React.FC<QuestionItemProps> = ({ question, sectionIndex, questionIndex, isMinimized }) => {
    const { t } = useTranslation();
    const { sections, updateSection } = useFormStore();
    const [excludedDates, setExcludedDates] = useState<string[]>(question.excludedDates || []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedQuestion = { ...question, [name]: value };
        const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
        updatedSection.questions[questionIndex] = updatedQuestion;
        updateSection(sectionIndex, updatedSection);
    };

    // Handle excluded dates input
    const handleExcludedDatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const datesArray = value.split(',').map(date => date.trim());
        setExcludedDates(datesArray);
        const updatedQuestion = { ...question, excludedDates: datesArray };
        const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
        updatedSection.questions[questionIndex] = updatedQuestion;
        updateSection(sectionIndex, updatedSection);
    };

    return (
        <div className='space-y-4'>
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
            {!isMinimized && (
                <>
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
                        <label className='main-label'>{t('questionDesign.rangeCalculation')}</label>
                        <select
                            name="rangeCalculation"
                            value={question.rangeCalculation || ''}
                            onChange={handleChange}
                            className="main-input"
                        >
                            <option value="">{t('questionDesign.chooseAnOption')}</option>
                            <option value="days">{t('questionDesign.totalDays')}</option>
                            <option value="exclude-weekends">{t('questionDesign.excludeWeekends')}</option>
                            <option value="exclude-specified-days">{t('questionDesign.excludeSpecifiedDays')}</option>
                            <option value="exclude-specified-dates-and-weekends">{t('questionDesign.excludeSpecifiedDatesAndWeekends')}</option>
                        </select>
                    </div>

                    {(question.rangeCalculation === 'exclude-specified-days' || question.rangeCalculation === 'exclude-specified-dates-and-weekends') && (
                        <div className='question-container'>
                            <label className='main-label'>
                                {question.rangeCalculation === 'exclude-specified-days'
                                    ? t('questionDesign.enterDatesToExclude')
                                    : t('questionDesign.enterDatesToExcludeWithWeekends')}
                            </label>
                            <input
                                type="text"
                                value={excludedDates.join(', ')}
                                onChange={handleExcludedDatesChange}
                                className="main-input"
                                placeholder={t('questionDesign.dateFormatPlaceholder')}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};