import { useFormResponseStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { DateRange } from 'react-day-picker';
import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { differenceInCalendarDays, format, isWeekend } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateProps {
  question: any;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const DateRangeAnswer: React.FC<DateProps> = ({ question, sectionId, sectionName, setValidationErrors }) => {
  const { t } = useTranslation();
  const { setResponse, formResponses } = useFormResponseStore();
  const existingSection = formResponses[sectionId];
  const existingResponse = existingSection?.questions[question.id]?.response || null;

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: existingResponse?.start ? new Date(existingResponse.start) : undefined,
    to: existingResponse?.end ? new Date(existingResponse.end) : undefined,
  });

  useEffect(() => {
    if (question.required == 'yes' && (!dateRange?.from || !dateRange?.to)) {
      setValidationErrors(sectionId, question.id, `${question.label} ${t('forms.isRequired')}`);
    } else {
      setValidationErrors(sectionId, question.id, null);
    }
  }, [dateRange, question.required]);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const response = {
        start: format(dateRange.from, 'yyyy-MM-dd'),
        end: format(dateRange.to, 'yyyy-MM-dd'),
      };
      setResponse(sectionId, sectionName, question.id, question.type, question.label, response);
    }
  }, [dateRange]);

  // Calculate total days based on rangeCalculation
  const calculateTotalDays = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;

    const { from, to } = dateRange;
    const excludedDates = question.excludedDates || [];

    switch (question.rangeCalculation) {
      case 'days':
        return differenceInCalendarDays(to, from) + 1;
      case 'exclude-weekends':
        return Array.from({ length: differenceInCalendarDays(to, from) + 1 }, (_, i) => new Date(from.getTime() + i * 86400000))
          .filter(date => !isWeekend(date))
          .length;
      case 'exclude-specified-days':
      case 'exclude-specified-dates-and-weekends':
        return Array.from({ length: differenceInCalendarDays(to, from) + 1 }, (_, i) => new Date(from.getTime() + i * 86400000))
          .filter(date => {
            const dateString = format(date, 'yyyy-MM-dd');
            const isExcluded = excludedDates.includes(dateString);
            const isWeekendDay = question.rangeCalculation === 'exclude-specified-dates-and-weekends' && isWeekend(date);
            return !isExcluded && !isWeekendDay;
          })
          .length;
      default:
        return 0;
    }
  };

  const renderDateRangeInput = () => (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="rounded border-l-[2.4px] border-primary px-5 py-3 flex justify-between text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none mt-1"
        >
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
              </>
            ) : (
              format(dateRange.from, 'LLL dd, y')
            )
          ) : (
            <span>{t('forms.pickADateRange')}</span>
          )}
          <CalendarIcon className="mr-2 h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          captionLayout="dropdown-buttons"
          fromYear={1960}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="mb-4">
      <div className="main-label">
        {question.label} {question.required == 'yes' && <span className="text-red-500">*</span>}
      </div>
      {renderDateRangeInput()}
      <div className="mt-2 text-sm">
        <p>{t('forms.totalDays')}: {calculateTotalDays()}</p>
      </div>
    </div>
  );
};