import { QuestionTypes } from "@/types";
import { useTranslation } from "react-i18next";
import { useFormResponseStore } from "@/store";
import countryList from "@/constants/country-list";
import React, { useEffect, useState } from "react";

interface CountriesAnswerProps {
  question: QuestionTypes;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (
    sectionId: string,
    questionId: string,
    error: string | null
  ) => void;
}

const CountriesAnswer: React.FC<CountriesAnswerProps> = ({
  question,
  sectionId,
  sectionName,
  setValidationErrors,
}) => {
  const { t } = useTranslation();
  const { formResponses, setResponse } = useFormResponseStore();
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const existingSection = formResponses[sectionId];
  const existingResponse = existingSection?.questions[question.id]?.response;

  const [selectedCountry, setSelectedCountry] = useState(
    existingResponse || ""
  );

  useEffect(() => {
    const fetchCountries = async () => {
      if (question.countryLevel) {
        setIsLoading(true);
        try {
          const data = countryList[
            question.countryLevel as keyof typeof countryList
          ] as string[];
          const sortedData = data.sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
          );
          setCountries(sortedData);
        } catch (error) {
          console.error("Failed to fetch countries:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCountries();
  }, [question.countryLevel]);

  useEffect(() => {
    if (question.required === "yes" && !selectedCountry) {
      setValidationErrors(
        sectionId,
        question.id,
        `${question.label} ${t('forms.isRequired')}`
      );
    } else if (question.required === "yes" && selectedCountry) {
      setValidationErrors(sectionId, question.id, null);
    }
  }, [
    question.required,
    selectedCountry,
    sectionId,
    question.id,
    question.label,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    setResponse(
      sectionId,
      sectionName,
      question.id,
      question.type,
      question.label as string,
      countryName.toLowerCase()
    );

    if (question.required === "yes" && !countryName) {
      setValidationErrors(
        sectionId,
        question.id,
        `${question.label} ${t('forms.isRequired')}`
      );
    } else {
      setValidationErrors(sectionId, question.id, null);
    }
  };

  return (
    <div className="question-container">
      <label className="main-label mb-1">
        {question.label}{" "}
        {question.required === "yes" && <span className="text-red-500">*</span>}
      </label>
      {isLoading ? (
        <p>Loading countries...</p>
      ) : (
        <select
          className="main-select"
          required={question.required === "yes"}
          value={selectedCountry}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select a country
          </option>
          {countries.map((country) => (
            <option key={country} value={country.toLowerCase()}>
              {country}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CountriesAnswer;