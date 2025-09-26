import { 
  AddTitleAnswer, 
  AddDescriptionAnswer, 
  AddURLAnswer, 
  AddDocumentAnswer, 
  AddImageAnswer, 
  AddVideoAnswer, 
  EmailAnswer, 
  PhoneNumberAnswer, 
  DateAnswer, 
  DateTimeAnswer, 
  TimeAnswer, 
  DateRangeAnswer, 
  SignatureAnswer, 
  AddCalculationAnswer, 
  AddUsersAnswer, 
  MultipleDropdownAnswer, 
  ParagraphAnswer, 
  NumberAnswer, 
  CheckboxAnswer, 
  DropdownAnswer, 
  UploadAnswer, 
  ShortTextAnswer 
} from '../form-answer';
import React from 'react';
import type { QuestionTypes } from '@/types';
import { useTranslation } from 'react-i18next';
import CountriesAnswer from '../form-answer/countries-answer';

interface QuestionPreviewProps {
  question: QuestionTypes;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
  onDropdownChange: (questionId: string, selectedOptionIndex: number) => void;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  sectionId,
  sectionName,
  setValidationErrors,
  onDropdownChange,
}) => {
  const { t } = useTranslation();
  const createComponentProps = (Component: React.ComponentType<any>) => {
    const baseProps = {
      question,
      sectionId,
      sectionName,
      setValidationErrors,
    };

    // Special handling for components that need additional props
    if (Component === DropdownAnswer) {
      return { ...baseProps, onChange: onDropdownChange };
    }

    return baseProps;
  };

  const COMPONENTS_MAP: Record<string, React.ComponentType<any>> = {
    'Add Title': AddTitleAnswer,
    'Add Description': AddDescriptionAnswer,
    'Add URL': AddURLAnswer,
    'Add Document': AddDocumentAnswer,
    'Add Image': AddImageAnswer,
    'Add Video': AddVideoAnswer,
    'Short Text': ShortTextAnswer,
    'Email': EmailAnswer,
    'Phone Number': PhoneNumberAnswer,
    'Paragraph': ParagraphAnswer,
    'Date': DateAnswer,
    'DateTime': DateTimeAnswer,
    'Time': TimeAnswer,
    'Date Range': DateRangeAnswer,
    'Number': NumberAnswer,
    'Checkbox': CheckboxAnswer,
    'Dropdown': DropdownAnswer,
    'Upload': UploadAnswer,
    'Signature': SignatureAnswer,
    'Add Calculation': AddCalculationAnswer,
    'Add Users': AddUsersAnswer,
    'From Database': MultipleDropdownAnswer,
    'Add To Database': MultipleDropdownAnswer,
    'Countries': CountriesAnswer,
  };

  const Component = COMPONENTS_MAP[question.type];

  if (!Component) {
    return <p>{t('questionDesign.unknownQuestionType', { type: question.type })}</p>;
  }

  const componentProps = createComponentProps(Component);

  return (
    <div className="mb-4 h-full">
      <Component {...componentProps} />
    </div>
  );
};

export default QuestionPreview;