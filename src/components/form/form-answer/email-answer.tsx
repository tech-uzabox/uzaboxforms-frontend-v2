import type { QuestionTypes } from '@/types';
import { useTranslation } from 'react-i18next';
import { useFormResponseStore } from '@/store';
import React, { useEffect, useState } from 'react';
import CustomInput from '@/components/custom-input';

// Constants for input types
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ShortTextProps {
    question: QuestionTypes;
    sectionId: string;
    sectionName: string;
    setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const EmailAnswer: React.FC<ShortTextProps> = ({ question, sectionId, sectionName, setValidationErrors }) => {
    const { t } = useTranslation();
    const { formResponses, setResponse } = useFormResponseStore();

    const existingSection = formResponses[sectionId];
    const existingResponse = existingSection?.questions[question.id]?.response || '';

    const [value, setValue] = useState(existingResponse);
    const [error, setError] = useState("")

    useEffect(() => {
        if (question.required == 'yes' && !value) {
            setValidationErrors(sectionId, question.id, `${question.label} ${t('forms.isRequired')}`);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setValue(inputValue);

        // Save response
        setResponse(
            sectionId,
            sectionName,
            question.id,
            question.type,
            question.label as string,
            inputValue
        );

        // Validation for required field
        if (question.required == 'yes' && !inputValue) {
            setValidationErrors(sectionId, question.id, `${question.label} ${t('forms.isRequired')}`);
        }

        if (!EMAIL_REGEX.test(inputValue)) {
            setValidationErrors(sectionId, question.id, t('forms.enterValidEmail'));
            setError(t('forms.enterValidEmailShort'))
        } else {
            setValidationErrors(sectionId, question.id, null);
            setError("")
        }
    };

    return (
        <div className="mb-4">
            <label className="main-label">
                {question.label} {question.required == 'yes' && <span className="text-red-500">*</span>}
            </label>
            <CustomInput
                type="email"
                maxLength={question.maxCharacters}
                placeholder={`email`}
                containerStyles='!rounded mt-1'
                inputStyles='!h-[48px]'
                value={value}
                required={question.required === 'yes'}
                onChange={handleChange}
            />
            <p className='text-red-500 text-xs mt-2'>{error}</p>
        </div>
    );
};