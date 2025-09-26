import { create } from 'zustand';
import type { ProcessFormTypes } from '@/types';

interface FormState {
  processId: string;
  forms: ProcessFormTypes[];
  staffViewForms: string;
  applicantViewProcessLevel: string;
  setProcessId: (id: string) => void;
  setForms: (forms: ProcessFormTypes[]) => void;
  setStaffViewForms: (value: string) => void;
  setApplicantViewProcessLevel: (value: string) => void;
  addFormAtIndex: (index: number, form: ProcessFormTypes) => void;
  removeForm: (index: number) => void;
  updateForm: (index: number, form: ProcessFormTypes) => void;
  checkDuplicateForm: (formId: string) => boolean;
  resetProcessDesignState: () => void;
  updateFormField: (index: number, field: keyof ProcessFormTypes, value: any) => void;
  moveFormUp: (index: number) => void;
  moveFormDown: (index: number) => void;
}

export const ProcessDesignStore = create<FormState>((set, get) => ({
  processId: '',
  forms: [],
  staffViewForms: '',
  applicantViewProcessLevel: '',
  setProcessId: (id) => set((state) => ({ ...state, processId: id })),
  setForms: (forms) => set((state) => ({ ...state, forms })),
  setStaffViewForms: (value) => set((state) => ({ ...state, staffViewForms: value })),
  setApplicantViewProcessLevel: (value) => set((state) => ({ ...state, applicantViewProcessLevel: value })),
  addFormAtIndex: (index, form) => {
    const state = get();
    if (state.forms.some(existingForm => existingForm.formId === form.formId)) {
      return;
    }
    const newForms = [...state.forms];
    newForms.splice(index, 0, form);
    set({ forms: newForms });
  },
  removeForm: (index) => set((state) => {
    const newForms = [...state.forms];
    newForms.splice(index, 1);
    return { forms: newForms };
  }),
  updateForm: (index, form) => set((state) => {
    const newForms = [...state.forms];
    newForms[index] = form;
    return { forms: newForms };
  }),
  checkDuplicateForm: (formId: string) => {
    const state = get();
    return state.forms.some(existingForm => existingForm.formId === formId);
  },
  resetProcessDesignState: () => set(() => ({
    processId: '',
    forms: [],
    staffViewForms: '',
    applicantViewProcessLevel: ''

  })),
  updateFormField: (index, field, value) => set((state) => {
    const updatedForms = [...state.forms];
    const formToUpdate = { ...updatedForms[index], [field]: value };
    updatedForms[index] = formToUpdate;
    return { forms: updatedForms };
  }),
  moveFormUp: (index) => set((state) => {
    if (index <= 0) return state;
    const newForms = [...state.forms];
    [newForms[index - 1], newForms[index]] = [newForms[index], newForms[index - 1]];
    return { forms: newForms };
  }),
  moveFormDown: (index) => set((state) => {
    if (index >= state.forms.length - 1) return state;
    const newForms = [...state.forms];
    [newForms[index], newForms[index + 1]] = [newForms[index + 1], newForms[index]];
    return { forms: newForms };
  })
}));