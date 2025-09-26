import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProcessSettingsComponentProps } from '@/types/process.types';

const ProcessSettingsComponent: React.FC<ProcessSettingsComponentProps> = ({ form, processData }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg mb-4">
      <div className="p-4 flex justify-between items-center rounded-[4px] bg-[#001A55] text-white">
        <div className="text-lg font-semibold text-slate-200">
          {processData?.name || t('processManagement.processName')}
        </div>
      </div>
      <div className="px-4 py-6 space-y-3">
        {/* Staff View Forms */}
        <div className="question-container">
          <label htmlFor="staffViewForms" className="main-label !whitespace-normal">
            {t('processManagement.canStaffViewProcessingInformation')}
          </label>
          <select
            id="staffViewForms"
            className="main-input"
            {...form.register('staffViewForms')}
          >
            <option value="" disabled>
              {t('processManagement.chooseAnOption')}
            </option>
            <option value="YES">{t('processManagement.yes')}</option>
            <option value="NO">{t('processManagement.no')}</option>
          </select>
        </div>

        {/* Applicant View Process Level */}
        <div className="question-container">
          <label htmlFor="applicantViewProcessLevel" className="main-label !whitespace-normal">
            {t('processManagement.canApplicantSeeProcessLevel')}
          </label>
          <select
            id="applicantViewProcessLevel"
            className="main-input"
            {...form.register('applicantViewProcessLevel')}
          >
            <option value="" disabled>
              {t('processManagement.chooseAnOption')}
            </option>
            <option value="YES">{t('processManagement.yes')}</option>
            <option value="NO">{t('processManagement.no')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProcessSettingsComponent;
