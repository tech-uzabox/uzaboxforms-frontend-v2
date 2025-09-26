import React from 'react';
import AddItem from './add-item';
import Question from './Question';
import { Icon } from '@iconify/react';
import SearchSection from './search-section';
import { useTranslation } from 'react-i18next';
import { questionOptions } from '@/utils/constants';
import type { QuestionTypes, SectionTypes } from '@/types';
import { useFormStore } from '@/store/form-design/form-store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

let idCounter = 0;
const generateUniqueId = (prefix: string) => `${prefix}-${Date.now()}-${idCounter++}`;

interface SectionProps {
  sectionIndex: number;
  section: SectionTypes;
  totalSections: number;
}

const Section: React.FC<SectionProps> = ({ sectionIndex, section, totalSections }) => {
  const { t } = useTranslation();
  const {
    updateSection,
    addSection,
    sections,
    removeSection,
    removeQuestionFromSection,
    toggleQuestionMinimize,
    toggleSectionQuestionsMinimize,
    minimizedQuestions,
    duplicateSection,
    duplicateQuestion,
  } = useFormStore();

  // Handle adding a question or section after a specific question
  const handleAddDocumentFromQuestion = (type: string, questionIndex: number) => {
    if (type === 'Add Section') {
      handleAddSectionFromQuestion(questionIndex);
    } else {
      const newQuestion: QuestionTypes = { id: generateUniqueId('question'), type };
      const updatedQuestions = [...section.questions];
      updatedQuestions.splice(questionIndex + 1, 0, newQuestion);
      updateSection(sectionIndex, { ...section, questions: updatedQuestions });
    }
  };

  // Split current section and create a new one after a specific question
  const handleAddSectionFromQuestion = (questionIndex: number) => {
    const newSection: SectionTypes = {
      id: generateUniqueId('section'),
      name: '',
      questions: section.questions.slice(questionIndex + 1),
      nextSectionId: '',
    };
    const updatedCurrentSection = {
      ...section,
      questions: section.questions.slice(0, questionIndex + 1),
    };
    updateSection(sectionIndex, updatedCurrentSection);
    addSection(newSection, sectionIndex + 1);
  };

  // Handle adding a question or section at the start of the current section
  const handleAddDocumentFromSection = (type: string) => {
    if (type === 'Add Section') {
      handleAddSectionFromSection();
    } else {
      const newQuestion: QuestionTypes = { id: generateUniqueId('question'), type };
      const updatedQuestions = [newQuestion, ...section.questions];
      updateSection(sectionIndex, { ...section, questions: updatedQuestions });
    }
  };

  // Create a new empty section after the current one
  const handleAddSectionFromSection = () => {
    const newSection: SectionTypes = {
      id: generateUniqueId('section'),
      name: "",
      questions: [...section.questions],
      nextSectionId: "",
      isLoop: "",
    };
    updateSection(sectionIndex, { ...section, questions: [] });
    addSection(newSection, sectionIndex + 1);
  };

  // Update the next section ID
  const handleSelectNextSection = (value: string) => {
    updateSection(sectionIndex, { ...section, nextSectionId: value });
  };

  // Remove the current section
  const handleRemoveSection = () => {
    removeSection(sectionIndex);
  };

  // Remove a specific question from the section
  const handleRemoveQuestion = (questionIndex: number) => {
    removeQuestionFromSection(sectionIndex, questionIndex);
  };

  // Duplicate the current section
  const handleDuplicateSection = () => {
    duplicateSection(sectionIndex);
  };

  // Duplicate a specific question
  const handleDuplicateQuestion = (questionIndex: number) => {
    duplicateQuestion(sectionIndex, questionIndex);
  };

  // Generate options for next section dropdown, excluding current and previous sections
  const sectionOptions = sections
    .map((sec, i) => ({
      title: `Section ${i + 1} (${sec.name || 'Untitled'})`,
      value: sec.id,
    }))
    .filter((_, i) => i > sectionIndex);

  // Check if all questions in the section are minimized
  const isSectionMinimized =
    section.questions.length > 0 &&
    section.questions.every((q) => minimizedQuestions.includes(q.id));

  return (
    <div className="mb-4 rounded-lg max-w-screen-md mx-auto">
      <div className="space-y-3 bg-white border-l-[2.4px] border-white focus-within:border-darkBlue rounded-md p-3">
        <div className="p-4 flex justify-between items-center rounded-[4px] bg-[#001A55] text-white gap-2">
          <h2 className="text-base font-medium pl-[1px] flex-1">
            Section {sectionIndex + 1} out of {totalSections}
          </h2>
          {section.questions.length > 0 && (
            <button
              type="button"
              onClick={() => toggleSectionQuestionsMinimize(sectionIndex)}
              className="text-white text-sm flex items-center gap-1"
            >
              <Icon icon={isSectionMinimized ? 'mdi:chevron-down' : 'mdi:chevron-up'} />
              {isSectionMinimized ? t('questionDesign.expandAll') : t('questionDesign.collapseAll')}
            </button>
          )}
          <div className="flex items-center gap-2">
            {sections.length > 1 && (
              <button type="button" onClick={handleRemoveSection} className="text-white text-2xl">
                <Icon icon="ic:outline-delete" />
              </button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="text-white text-2xl">
                  <Icon icon="mdi:dots-vertical" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={handleDuplicateSection}>
                  <Icon icon="ic:baseline-content-copy" className="mr-2 h-4 w-4" />
                  {t('questionDesign.duplicate')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div>
          <label htmlFor="section-name" className="main-label">
            {t('questionDesign.sectionName')}
          </label>
          <input
            placeholder={t('questionDesign.sectionName')}
            value={section.name}
            onChange={(e) =>
              updateSection(sectionIndex, { ...section, name: e.target.value })
            }
            id="section-name"
            className="main-input"
          />
        </div>
        <div className="flex gap-x-4">
          <div className="w-1/2">
            <label htmlFor="next-section" className="main-label">
              {t('questionDesign.nextSection')}
            </label>
            <div className="mt-1">
              <SearchSection
                options={sectionOptions}
                onSelect={handleSelectNextSection}
                value={section.nextSectionId}
              />
            </div>
          </div>
          <div className="w-1/2">
            <label htmlFor="loop-section" className="main-label">
              {t('questionDesign.loopSection')}
            </label>
            <select
              id="loop-section"
              value={section.isLoop || 'no'}
              onChange={(e) =>
                updateSection(sectionIndex, { ...section, isLoop: e.target.value })
              }
              className="main-input mt-1"
            >
              <option value="no">{t('questionDesign.no')}</option>
              <option value="yes">{t('questionDesign.yes')}</option>
            </select>
          </div>
        </div>
        <div>
          <AddItem
            options={questionOptions}
            onSelect={(type) => handleAddDocumentFromSection(type)}
          />
        </div>
      </div>
      <div className="py-4 space-y-6">
        {section.questions.map((question, i) => (
          <div
            className="p-3 bg-white border-l-[2.4px] border-white focus-within:border-darkBlue rounded-md"
            key={question.id}
          >
            <div className="w-full mb-4">
              <div className="flex justify-between p-3 mb-4 rounded bg-subprimary">
                <h3 className="text-[#012473]">{question.type}</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleQuestionMinimize(question.id)}
                    className="text-[#012473]"
                  >
                    <Icon
                      icon={
                        minimizedQuestions.includes(question.id)
                          ? 'mdi:chevron-down'
                          : 'mdi:chevron-up'
                      }
                    />
                  </button>
                  <button type="button" onClick={() => handleRemoveQuestion(i)}>
                    <Icon icon="mdi:bin" fontSize={20} color="#FF7C72" />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="text-[#012473] text-2xl">
                        <Icon icon="mdi:dots-vertical" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem onClick={() => handleDuplicateQuestion(i)}>
                        <Icon icon="ic:baseline-content-copy" className="mr-2 h-4 w-4" />
                        {t('questionDesign.duplicate')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Question
                sectionIndex={sectionIndex}
                questionIndex={i}
                question={question}
                isMinimized={minimizedQuestions.includes(question.id)}
              />
            </div>
            <AddItem
              options={questionOptions}
              onSelect={(type) => handleAddDocumentFromQuestion(type, i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;