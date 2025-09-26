import { create } from 'zustand';
import type { CalculationResult } from '@/types';

interface Answer {
  questionId: string;
  questionType: string;
  label: string;
  response: any;
}

interface SectionAnswers {
  sectionId: string;
  sectionName: string;
  questions: Record<string, Answer>;
}

interface FormResponseState {
  formResponses: Record<string, SectionAnswers>;
  globalCalculations: CalculationResult[];
  setResponse: (
    sectionId: string,
    sectionName: string,
    questionId: string,
    questionType: string,
    label: string,
    response: any
  ) => void;
  setGlobalCalculations: (calculations: CalculationResult[]) => void;
  resetResponses: () => void;
  resetSectionResponses: (sectionId: string) => void;
  clearFormResponses: () => void;
}

export const useFormResponseStore = create<FormResponseState>((set) => ({
  formResponses: {},
  globalCalculations: [],

  setResponse: (sectionId, sectionName, questionId, questionType, label, response) =>
    set((state) => {
      const updatedFormResponses = { ...state.formResponses };

      if (updatedFormResponses[sectionId]) {
        // Section exists, update the question
        updatedFormResponses[sectionId] = {
          ...updatedFormResponses[sectionId],
          questions: {
            ...updatedFormResponses[sectionId].questions,
            [questionId]: { questionId, questionType, label, response }
          }
        };
      } else {
        // Section doesn't exist, create it
        updatedFormResponses[sectionId] = {
          sectionId,
          sectionName,
          questions: {
            [questionId]: { questionId, questionType, label, response }
          }
        };
      }

      return { formResponses: updatedFormResponses };
    }),

  setGlobalCalculations: (calculations) => set({ globalCalculations: calculations }),

  resetResponses: () => set({ formResponses: {} }),

  resetSectionResponses: (sectionId) =>
    set((state) => {
      const updatedFormResponses = { ...state.formResponses };
      if (updatedFormResponses[sectionId]) {
        updatedFormResponses[sectionId] = {
          ...updatedFormResponses[sectionId],
          questions: {}
        };
      }
      return { formResponses: updatedFormResponses };
    }),

  clearFormResponses: () => set(() => ({
    formResponses: {},
    globalCalculations: [],
  }))
}));