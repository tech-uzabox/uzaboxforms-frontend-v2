import React from 'react';
import DateResponse from './date-response';
import TimeResponse from './time-response';
import EmailResponse from './email-response';
import { useTranslation } from 'react-i18next';
import NumberResponse from './number-response';
import UploadReseponse from './upload-response';
import CheckboxResponse from './checkbox-response';
import DropdownResponse from './dropdown-response';
import AddUsersResponse from './add-users-response';
import DateTimeResponse from './date-time-response';
import CountriesResponse from './countries-response';
import ParagraphResponse from './paragraph-response';
import ShortTextResponse from './short-text-response';
import SignatureReseponse from './signature-response';
import PhoneNumberResponse from './phone-number-response';
import AddCalculationResponse from './add-calculation-response';
import MultipleDropdownResponse from './multiple-dropdown-response';

interface ResponseResponse {
  questionId: string;
  questionType: string;
  label: string;
  response: any;
}

interface SectionProps {
  responses: ResponseResponse[] | Record<string, ResponseResponse>;
}

const ResponseComponents: { [key: string]: React.FC<{ response: any, label: string }> } = {
  'Short Text': ShortTextResponse,
  'Email': EmailResponse,
  'Phone Number': PhoneNumberResponse,
  'Paragraph': ParagraphResponse,
  'Date': DateResponse, 
  'DateTime': DateTimeResponse, 
  'Time': TimeResponse,
  'Number': NumberResponse,
  'Checkbox': CheckboxResponse,
  'Dropdown': DropdownResponse,
  'Upload': UploadReseponse,
  'Signature': SignatureReseponse,
  'Add Calculation': AddCalculationResponse,
  'Add Users': AddUsersResponse,
  'From Database': MultipleDropdownResponse,
  'Add To Database': MultipleDropdownResponse,
  'Countries': CountriesResponse,
};

const Section: React.FC<SectionProps> = ({ responses }) => {
  const { t } = useTranslation();
  
  // Convert responses to array format if it's a JSON object
  const responsesArray = Array.isArray(responses) 
    ? responses 
    : Object.values(responses);
  
  return (
    <div className="mb-6 space-y-4">
      {responsesArray.map(({ questionType, label, response, questionId }, index) => {
        const ResponseComponent = ResponseComponents[questionType] || (() => <div>{t('formResponses.unknownResponseType')}</div>);
        // const isCheckbox = questionType === 'Checkbox';
        return (
          <div key={questionId || index}>
            <p className="font-medium text-textmain pb-1">{label}</p>
            <ResponseComponent key={questionId || index} response={response} label={label} />
          </div>
        );
      })}
    </div>
  );
};

export default Section;