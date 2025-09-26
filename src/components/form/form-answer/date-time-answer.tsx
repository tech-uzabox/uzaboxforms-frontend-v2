import { format } from 'date-fns';
import TimePicker from 'react-time-picker';
import type { QuestionTypes } from '@/types';
import { useTranslation } from 'react-i18next';
import { useFormResponseStore } from '@/store';
import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateProps {
    question: QuestionTypes;
    sectionId: string;
    sectionName: string;
    setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const DateTimeAnswer: React.FC<DateProps> = ({ question, sectionId, sectionName }) => {
    const { t } = useTranslation();
    const { setResponse, formResponses } = useFormResponseStore();
    const existingSection = formResponses[sectionId];
    const existingResponse = existingSection?.questions[question.id]?.response || null;

    const [singleDate, setSingleDate] = useState<Date | undefined>(
        existingResponse?.start ? new Date(existingResponse.start) : undefined
    );
    const [timeValue, setTimeValue] = useState<any>(
        existingResponse?.time ? existingResponse.time : ''
    );

    const midNight = new Date();
    midNight.setHours(24);
    midNight.setMinutes(0);
    midNight.setHours(0)
    midNight.setDate(new Date().getDate())
    // useEffect(() => {
    //     if (!question.required) {
    //         setValidationErrors(sectionId, question.id, null);
    //         return;
    //     }

    //     switch (question.dateType) {
    //         case 'date-only':
    //             if (!singleDate) {
    //                 setValidationErrors(sectionId, question.id, `${question.label} is required`);
    //             } else {
    //                 setValidationErrors(sectionId, question.id, null);
    //             }
    //             break;

    //         case 'time-only':
    //             if (!timeValue) {
    //                 setValidationErrors(sectionId, question.id, `${question.label} is required`);
    //             } else {
    //                 setValidationErrors(sectionId, question.id, null);
    //             }
    //             break;

    //         case 'date-time':
    //             if (!singleDate || !timeValue) {
    //                 setValidationErrors(sectionId, question.id, `${question.label} is required`);
    //             } else {
    //                 setValidationErrors(sectionId, question.id, null);
    //             }
    //             break;

    //         default:
    //             setValidationErrors(sectionId, question.id, null);
    //     }
    // }, [singleDate, question.required, timeValue]);

    useEffect(() => {
        if (singleDate && timeValue) {
            const response = {
                date: format(singleDate, 'yyyy-MM-dd'),
                time: timeValue,
            };
            setResponse(sectionId, sectionName, question.id, question.type, question.label ?? '', response);
        } else if (singleDate) {
            const response = format(singleDate, 'yyyy-MM-dd');
            setResponse(sectionId, sectionName, question.id, question.type, question.label ?? '', response);
        } else if (timeValue) {
            const response = timeValue;
            setResponse(sectionId, sectionName, question.id, question.type, question.label ?? '', response);
        }
    }, [singleDate, timeValue]);

    // const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setTimeValue(event.target.value);
    // };

    const formatTimeWithAmPm = (timeString: string) => {
        if (!timeString) return '';
        const [hours, minutes, _seconds] = timeString.split(':');
        const hourNum = parseInt(hours, 10);

        const period = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;

        return `${hour12}:${minutes} ${period}`;
    };

    const renderDateInput = () => {
        switch (question.timeType) {
            case 'all-time':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className='rounded border-l-[2.4px] border-primary px-5 py-3 flex justify-between gap-6 text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none mt-1'
                            >
                                <div className='flex items-center gap-2'>
                                    {singleDate ? <span>{format(singleDate, 'LLL dd, y')}</span> : <span>{t('forms.pickADate')}</span>} <span>-</span>
                                    {timeValue ? <span>{formatTimeWithAmPm(timeValue)}</span> : <span>{t('forms.pickATime')}</span>}
                                </div>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={singleDate}
                                onSelect={setSingleDate}
                                captionLayout="dropdown-buttons"
                                fromYear={1900}
                            />
                            <TimePicker
                                value={timeValue}
                                disableClock
                                format='h:m:s a'
                                name='timeValue'
                                onChange={(v) => setTimeValue(v)}
                                locale='fr'
                                className='appearance-none'
                            />
                        </PopoverContent>
                    </Popover>
                );
            case 'past-only':
                return (
                    <div className=''>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className='rounded border-l-[2.4px] border-primary px-5 py-3 flex gap-6 justify-between text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none mt-1'
                                >
                                    <div className='flex items-center gap-6'>

                                        {singleDate ? <span>{format(singleDate, 'LLL dd, y')}</span> : <span>{t('forms.pickADate')}</span>} <span>-</span>
                                        {timeValue ? <span>{formatTimeWithAmPm(timeValue)}</span> : <span>{t('forms.pickATime')}</span>}
                                    </div>

                                    <CalendarIcon className="mr-1 h-4 w-4" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={singleDate}
                                    onSelect={setSingleDate}
                                    captionLayout="dropdown-buttons"
                                    toDate={new Date()}
                                    fromYear={1900}
                                />
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

                    </div>
                );
            case 'future-only':
                return (
                    <div className=''>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className='rounded border-l-[2.4px] border-primary px-5 py-3 flex  gap-6 justify-between text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none mt-1'
                                >
                                    <div className='flex items-center gap-6'>
                                        {singleDate ? <span>{format(singleDate, 'LLL dd, y')}</span> : <span>{t('forms.pickADate')}</span>} <span>-</span>
                                        {timeValue ? <span>{timeValue}</span> : <span>{t('forms.pickATime')}</span>}
                                    </div>
                                    <CalendarIcon className="mr-1 h-4 w-4" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={singleDate}
                                    onSelect={setSingleDate}
                                    captionLayout="dropdown-buttons"
                                    fromDate={new Date()}
                                    fromYear={1900}

                                />
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

                    </div>
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