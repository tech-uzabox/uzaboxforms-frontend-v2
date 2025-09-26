import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomInput from '@/components/custom-input';

interface CalculationResult {
  name: string;
  result: number;
  formulaName: string;
}

interface AddCalculationResponseProps {
  response: {
    userInputs: { [key: string]: number | null };
    selectedDropdown: { name: string; value: number | string } | null;
    calculations: CalculationResult[];
    questionCalculations?: Array<{
      name: string;
      formulaName: string;
      inputType: 'userInput' | 'calculation';
      visibility?: boolean;
    }>;
  };
  label: string;
}

const AddCalculationResponse: React.FC<AddCalculationResponseProps> = ({ response }) => {
  const { t } = useTranslation();
  const { calculations } = response;

  const formatNumberWithCommas = (number: number): string => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="mb-4">
      <div>
        {calculations.length > 0 ? (
          <div className="space-y-3">
            {calculations.map((calc, index) => (
              <div key={index} className="flex items-center space-x-4">
                <label className="w-1/3 text-sm font-medium text-gray-600">{calc.name}</label>
                <div className="flex-1">
                  {isNaN(calc.result) ? (
                    <span className="text-red-500">{t('formResponses.error')}</span>
                  ) : (
                    <CustomInput
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
        ) : (
          <p className="text-gray-600">{t('formResponses.noCalculationsAvailable')}</p>
        )}
      </div>
    </div>
  );
};

export default AddCalculationResponse;