import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,  
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Icon } from "@iconify/react";
import { useFormStore } from "@/store";
import type { Calculation } from "@/types";
import type { QuestionProps } from "@/types";
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';

interface ExtendedCalculation extends Calculation {
  inputType: "userInput" | "calculation";
  required?: boolean;
}

export const AddCalculationQuestion: React.FC<QuestionProps> = ({
  question,
  questionIndex,
  sectionIndex,
  isMinimized,
}) => {
  const { t } = useTranslation();
  const {
    sections,
    updateSection,
    globalCalculations,
    updateGlobalCalculations,
  } = useFormStore();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [currentFormulaIndex, setCurrentFormulaIndex] = useState<number | null>(
    null
  );
  const [dropdownOptions, setDropdownOptions] = useState<
    Array<{ name: string; value: string | number }>
  >(question.calculationDropdowns || []);

  useEffect(() => {
    const availableVariables =
      question.calculationType === "simple"
        ? globalCalculations.map((calc) => calc.formulaName)
        : [
            "selectedInput",
            ...globalCalculations.map((calc) => calc.formulaName),
          ];
    setSuggestions(availableVariables);
  }, [globalCalculations, question.calculationType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedQuestion = { ...question, [name]: value };
    updateStore(updatedQuestion);
  };

  const handleFormulaChange = (index: number, value: string) => {
    // Detect '@' at the end of the input or after a space
    const shouldShowSuggestions = value.endsWith("@") || value.includes(" @");
    setOpenPopover(shouldShowSuggestions);
    setCurrentFormulaIndex(shouldShowSuggestions ? index : null);
    handleCalculationChange(index, "formula", value);
  };

  const handleAddCalculation = () => {
    const newCalculation: ExtendedCalculation = {
      name: "",
      formula: "",
      formulaName: "",
      visibility: true,
      inputType: "userInput",
    };
    const updatedCalculations = [
      ...(question.calculations || []),
      newCalculation,
    ];
    const updatedQuestion = { ...question, calculations: updatedCalculations };
    updateStore(updatedQuestion);
    updateGlobalCalculations();
  };

  const handleCalculationChange = (
    index: number,
    field: keyof ExtendedCalculation,
    value: string | boolean
  ) => {
    const updatedCalculations = [
      ...(question.calculations || []),
    ] as ExtendedCalculation[];
    updatedCalculations[index] = {
      ...updatedCalculations[index],
      [field]: value,
    };

    if (field === "name") {
      updatedCalculations[index].formulaName = (value as string).replace(
        /\s+/g,
        ""
      );
    }

    const updatedQuestion = { ...question, calculations: updatedCalculations };
    updateStore(updatedQuestion);
    updateGlobalCalculations();
  };

  const handleRemoveCalculation = (index: number) => {
    const updatedCalculations = [...(question.calculations || [])];
    updatedCalculations.splice(index, 1);
    const updatedQuestion = { ...question, calculations: updatedCalculations };
    updateStore(updatedQuestion);
    updateGlobalCalculations();
  };

  const handleSuggestionClick = (index: number, suggestion: string) => {
    const currentFormula = question.calculations![index].formula;
    const formula = currentFormula.replace(/@[^@]*$/, `${suggestion} `);
    handleCalculationChange(index, "formula", formula);
    setOpenPopover(false);
    setCurrentFormulaIndex(null);
  };

  const handleVisibilityToggle = (index: number) => {
    const updatedVisibility = !question.calculations![index].visibility;
    handleCalculationChange(index, "visibility", updatedVisibility);
  };

  const updateStore = (updatedQuestion: any) => {
    const updatedSection = {
      ...sections[sectionIndex],
      questions: [...sections[sectionIndex].questions],
    };
    updatedSection.questions[questionIndex] = updatedQuestion;
    updateSection(sectionIndex, updatedSection);
  };

  const handleAddDropdownOption = () => {
    const newOption = { name: "", value: "" };
    const updatedOptions = [...dropdownOptions, newOption];
    setDropdownOptions(updatedOptions);
    updateStore({ ...question, calculationDropdowns: updatedOptions });
  };

  const formatNumberWithCommas = (number: number | string): string => {
    if (typeof number === "string") {
      const numValue = parseFloat(number.replace(/,/g, ""));
      return isNaN(numValue)
        ? number
        : numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleDropdownOptionChange = (
    index: number,
    field: "name" | "value",
    value: string
  ) => {
    const updatedOptions = [...dropdownOptions];
    const numValue =
      field === "value" ? parseFloat(value.replace(/,/g, "")) : value;
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]:
        field === "value" && !isNaN(numValue as number) ? numValue : value,
    };
    setDropdownOptions(updatedOptions);
    updateStore({ ...question, calculationDropdowns: updatedOptions });
  };

  const handleRemoveDropdownOption = (index: number) => {
    const updatedOptions = [...dropdownOptions];
    updatedOptions.splice(index, 1);
    setDropdownOptions(updatedOptions);
    updateStore({ ...question, calculationDropdowns: updatedOptions });
  };

  const renderSimpleCalculation = () => (
    <>
      {question.calculations &&
        question.calculations.map(
          (calculation: ExtendedCalculation, index: number) => (
            <div
              key={index}
              className="flex space-x-4 items-center relative mb-2"
            >
              <input
                type="text"
                value={calculation.name}
                onChange={(e) =>
                  handleCalculationChange(index, "name", e.target.value)
                }
                className="main-input w-1/4"
                placeholder={t('questionDesign.calculationName')}
              />
              <select
                value={calculation.inputType}
                onChange={(e) =>
                  handleCalculationChange(index, "inputType", e.target.value)
                }
                className="main-input w-1/4"
              >
                <option value="userInput">{t('questionDesign.userInput')}</option>
                <option value="calculation">{t('questionDesign.calculation')}</option>
              </select>
              {calculation.inputType === "calculation" ? (
                <Popover
                  open={openPopover && currentFormulaIndex === index}
                  onOpenChange={(open) => {
                    setOpenPopover(open);
                    if (!open) setCurrentFormulaIndex(null);
                  }}
                >
                  <PopoverTrigger asChild>
                    <input
                      type="text"
                      value={calculation.formula}
                      onChange={(e) =>
                        handleFormulaChange(index, e.target.value)
                      }
                      className="main-input w-1/4"
                      placeholder={t('questionDesign.enterFormula')}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0">
                    <Command>
                      <CommandInput placeholder={t('questionDesign.typeToSeeVariables')} />
                      <CommandList>
                        {suggestions.length === 0 ? (
                          <CommandEmpty>{t('questionDesign.noVariablesFound')}</CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {suggestions.map((suggestion, sIndex) => (
                              <CommandItem
                                key={sIndex}
                                value={suggestion}
                                onSelect={() =>
                                  handleSuggestionClick(index, suggestion)
                                }
                              >
                                {suggestion}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={calculation.required || false}
                    onChange={(e) =>
                      handleCalculationChange(
                        index,
                        "required",
                        e.target.checked
                      )
                    }
                    className="w-1/4"
                  />
                  <p className="text-textmain">{t('questionDesign.required')}</p>
                </div>
              )}
              {calculation.inputType === "calculation" && (
                <button
                  type="button"
                  onClick={() => handleVisibilityToggle(index)}
                  className={`text-${
                    calculation.visibility ? "green" : "red"
                  }-500`}
                >
                  {calculation.visibility ? (
                    <Icon
                      icon="bi:eye"
                      className="text-[20px] textionatextmain"
                    />
                  ) : (
                    <Icon
                      icon="humbleicons:eye-off"
                      className="text-[20px] text-textmain"
                    />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemoveCalculation(index)}
                className="text-red-500"
              >
                X
              </button>
            </div>
          )
        )}
      <button
        type="button"
        onClick={handleAddCalculation}
        className="text-darkBlue float-right"
      >
{t('questionDesign.addCalculation')}
      </button>
    </>
  );

  const renderWithDropdownCalculation = () => (
    <>
      <button
        type="button"
        onClick={handleAddDropdownOption}
        className="text-darkBlue"
      >
{t('questionDesign.addDropdown')}
      </button>
      {dropdownOptions.map((option, index) => (
        <div key={index} className="flex space-x-4 items-center mb-2">
          <input
            type="text"
            value={option.name}
            onChange={(e) =>
              handleDropdownOptionChange(index, "name", e.target.value)
            }
            className="main-input w-1/3"
            placeholder={t('questionDesign.optionName')}
          />
          <input
            type="text"
            value={
              typeof option.value === "number"
                ? formatNumberWithCommas(option.value)
                : option.value
            }
            onChange={(e) =>
              handleDropdownOptionChange(index, "value", e.target.value)
            }
            className="main-input w-1/3"
            placeholder={t('questionDesign.optionValue')}
          />
          <button
            type="button"
            onClick={() => handleRemoveDropdownOption(index)}
            className="text-red-500"
          >
            X
          </button>
        </div>
      ))}
      {dropdownOptions.length > 0 && renderSimpleCalculation()}
    </>
  );

  return (
    <div className="space-y-4">
      <div className="question-container">
        <label className="main-label">{t('questionDesign.label')}</label>
        <input
          type="text"
          name="label"
          value={question.label || ""}
          onChange={handleChange}
          className="main-input"
          placeholder={t('questionDesign.label')}
        />
      </div>
      {!isMinimized && (
        <>
          <div className="question-container">
            <label className="main-label">{t('questionDesign.calculationType')}: </label>
            <select
              value={question.calculationType}
              onChange={handleChange}
              className="main-input"
              name="calculationType"
            >
              <option value="">{t('questionDesign.chooseAnOption')}</option>
              <option value="simple">{t('questionDesign.simple')}</option>
              <option value="withDropdown">{t('questionDesign.withDropdown')}</option>
            </select>
          </div>
          {question.calculationType === "simple"
            ? renderSimpleCalculation()
            : question.calculationType === "withDropdown" &&
              renderWithDropdownCalculation()}
        </>
      )}
    </div>
  );
};