import { create } from "zustand";
import type { SectionTypes, QuestionTypes, Calculation } from "@/types";

interface FormState {
  formId: string;
  sections: SectionTypes[];
  globalCalculations: Calculation[];
  minimizedQuestions: string[];
  setFormId: (id: string) => void;
  setSections: (sections: SectionTypes[]) => void;
  initializeForm: (initialData?: FormState) => void;
  addSection: (section: SectionTypes, position?: number) => void;
  updateSection: (index: number, section: SectionTypes) => void;
  addQuestionToSection: (sectionIndex: number, question: QuestionTypes) => void;
  removeSection: (index: number) => void;
  removeQuestionFromSection: (
    sectionIndex: number,
    questionIndex: number
  ) => void;
  updateGlobalCalculations: () => void;
  splitSection: (
    sectionIndex: number,
    questionIndex: number,
    newSection: SectionTypes
  ) => void;
  toggleQuestionMinimize: (questionId: string) => void;
  toggleSectionQuestionsMinimize: (sectionIndex: number) => void;
  clearForm: () => void;
  duplicateSection: (sectionIndex: number) => void;
  duplicateQuestion: (sectionIndex: number, questionIndex: number) => void;
}

// Counter for unique IDs within the same millisecond
let idCounter = 0;
const generateUniqueId = (prefix: string) =>
  `${prefix}-${Date.now()}-${idCounter++}`;

export const useFormStore = create<FormState>((set, get) => ({
  formId: "",
  sections: [],
  globalCalculations: [],
  minimizedQuestions: [],
  setFormId: (id) => set((state) => ({ ...state, formId: id })),
  setSections: (sections) => set((state) => ({ ...state, sections })),
  initializeForm: (initialData) =>
    set((state) => ({
      ...state,
      sections: initialData
        ? initialData.sections
        : [
            {
              id: generateUniqueId("section"),
              name: "",
              questions: [],
              nextSectionId: "",
            },
          ],
      globalCalculations: [],
    })),
  addSection: (section, position) =>
    set((state) => {
      const sections = [...state.sections];
      const newSection = { ...section, id: generateUniqueId("section") };
      if (position !== undefined) {
        sections.splice(position, 0, newSection);
      } else {
        sections.push(newSection);
      }
      return { ...state, sections };
    }),
  updateSection: (index, section) =>
    set((state) => {
      const sections = [...state.sections];
      sections[index] = section;
      return { ...state, sections };
    }),
  addQuestionToSection: (sectionIndex, question) =>
    set((state) => {
      const sections = [...state.sections];
      sections[sectionIndex].questions.push({
        ...question,
        id: generateUniqueId("question"),
      });
      return { ...state, sections };
    }),
  removeSection: (index) =>
    set((state) => {
      const sections = state.sections.filter((_, i) => i !== index);
      return { ...state, sections };
    }),
  removeQuestionFromSection: (sectionIndex, questionIndex) =>
    set((state) => {
      const sections = [...state.sections];
      sections[sectionIndex].questions = sections[
        sectionIndex
      ].questions.filter((_, i) => i !== questionIndex);
      return { ...state, sections };
    }),
  updateGlobalCalculations: () => {
    const sections = get().sections;
    const globalCalculations: Calculation[] = [];
    sections.forEach((section) => {
      section.questions.forEach((q) => {
        if (q.calculations) {
          q.calculations.forEach((calc: Calculation) => {
            globalCalculations.push(calc);
          });
        }
      });
    });
    set((state) => ({ ...state, globalCalculations }));
  },
  splitSection: (sectionIndex, questionIndex, newSection) =>
    set((state) => {
      const sections = [...state.sections];
      const currentSection = { ...sections[sectionIndex] };
      const newSectionWithId = {
        ...newSection,
        id: generateUniqueId("section"),
      };
      newSectionWithId.questions =
        currentSection.questions.splice(questionIndex);
      sections.splice(sectionIndex + 1, 0, newSectionWithId);
      return { ...state, sections };
    }),
  toggleQuestionMinimize: (questionId) =>
    set((state) => {
      const isMinimized = state.minimizedQuestions.includes(questionId);
      return {
        ...state,
        minimizedQuestions: isMinimized
          ? state.minimizedQuestions.filter((id) => id !== questionId)
          : [...state.minimizedQuestions, questionId],
      };
    }),
  toggleSectionQuestionsMinimize: (sectionIndex) =>
    set((state) => {
      const section = state.sections[sectionIndex];
      const allSectionQuestionIds = section.questions.map((q) => q.id);
      const allCurrentlyMinimized = allSectionQuestionIds.every((id) =>
        state.minimizedQuestions.includes(id)
      );

      return {
        ...state,
        minimizedQuestions: allCurrentlyMinimized
          ? state.minimizedQuestions.filter(
              (id) => !allSectionQuestionIds.includes(id)
            )
          : Array.from(
              new Set([...state.minimizedQuestions, ...allSectionQuestionIds])
            ),
      };
    }),
  clearForm: () =>
    set(() => ({
      formId: "",
      sections: [],
      globalCalculations: [],
      minimizedQuestions: [],
    })),
  duplicateSection: (sectionIndex) =>
    set((state) => {
      const sections = [...state.sections];
      const sectionToDuplicate = sections[sectionIndex];
      const duplicatedSection: SectionTypes = {
        ...sectionToDuplicate,
        id: generateUniqueId("section"),
        questions: sectionToDuplicate.questions.map((question) => ({
          ...question,
          id: generateUniqueId("question"),
        })),
      };
      sections.splice(sectionIndex + 1, 0, duplicatedSection);
      return { ...state, sections };
    }),
  duplicateQuestion: (sectionIndex, questionIndex) =>
    set((state) => {
      const sections = [...state.sections];
      const section = { ...sections[sectionIndex] };
      const questionToDuplicate = section.questions[questionIndex];
      const duplicatedQuestion: QuestionTypes = {
        ...questionToDuplicate,
        id: generateUniqueId("question"),
      };
      section.questions.splice(questionIndex + 1, 0, duplicatedQuestion);
      sections[sectionIndex] = section;
      return { ...state, sections };
    }),
}));
