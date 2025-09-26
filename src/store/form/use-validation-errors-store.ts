import { create } from 'zustand';

interface ValidationErrorsState {
  validationErrors: Record<string, Record<string, string | null>>;
  setValidationError: (sectionId: string, questionId: string, error: string | null) => void;
  clearValidationErrors: () => void;
  clearSectionErrors: (sectionId: string) => void;
}

export const useValidationErrorsStore = create<ValidationErrorsState>((set) => ({
  validationErrors: {},
  setValidationError: (sectionId: string, questionId: string, error: string | null) =>
    set((state) => ({
      validationErrors: {
        ...state.validationErrors,
        [sectionId]: {
          ...state.validationErrors[sectionId],
          [questionId]: error,
        },
      },
    })),
  clearValidationErrors: () => set({ validationErrors: {} }),
  clearSectionErrors: (sectionId: string) =>
    set((state) => {
      const { [sectionId]: _, ...remainingErrors } = state.validationErrors;
      return { validationErrors: remainingErrors };
    }),
}));
