import {
  AddCalculationQuestion,
  AddDescriptionQuestion,
  AddDocumentQuestion,
  AddImageQuestion,
  AddTitleQuestion,
  AddToDatabaseQuestion,
  AddUrlQuestion,
  AddUsersQuestion,
  AddVideoQuestion,
  CheckboxQuestion,
  DateQuestion,
  DateRangeQuestion,
  DateTimeQuestion,
  DropDownQuestion,
  EmailQuestion,
  NumberQuestion,
  ParagraphQuestion,
  PhoneNumberQuestion,
  ShortTextQuestion,
  SignatureQuestion,
  TimeQuestion,
  UploadQuestion,
} from "./questions";
import React from "react";
import type { QuestionProps } from "@/types";
import CountriesQuestion from "./countries-question";

const COMPONENTS_MAP: Record<string, React.FC<any>> = {
  "Add Title": AddTitleQuestion,
  "Add Description": AddDescriptionQuestion,
  "Add URL": AddUrlQuestion,
  "Add Document": AddDocumentQuestion,
  "Add Image": AddImageQuestion,
  "Add Video": AddVideoQuestion,
  "Short Text": ShortTextQuestion,
  "Email": EmailQuestion,
  "Phone Number": PhoneNumberQuestion,
  "Paragraph": ParagraphQuestion,
  "Dropdown": DropDownQuestion,
  "Number": NumberQuestion,
  "Checkbox": CheckboxQuestion,
  "Upload": UploadQuestion,
  "Date": DateQuestion,
  "DateTime": DateTimeQuestion,
  "Date Range": DateRangeQuestion,
  "Time": TimeQuestion,
  "Signature": SignatureQuestion,
  "Add Calculation": AddCalculationQuestion,
  "Add Users": AddUsersQuestion,
  "From Database": AddToDatabaseQuestion,
  "Countries": CountriesQuestion,
};

const Question: React.FC<QuestionProps> = ({
  questionIndex,
  question,
  sectionIndex,
  isMinimized,
}) => {
  const Component = COMPONENTS_MAP[question.type];
  return (
    <div className="mb-4">
      {Component ? (
        <Component
          question={question}
          sectionIndex={sectionIndex}
          questionIndex={questionIndex}
          isMinimized={isMinimized}
          key={question.id}
        />
      ) : null}
    </div>
  );
};

export default Question;
