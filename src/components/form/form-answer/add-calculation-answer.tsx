import isEqual from 'lodash/isEqual';
import { useTranslation } from 'react-i18next';
import { useFormResponseStore } from '@/store';
import CustomInput from '@/components/custom-input';
import React, { useEffect, useState, useCallback } from 'react';
import type { Calculation, QuestionTypes, CalculationResult } from '@/types';

interface ExtendedCalculation extends Calculation {
  inputType: 'userInput' | 'calculation';
  required?: boolean;
}

interface AddCalculationAnswerProps {
  question: QuestionTypes;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const AddCalculationAnswer: React.FC<AddCalculationAnswerProps> = ({
  question,
  sectionId,
  sectionName,
  setValidationErrors,
}) => {
  const { t } = useTranslation();
  const { setResponse, setGlobalCalculations, globalCalculations, formResponses } =
    useFormResponseStore();

  // Initialize state from stored response, if available
  const storedResponse = formResponses
    [sectionId]?.questions[question.id];

  const initialUserInputs = storedResponse?.response?.userInputs || {};
  const initialSelectedDropdown = storedResponse?.response?.selectedDropdown || null;
  const initialCalculations = storedResponse?.response?.calculations || [];

  const [userInputs, setUserInputs] = useState<{ [key: string]: number | null }>(
    initialUserInputs
  );
  const [selectedDropdown, setSelectedDropdown] = useState<{
    name: string;
    value: number | string;
  } | null>(initialSelectedDropdown);
  const [calculations, setCalculations] = useState<CalculationResult[]>(initialCalculations);
  const [dropdownOptions, setDropdownOptions] = useState<
    { name: string; value: number | string }[]
  >([]);

  // Validation effect
  useEffect(() => {
    const requiredUserInputs =
      (question.calculations as ExtendedCalculation[])?.filter(
        (calc) => calc.inputType === 'userInput' && calc.required
      ) || [];

    const hasMissingInputs = requiredUserInputs.some(
      (calc) => userInputs[calc.formulaName] === null
    );

    if (hasMissingInputs) {
      setValidationErrors(
        sectionId,
        question.id,
        `${question.label} ${t('forms.requiresAllMandatoryInputs')}`
      );
    } else {
      setValidationErrors(sectionId, question.id, null);
    }
  }, [userInputs, selectedDropdown, question]);

  const handleUserInputChange = useCallback(
    (formulaName: string) =>
      debounce((value: string) => {
        const numValue = parseFloat(value.replace(/,/g, ''));
        setUserInputs((prev) => ({
          ...prev,
          [formulaName]: isNaN(numValue) ? null : numValue,
        }));
      }, 0),
    []
  );

  const handleDropdownChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      const selectedOption = dropdownOptions.find((option) => option.value === selectedValue);
      setSelectedDropdown(selectedOption || null);
    },
    [dropdownOptions]
  );

  const formatNumberWithCommas = (number: number): string => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const calculateResults = useCallback(() => {
    if (!question.calculations) return;

    const results: CalculationResult[] = [];
    const resolvedCalculations = new Map<string, number>();

    const calculateFormula = (formula: string, formulaName: string): number => {
      formula = formula.replace(/\b[a-zA-Z]+\b/g, (match) => {
        if (match in userInputs) {
          return String(userInputs[match] || 0);
        }
        const calc = globalCalculations.find((calc) => calc.formulaName === match);
        if (resolvedCalculations.has(match)) {
          return String(resolvedCalculations.get(match));
        } else if (calc) {
          return String(calc.result || 0);
        } else {
          return String(selectedDropdown?.value || 0);
        }
      });
      try {
        return eval(formula); // Consider replacing with math.js for safety
      } catch (error) {
        console.error(`Error evaluating formula ${formulaName}:`, error);
        return 0;
      }
    };

    let unresolvedCalculations = [...question.calculations] as ExtendedCalculation[];

    while (unresolvedCalculations.length > 0) {
      const newlyResolved: string[] = [];

      unresolvedCalculations.forEach((calculation) => {
        if (calculation.inputType === 'userInput') {
          results.push({
            name: calculation.name,
            formulaName: calculation.formulaName,
            result: userInputs[calculation.formulaName] || 0,
          });
          resolvedCalculations.set(
            calculation.formulaName,
            userInputs[calculation.formulaName] || 0
          );
          newlyResolved.push(calculation.formulaName);
        } else {
          try {
            const formula = calculation.formula;
            const result = calculateFormula(formula, calculation.formulaName);
            results.push({
              name: calculation.name,
              formulaName: calculation.formulaName,
              result,
            });
            resolvedCalculations.set(calculation.formulaName, result);
            newlyResolved.push(calculation.formulaName);
          } catch (error) {
            console.error(`Error evaluating formula for ${calculation.formulaName}:`, error);
          }
        }
      });

      if (newlyResolved.length === 0) {
        console.error('Circular dependency detected or unresolved variables.');
        break;
      }
      unresolvedCalculations = unresolvedCalculations.filter(
        (calc) => !newlyResolved.includes(calc.formulaName)
      );
    }

    // Only update state if results have changed
    if (!isEqual(results, calculations)) {
      setCalculations(results);
    }

    const updatedGlobalCalculations = [...globalCalculations];
    results.forEach((newCalc) => {
      const existingIndex = updatedGlobalCalculations.findIndex(
        (calc) => calc.formulaName === newCalc.formulaName
      );
      if (existingIndex !== -1) {
        updatedGlobalCalculations[existingIndex] = newCalc;
      } else {
        updatedGlobalCalculations.push(newCalc);
      }
    });

    // Only update global calculations if they have changed
    if (!isEqual(updatedGlobalCalculations, globalCalculations)) {
      setGlobalCalculations(updatedGlobalCalculations);
    }

    const response = {
      userInputs,
      selectedDropdown,
      calculations: results,
    };

    // Update response in store
    setResponse(
      sectionId,
      sectionName,
      question.id,
      question.type,
      question.label as string,
      response
    );
  }, [
    question.calculations,
    userInputs,
    selectedDropdown,
    globalCalculations,
    calculations,
    sectionId,
    sectionName,
    question.id,
    question.type,
    question.label,
    setResponse,
    setGlobalCalculations,
  ]);

  // Initialize dropdown options
  useEffect(() => {
    if (question.calculationType === 'withDropdown' && question.calculationDropdowns) {
      setDropdownOptions(question.calculationDropdowns);
    }
  }, [question.calculationType, question.calculationDropdowns]);

  // Trigger calculations when inputs or dropdown change
  useEffect(() => {
    calculateResults();
  }, [userInputs, selectedDropdown, calculateResults]);

  return (
    <div className="mb-6">
      <label className="main-label">
        {question.label}
      </label>
      <div className="space-y-4">
        {question.calculationType === 'simple' ? (
          <div className="space-y-4">
            {(question.calculations as ExtendedCalculation[])?.map((calc, index) => (
              calc.inputType === 'userInput' && (
                <div key={index} className="flex items-center space-x-4">
                  <label className="w-1/4 main-label">{calc.name}</label>
                  <div className="flex-1">
                    <CustomInput
                      maxLength={question.maxCharacters}
                      containerStyles="!rounded"
                      inputStyles="!h-[48px] w-full"
                      required={calc.required}
                      type="text"
                      placeholder={`Enter ${calc.name}`}
                      value={
                        userInputs[calc.formulaName] !== null && userInputs[calc.formulaName] !== undefined
                          ? formatNumberWithCommas(userInputs[calc.formulaName]!)
                          : ''
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUserInputChange(calc.formulaName)(e.target.value)}
                    />
                  </div>
                  {calc.required && <span className="text-red-500">*</span>}
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <label className="w-1/4 main-label">Select Option</label>
            <select
              className="flex-1 h-[48px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDropdown?.value || ''}
              onChange={handleDropdownChange}
            >
              <option value="">Select an option</option>
              {dropdownOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.name} (
                  {typeof option.value === 'number'
                    ? formatNumberWithCommas(option.value)
                    : option.value}
                  )
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {calculations
        .filter((calc) =>
          question.calculations!.find(
            (qCalc: ExtendedCalculation) =>
              qCalc.formulaName === calc.formulaName &&
              qCalc.inputType === 'calculation' &&
              qCalc.visibility
          )
        )
        .length > 0 && (
        <div className="mt-6">
          <div className="space-y-4">
            {calculations
              .filter((calc) =>
                question.calculations!.find(
                  (qCalc: ExtendedCalculation) =>
                    qCalc.formulaName === calc.formulaName &&
                    qCalc.inputType === 'calculation' &&
                    qCalc.visibility
                )
              )
              .map((calc: CalculationResult, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <label className="w-1/4 main-label">{calc.name}</label>
                  <div className="flex-1">
                    {isNaN(calc.result) ? (
                      <span className="text-red-500">Error</span>
                    ) : (
                      <CustomInput
                        maxLength={question.maxCharacters}
                        containerStyles="!rounded"
                        inputStyles="!h-[48px] w-full"
                        type="text"
                        value={formatNumberWithCommas(calc.result)}
                        disabled
                        placeholder=""
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};