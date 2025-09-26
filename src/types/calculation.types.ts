export interface Calculation {
  name: string;
  formulaName: string;
  formula: string;
  visibility: boolean;
}

export interface CalculationResult {
  name: string;
  formulaName: string;
  result: number;
}
