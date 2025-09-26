import React from 'react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';

export const NumberQuestion: React.FC<QuestionItemProps> = ({ question, sectionIndex, questionIndex, isMinimized }) => {
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
                <label className='main-label'>{t('questionDesign.label')}</label>
                <input
                    type="text"
                    name="label"
                    value={question.label || ''}
                    onChange={handleChange}
                    className="main-input"
                    placeholder={t('questionDesign.questionLabel')}
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
                        <label className='main-label'>{t('questionDesign.maxCharacters')}</label>
                        <input
                            type="text"
                            name="maxCharacters"
                            value={question.maxCharacters || ''}
                            onChange={handleChange}
                            className="main-input"
                            placeholder={t('questionDesign.maxCharacters')}
                        />
                    </div>
                    <div className='question-container'>
                        <label className='main-label'>{t('questionDesign.decimalOptions')}</label>
                        <select
                            name="decimalOptions"
                            value={question.decimalOptions || ''}
                            onChange={handleChange}
                            className="main-input"
                        >
                            <option value="without-decimals">{t('questionDesign.withoutDecimals')}</option>
                            <option value="with-decimals">{t('questionDesign.withDecimals')}</option>
                        </select>
                    </div>
                    {question.decimalOptions == "with-decimals" && (
                        <div className='question-container'>
                            <label className='main-label'>{t('questionDesign.decimals')}</label>
                            <div className='flex border w-full'>
                                <input
                                    type="number"
                                    name="numberOfDecimals"
                                    value={question.numberOfDecimals || ''}
                                    onChange={handleChange}
                                    className='main-input'
                                    placeholder={t('questionDesign.numberOfDecimals')}
                                />
                            </div>
                        </div>
                    )}
                    <div className='question-container'>
                        <label className='main-label'>{t('questionDesign.attributes')}: </label>
                        <select
                            name="attributes"
                            value={question.attributes || ''}
                            onChange={handleChange}
                            className="main-input"
                        >
                            <option value="">{t('questionDesign.selectHere')}</option>
                            <option value="greater-than">{t('questionDesign.greaterThan')}</option>
                            <option value="greater-equals">{t('questionDesign.greaterEquals')}</option>
                            <option value="equals">{t('questionDesign.equals')}</option>
                            <option value="not-equals">{t('questionDesign.notEquals')}</option>
                            <option value="less-than">{t('questionDesign.lessThan')}</option>
                            <option value="less-equals">{t('questionDesign.lessEquals')}</option>
                            <option value="between">{t('questionDesign.between')}</option>
                        </select>
                    </div>
                    {question.attributes && (
                        <div className='question-container'>
                            <label className='main-label'>{t('questionDesign.attributeValue')}: </label>
                            <div className='flex border w-full'>
                                <input
                                    type="number"
                                    name="attributeValue"
                                    value={question.attributeValue}
                                    onChange={handleChange}
                                    className='main-input'
                                    placeholder={t('questionDesign.attributeValue')}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};