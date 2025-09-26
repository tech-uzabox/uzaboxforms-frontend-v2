import React from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInCalendarDays } from 'date-fns';

interface DateResponseProps {
    response: any;
    label: string;
}

const TimeResponse: React.FC<DateResponseProps> = ({ response }) => {
    const { t } = useTranslation();
    
    const renderResponse = () => {
        // If response is a string, render it as a single date or time
        if (typeof response === 'string') {
            return <span>{response}</span>;
        }

        // If response is an object with date and time, render date and time
        if (typeof response === 'object') {
            if (response.date && response.time) {
                return (
                    <span>
                        {response.date} at {response.time}
                    </span>
                );
            }

            // If response is an object with a start and end, render the date range
            if (response.start && response.end) {
                return (
                    <div>
                        <span>
                            {response.start} - {response.end}
                        </span>
                        <p>{t('formResponses.totalDays', { count: response?.start && response?.end ? differenceInCalendarDays(response.end, response.start) + 1 : 0 })}</p>
                    </div>
                );
            }
        }

        return <span>{t('formResponses.invalidResponseFormat')}</span>;
    };

    return (
        <div className="main-response-container">
            <div>{renderResponse()}</div>
        </div>
    );
};

export default TimeResponse;