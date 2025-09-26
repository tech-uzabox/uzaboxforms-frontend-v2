import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import type { QuestionTypes } from "@/types";
import { useTranslation } from "react-i18next";
import { useFormResponseStore } from "@/store";
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateProps {
  question: QuestionTypes;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (    
    sectionId: string,
    questionId: string,
    error: string | null
  ) => void;
}

export const DateAnswer: React.FC<DateProps> = ({
  question,
  sectionId,
  sectionName,
}) => {
  const { t } = useTranslation();
  const { setResponse, formResponses } = useFormResponseStore();
  const existingSection = formResponses[sectionId];
  const existingResponse = existingSection?.questions[question.id]?.response || null;

  const [singleDate, setSingleDate] = useState<Date | undefined>(
    existingResponse?.start ? new Date(existingResponse.start) : undefined
  );

  useEffect(() => {
    if (singleDate) {
      const response = {
        date: format(singleDate, "yyyy-MM-dd"),
      };
      setResponse(
        sectionId,
        sectionName,
        question.id,
        question.type,
        question.label ?? "",
        response
      );
    } else if (singleDate) {
      const response = format(singleDate, "yyyy-MM-dd");
      setResponse(
        sectionId,
        sectionName,
        question.id,
        question.type,
        question.label ?? "",
        response
      );
    }
  }, [singleDate]);

  const renderDateInput = () => {
    switch (question.timeType) {
      case "all-time":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded border-l-[2.4px] border-primary px-5 py-3 flex justify-between text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none mt-1">
                {singleDate ? (
                  format(singleDate, "LLL dd, y")
                ) : (
                  <span>{t('forms.pickADate')}</span>
                )}
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
                numberOfMonths={1}
                toYear={2050}
              />
            </PopoverContent>
          </Popover>
        );
      case "past-only":
        return (
          <div className="">
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded border-l-[2.4px] border-primary px-5 py-3 flex gap-6 justify-between text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none mt-1">
                  <div className="flex items-center gap-6">
                    {singleDate ? (
                      format(singleDate, "LLL dd, y")
                    ) : (
                      <span>{t('forms.pickADate')}</span>
                    )}
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
                  fromYear={1900}
                  toDate={new Date()}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case "future-only":
        return (
          <div className="">
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded border-l-[2.4px] border-primary px-5 py-3 flex  gap-6 justify-between text-[#5A5A5A] placeholder:text-[#5A5A5A] bg-[#F6F9FF] text-sm w-full outline-none mt-1">
                  <div className="flex items-center gap-6">
                    {singleDate ? (
                      format(singleDate, "LLL dd, y")
                    ) : (
                      <span>{t('forms.pickADate')}</span>
                    )}
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
                  numberOfMonths={1}
                  toYear={2100}
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
        {question.label}{" "}
        {question.required == "yes" && <span className="text-red-500">*</span>}
      </div>
      {renderDateInput()}
    </div>
  );
};
