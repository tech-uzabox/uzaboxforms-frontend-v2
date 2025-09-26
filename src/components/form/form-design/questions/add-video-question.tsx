import React from 'react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';

export const AddVideoQuestion: React.FC<QuestionItemProps> = ({ question, questionIndex, sectionIndex, isMinimized }) => {
    const { t } = useTranslation();
    const { sections, updateSection } = useFormStore();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedQuestion = { ...question, video: e.target.value };
        const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
        updatedSection.questions[questionIndex] = updatedQuestion;
        updateSection(sectionIndex, updatedSection);
    };

    return (
        !isMinimized &&
        <textarea
            value={question.video}
            className="border-[0.4px] border-gray-200 focus:border-darkBlue outline-none p-2 w-full text-[13.5px] px-4 rounded"
            placeholder={t('questionDesign.videoIFrame')}
            onChange={handleChange}
        />
    );
};