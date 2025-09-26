import { User } from "./user.types";

export interface FormInputValues {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface SectionTypes {
  id: string;
  name: string;
  nextSectionId: string;
  questions: QuestionTypes[];
  isLoop?: string;
}

export interface QuestionTypes {
  id: string;
  type: string;
  label?: string;
  value?: string;
  required?: string;
  video?: any;
  titleName?: string;
  urlName?: string;
  descriptionName?: string;
  document?: any;
  image?: any;
  maxCharacters?: number;
  minCharacters?: number;
  decimalOptions?: string;
  numberOfDecimals?: number;
  attributes?: string;
  attributeValue?: number;
  documentType?: string;
  maxFileSize?: number;
  dateType?: "date-only" | "time-only" | "date-time" | "date-range";
  timeType?: "future-only" | "past-only" | "all-time";
  rangeCalculation?:
    | "days"
    | "exclude-weekends"
    | "exclude-specified-days"
    | "exclude-specified-dates-and-weekends";
  dateRange?: { startDate?: string; endDate?: string }
  excludeDays?: (
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
  )[];
  excludedDates?: string[];
  file?: any;
  formData?: FormData;
  dropdownType?: string;
  options?: string[];
  nextSections?: { [key: number]: string };
  numberOfOptions?: number;
  selectOptions?: string;
  urls?: string[];
  hyperlinkType?: 'with-hyperlinks' | 'without-hyperlinks';
  levels?: any[];
  selectedLevelId?: string;
  addToDatabaseId?: string;
  calculations?: any;
  calculationType?: AddCalculationType;
  calculationDropdowns?: any;
  serviceGroups?: any;
  userSelectionType?: 'all-users' | 'specific-roles';
  selectedRoles?: string[];
  maxUserSelections?: number;
  allowMultipleSelections?: boolean;
  countryLevel?: string;
}

type AddCalculationType = "simple" | "withDropdown";

export interface QuestionProps {
  question: QuestionTypes;
  questionIndex: number;
  sectionIndex: number;
  isMinimized: boolean;
}

export interface QuestionItemProps {
  question: QuestionTypes;
  questionIndex: number;
  sectionIndex: number;
  isMinimized: boolean;
}

export interface AnswerItemProps {
  question: QuestionTypes;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (
    sectionId: string,
    questionId: string,
    error: string | null
  ) => void;
}

export interface PublicForm {
  createdAt: string;
  design: any[] | null;
  formName: string;
  status: string;
  type: string;
  updatedAt: string;
  id: string;
}

export type DateRange = {
  startDate?: string;
  endDate?: string;
};

export type Question = {
  id: string;
  type: string;
  label?: string;
  value?: string;
  required?: string;
  video?: any;
  titleName?: string;
  urlName?: string;
  descriptionName?: string;
  document?: any;
  image?: any;
  minCharacters?: number;
  maxCharacters?: number;
  decimalOptions?: string;
  numberOfDecimals?: number;
  attributes?: string;
  attributeValue?: number;
  documentType?: string;
  maxFileSize?: number;
  file?: any;
  dateType?: "date-only" | "time-only" | "date-time" | "date-range";
  timeType?: "all-time" | "future-only" | "past-only";
  rangeCalculation?:
    | "days"
    | "exclude-weekends"
    | "exclude-specified-days"
    | "exclude-specified-dates-and-weekends";
  dateRange?: DateRange;
  excludeDays?: (
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
  )[];
  excludedDates?: string[];
  dropdownType?: string;
  options?: string[];
  nextSections?: Map<string, string>;
  numberOfOptions?: number;
  selectOptions?: string;
  addToDatabaseId?: string;
  selectedLevelId?: string;
  levels?: any;
  calculations?: any;
  calculationType?: any;
  calculationDropdowns?: any;
  serviceGroups?: any;
};

export type Section = {
  id: string;
  name?: string;
  nextSectionId?: string;
  isLoop?: string;
  questions: Question[];
};

export type Form = {
  id: string;
  name: string;
  status: "ENABLED" | "DISABLED";
  type: "PUBLIC" | "PRIVATE";
  createdBy: Partial<User>;
  design: SectionTypes[];
  createdAt: string;
  updatedAt: string;
  folderId?: string;
};

export type FormResponse = {
  userId?: string;
  applicantProcessId?: string;
  processId?: string;
  formId: string;
  responses: any;
  createdAt?: Date;
  formName?: string;
};

export type FormName = {
  name: string;
  status: "ENABLED" | "DISABLED";
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
};
