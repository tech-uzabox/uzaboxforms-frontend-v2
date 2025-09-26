import { useTranslation } from 'react-i18next';
import { useGetAddToDatabaseById } from '@/hooks';
import React, { useEffect, useState } from 'react';
import type { QuestionTypes, LevelTypes } from '@/types';
import { useFormResponseStore } from '@/store/form/use-form-response-store';

interface MultipleDropdownAnswerProps {
    question: QuestionTypes;
    sectionId: string;
    sectionName: string;
    setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const MultipleDropdownAnswer: React.FC<MultipleDropdownAnswerProps> = ({
    question,
    sectionId,
    sectionName,
    setValidationErrors,
}) => {
    const { t } = useTranslation();
    const { formResponses, setResponse } = useFormResponseStore();
    const { data: database } = useGetAddToDatabaseById(question.addToDatabaseId as string);
    const existingSection = formResponses[sectionId];
    const existingResponse = existingSection?.questions[question.id]?.response || {};

    const [levels, setLevels] = useState<LevelTypes[]>([]);
    const [selectedValues, setSelectedValues] = useState<Record<number, string>>({});

    useEffect(() => {
        if (database) {
            const indexOfSelectedLevel = database.levels.findIndex((level: LevelTypes) => level.levelId === question.selectedLevelId);
            if (indexOfSelectedLevel >= 0) {
                setLevels(database.levels.slice(0, indexOfSelectedLevel + 1));
            } else {
                setLevels([]);
            }
        }
    }, [database]);

    useEffect(() => {
        const initialSelectedValues: Record<number, string> = {};
        Object.entries(existingResponse).forEach(([key, value]) => {
            initialSelectedValues[parseInt(key)] = value as string;
        });
        setSelectedValues(initialSelectedValues);
    }, []);

    useEffect(() => {
        const responses = levels.map((level, index) => {
            const selectedItem = level.items.find(item => item.itemId === selectedValues[index]);
            return {
                levelName: level.levelName,
                response: selectedItem ? selectedItem.itemName : '',
            };
        });

        if (question.required == 'yes' && responses.some((response) => response.response === '')) {
            setValidationErrors(sectionId, question.id, `${question.label} ${t('forms.isRequired')}`);
        } else {
            setValidationErrors(sectionId, question.id, null);
        }

        setResponse(
            sectionId,
            sectionName,
            question.id,
            question.type,
            question.label as string,
            responses as any
        );
    }, [selectedValues, levels]);

    const handleChange = (levelIndex: number, itemId: string) => {
        setSelectedValues((prevValues) => ({
            ...prevValues,
            [levelIndex]: itemId,
        }));
    };

    const getOptionsForLevel = (levelIndex: number) => {
        const level = levels[levelIndex];
        if (!level) return [];

        if (levelIndex === 0) {
            return level.items.map((item) => ({
                id: item.itemId,
                name: item.itemName,
            }));
        }

        const parentId = selectedValues[levelIndex - 1] || '';
        return level.items
            .filter((item) => item.parentItemId === parentId)
            .map((item) => ({
                id: item.itemId,
                name: item.itemName,
            }));
    };

    return (
        <div className="mb-4">
            <label className="main-label">
                {question.label} {question.required == 'yes' && <span className="text-red-500">*</span>}
            </label>
            {levels.map((level, levelIndex) => (
                <div key={level.levelId} className="my-2">
                    <h3 className="main-label">{level.levelName}</h3>
                    <select
                        value={selectedValues[levelIndex] || ''}
                        onChange={(e) => handleChange(levelIndex, e.target.value)}
                        className="main-select"
                    >
                        <option value="">Select an option</option>
                        {getOptionsForLevel(levelIndex).map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};