import React from 'react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';

export const DateTimeQuestion: React.FC<QuestionItemProps> = ({ question, sectionIndex, questionIndex, isMinimized }) => {
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
            {/* Existing fields */}
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
                        <label className='main-label'>{t('questionDesign.timeType')}</label>
                        <select
                            name="timeType"
                            value={question.timeType || ''}
                            onChange={handleChange}
                            className="main-input"
                        >
                            <option value="">{t('questionDesign.chooseTimeType')}</option>
                            <option value="all-time">{t('questionDesign.allTime')}</option>
                            <option value="future-only">{t('questionDesign.futureOnly')}</option>
                            <option value="past-only">{t('questionDesign.pastOnly')}</option>
                        </select>
                    </div>
                </>
            )}
            {/* <div className='question-container'>
                <label className='main-label'>Date Type</label>
                <select
                    name="dateType"
                    value={question.dateType || ''}
                    onChange={handleChange}
                    className="main-input"
                >
                    <option value="">Choose an answer</option>
                    <option value="date-only">Date Only</option>
                    <option value="time-only">Time Only</option>
                    <option value="date-time">Date And Time</option>
                </select>
            </div> */}
        </div>
    );
};