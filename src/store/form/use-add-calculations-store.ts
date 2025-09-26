import { create } from 'zustand';

interface Calculation {
  name: string;
  formula: string;
}

interface FormState {
  calculations: Calculation[];
  addCalculation: () => void; // No parameters needed
  updateCalculation: (index: number, calculation: Calculation) => void;
  removeCalculation: (index: number) => void;
}

export const useAddCalculationsStore = create<FormState>((set) => ({
  calculations: [],
  
  // Add a new empty calculation
  addCalculation: () => set((state) => ({
    calculations: [...state.calculations, { name: '', formula: '' }],
  })),
  
  updateCalculation: (index, calculation) => set((state) => {
    const calculations = [...state.calculations];
    calculations[index] = calculation;
    return { calculations };
  }),

  removeCalculation: (index) => set((state) => {
    const calculations = state.calculations.filter((_, i) => i !== index);
    return { calculations };
  }),
}));
