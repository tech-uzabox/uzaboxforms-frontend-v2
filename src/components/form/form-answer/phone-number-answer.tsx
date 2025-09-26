import 'react-phone-input-2/lib/style.css';
import type { QuestionTypes } from '@/types';
import PhoneInput from 'react-phone-input-2';
import { useTranslation } from 'react-i18next';
import { useFormResponseStore } from '@/store';
import React, { useEffect, useState } from 'react';

interface PhoneProps {
    question: QuestionTypes;
    sectionId: string;
    sectionName: string;
    setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const PhoneNumberAnswer: React.FC<PhoneProps> = ({ question, sectionId, sectionName, setValidationErrors }) => {
    const { t } = useTranslation();
    const { formResponses, setResponse } = useFormResponseStore();

    const existingSection = formResponses[sectionId];
    const existingResponse = existingSection?.questions[question.id]?.response || '';
    const [value, setValue] = useState(existingResponse);

    useEffect(() => {
        if (question.required == 'yes' && !value) {
            setValidationErrors(sectionId, question.id, `${question.label} ${t('forms.isRequired')}`);
        }
    }, []);

    const handlePhoneChange = (phoneValue: string) => {
        setValue(phoneValue);

        // Save response
        setResponse(
            sectionId,
            sectionName,
            question.id,
            question.type,
            question.label as string,
            phoneValue
        );

        // Validation for required field
        if (question.required == 'yes' && !phoneValue) {
            setValidationErrors(sectionId, question.id, `${question.label} ${t('forms.isRequired')}`);
        } else {
            setValidationErrors(sectionId, question.id, null);
        }
    };

    return (
        <div className="mb-4">
            <label className="main-label">
                {question.label} {question.required == 'yes' && <span className="text-red-500">*</span>}
            </label>
            <PhoneInput
                country={'rw'}
                value={value}
                onChange={handlePhoneChange}
                inputProps={{
                    required: question.required === 'yes',
                    autoFocus: false,
                }}
            />
        </div>
    );
};
