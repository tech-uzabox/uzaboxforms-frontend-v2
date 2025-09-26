import 'react-clock/dist/Clock.css';
import { ClockIcon } from 'lucide-react';
import TimePicker from 'react-time-picker';
import type { QuestionTypes } from '@/types';
import { useTranslation } from 'react-i18next';
import { useFormResponseStore } from '@/store';
import 'react-time-picker/dist/TimePicker.css';
import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateProps {
    question: QuestionTypes;
    sectionId: string;
    sectionName: string;
    setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const TimeAnswer: React.FC<DateProps> = ({ question, sectionId, sectionName }) => {
    const { t } = useTranslation();
    const { setResponse, formResponses } = useFormResponseStore();
    const existingSection = formResponses[sectionId];
    const existingResponse = existingSection?.questions[question.id]?.response || null;

    const [timeValue, setTimeValue] = useState<any>(
        existingResponse?.time ? existingResponse.time : ''
    );

    const midNight = new Date();
    midNight.setHours(24);
    midNight.setMinutes(0);
    midNight.setHours(0)
    midNight.setDate(new Date().getDate())

    useEffect(() => {
        if (timeValue) {
            const response = timeValue;
            setResponse(sectionId, sectionName, question.id, question.type, question.label ?? '', response);
        }
    }, [timeValue]);

    // const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setTimeValue(event.target.value);
    // };

    const renderDateInput = () => {
        switch (question.timeType) {
            case 'all-time':
                return (
                    <div className='rounded border-l-[2.4px] border-primary flex justify-between text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none mt-1 items-center'>
                        <TimePicker
                            value={timeValue}
                            disableClock
                            format='h:m:s a'
                            name='timeValue'
                            onChange={(v) => setTimeValue(v)}
                            locale='fr'
                            className='appearance-none'
                        />
                        <ClockIcon className="mr-2 h-4 w-4" />
                    </div>
                );
            case 'past-only':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className='rounded border-l-[2.4px] border-primary px-5 py-3 flex justify-between text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none mt-1'
                            >
                                {timeValue ? timeValue : <span>{t('forms.pickATime')}</span>}
                                <ClockIcon className="mr-2 h-4 w-4" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start" >
                            <TimePicker
                                value={timeValue}
                                disableClock
                                format='h:m:s a'
                                onChange={(v) => setTimeValue(v)}
                                locale='fr'
                                className='appearance-none'
                                maxTime={new Date().toLocaleTimeString()}
                            />
                        </PopoverContent>
                    </Popover>
                );
            case 'future-only':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className='rounded border-l-[2.4px] border-primary px-5 py-3 flex justify-between text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none mt-1'
                            >
                                {timeValue ? timeValue : <span>{t('forms.pickATime')}</span>}
                                <ClockIcon className="mr-2 h-4 w-4" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <TimePicker
                                value={timeValue}
                                disableClock
                                format='h:m:s a'
                                onChange={(v) => setTimeValue(v)}
                                locale='fr'
                                className='appearance-none'
                                minTime={new Date().toLocaleTimeString()}
                                maxTime={midNight.toLocaleTimeString()}
                            />
                        </PopoverContent>
                    </Popover>
                );


            default:
                return <span>{t('forms.pleaseSelectValidDateType')}</span>;
        }
    };

    return (
        <div className="mb-4">
            <div className="main-label">
                {question.label} {question.required == 'yes' && <span className="text-red-500">*</span>}
            </div>
            {renderDateInput()}
        </div>
    );
};