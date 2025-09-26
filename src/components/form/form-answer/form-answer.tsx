import { toast } from "sonner";
import type { QuestionTypes } from "@/types";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useMemo } from "react";
import QuestionPreview from "../form-design/question-preview";
import { useFormStore, useValidationErrorsStore } from "@/store";

interface FormAnswerProps {
  setCurrentFormSectionId: React.Dispatch<React.SetStateAction<string | null>>;
}

const FormAnswer: React.FC<FormAnswerProps> = ({
  setCurrentFormSectionId,
}) => {
  const { t } = useTranslation();
  const { sections } = useFormStore();
  const { validationErrors, setValidationError } = useValidationErrorsStore();
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { id: string; nextSectionId: string | null }[]
  >([]);
  const [nextSectionId, setNextSectionId] = useState<string | null>(null);
  const [responseLevels, setResponseLevels] = useState<
    { level: number; questions: QuestionTypes[] }[]
  >([]);

  // Derive currentSection from sections and currentSectionId
  const currentSection = useMemo(() => {
    return sections?.find((section) => section.id === currentSectionId);
  }, [sections, currentSectionId]);

  // Initialize or reset current section when sections change
  useEffect(() => {
    if (sections && sections.length > 0) {
      if (!currentSectionId) {
        const firstSectionId = sections[0].id;
        setCurrentSectionId(firstSectionId);
        setCurrentFormSectionId(firstSectionId);
      } else if (!sections.some((s) => s.id === currentSectionId)) {
        const firstSectionId = sections[0].id;
        setCurrentSectionId(firstSectionId);
        setCurrentFormSectionId(firstSectionId);
        setHistory([]);
      }
    }
  }, [sections, currentSectionId]);

  // Initialize the first level of responses when the section is loaded
  useEffect(() => {
    if (currentSection?.isLoop === "yes" && responseLevels.length === 0) {
      setResponseLevels([{ level: 1, questions: currentSection.questions }]);
    }
  }, [currentSection, responseLevels.length]);

  const handleNextSection = () => {
    const currentSectionErrors = validationErrors[currentSectionId || ""] || {};
    const nonNullErrors = Object.values(currentSectionErrors).filter(
      (error) => error !== null
    );

    if (nonNullErrors.length > 0) {
      toast.error(nonNullErrors[0] as string);
      return;
    }

    // Add current section and nextSectionId to history before navigating
    if (currentSectionId) {
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          id: currentSectionId,
          nextSectionId: nextSectionId || currentSection?.nextSectionId || null,
        },
      ]);
    }

    // Priority 1: Explicit next section from dropdown
    if (nextSectionId) {
      setCurrentSectionId(nextSectionId);
      setCurrentFormSectionId(nextSectionId);
      setNextSectionId(null);
      return;
    }

    // Priority 2: Section's default next section
    if (currentSection?.nextSectionId) {
      setCurrentSectionId(currentSection.nextSectionId);
      setCurrentFormSectionId(currentSection.nextSectionId);
      return;
    }
  };

  const handlePreviousSection = () => {
    if (history.length > 0) {
      const lastHistoryItem = history[history.length - 1];
      setCurrentSectionId(lastHistoryItem.id);
      setCurrentFormSectionId(lastHistoryItem.id);

      // Restore the nextSectionId that was set when we left this section
      setNextSectionId(lastHistoryItem.nextSectionId);

      setHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  };

  const handleSetValidationErrors = (
    sectionId: string,
    questionId: string,
    error: string | null
  ) => {
    setValidationError(sectionId, questionId, error);
  };

  const handleDropdownChange = (
    questionId: string,
    selectedOptionIndex: number
  ) => {
    const dropdownQuestion = currentSection?.questions.find(
      (q) => q.id === questionId
    );

    if (dropdownQuestion && dropdownQuestion.nextSections) {
      const nextSections = dropdownQuestion.nextSections as Record<
        string,
        string
      >;
      const nextSectionId = nextSections[selectedOptionIndex.toString()];

      if (nextSectionId) {
        setNextSectionId(nextSectionId);
      } else {
        // Clear nextSectionId if no valid selection
        setNextSectionId(null);
      }
    }
  };

  const handleAddAnotherResponse = (e: React.MouseEvent) => {
    e.preventDefault();

    const currentSectionErrors = validationErrors[currentSectionId || ""] || {};
    const nonNullErrors = Object.values(currentSectionErrors).filter(
      (error) => error !== null
    );

    if (nonNullErrors.length > 0) {
      toast.error(nonNullErrors[0] as string);
      return;
    }

    if (currentSection) {
      const newLevel = responseLevels.length + 1;
      const newQuestions = currentSection?.questions?.map((question) => ({
        ...question,
        id: `${question.id}-level-${newLevel}`,
      }));

      setResponseLevels((prevLevels) => [
        ...prevLevels,
        { level: newLevel, questions: newQuestions },
      ]);
    }
  };

  const isLoading = sections?.length === 0 || !currentSection;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="overflow-x-hidden flex-1">
      {currentSection ? (
        <div key={currentSection.id} className="mb-4 md:p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#001A55]">
            {currentSection.name ||
              `Section ${
                sections && sections.length > 0 ? sections.findIndex((s) => s.id === currentSectionId) + 1 : 1
              }`}
          </h2>
          {currentSection.isLoop == "yes"
            ? responseLevels.map((responseLevel) => (
                <div key={responseLevel.level} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Response {responseLevel.level}
                  </h3>
                  {responseLevel.questions.map((question) => (
                    <QuestionPreview
                      key={question.id}
                      question={question}
                      sectionId={currentSection.id}
                      sectionName={
                        currentSection.name ||
                        `Section ${
                          sections && sections.length > 0 ? sections.findIndex((s) => s.id === currentSectionId) + 1 : 1
                        }`
                      }
                      setValidationErrors={handleSetValidationErrors}
                      onDropdownChange={handleDropdownChange}
                    />
                  ))}
                </div>
              ))
            : currentSection.questions.map((question) => (
                <QuestionPreview
                  key={question.id}
                  question={question}
                  sectionId={currentSection.id}
                  sectionName={
                    currentSection.name ||
                    `${t('common.section')} ${
                      sections && sections.length > 0 ? sections.findIndex((s) => s.id === currentSectionId) + 1 : 1
                    }`
                  }
                  setValidationErrors={handleSetValidationErrors}
                  onDropdownChange={handleDropdownChange}
                />
              ))}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 mt-4">
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handlePreviousSection}
                  className="px-4 py-2 bg-blue-900 text-white rounded"
                >
                  {t('common.back')}
                </button>
              )}
              {sections && sections.length > 0 && sections.findIndex(
                (section) => section.id === currentSectionId
              ) <
                sections.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextSection}
                    className="main-dark-button text-sm"
                  >
                    {t('forms.nextSection')}
                  </button>
                )}
            </div>
            {currentSection.isLoop === "yes" && (
              <div>
                <button
                  type="button"
                  className="main-dark-button text-sm"
                  onClick={handleAddAnotherResponse}
                >
                  {t('forms.addAnotherResponse')}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>{t('forms.noSectionsToPreview')}</p>
      )}
    </div>
  );
};

export default FormAnswer;
