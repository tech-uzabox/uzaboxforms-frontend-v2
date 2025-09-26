import { useGetAllImages } from "@/hooks";
import type { formParamsProps } from "@/types";
import { useTranslation } from "react-i18next";
import React, { useRef, useState } from "react";
import CommentsSection from "./comments-section";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useGetResponsesByUserIdAndFormId } from "@/hooks";
import UserResponsesPDF from "@/components/user-responses-pdf";
import Section from "@/components/form/form-responses/form-responses-renderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const UserFormResponses: React.FC<formParamsProps> = ({
  formId,
  applicantProcessId,
  userId,
  processId,
}) => {
  const { t } = useTranslation();
  const { data, isError, isLoading } = useGetResponsesByUserIdAndFormId({
    userId,
    formId,
    applicantProcessId,
  });
  const { data: allImages } = useGetAllImages();

  const pdfRef = useRef<HTMLDivElement | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-center py-8 text-primary">
          {t("processManagement.loading")}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-center py-8 text-red-600">
          {t("processManagement.errorFetchingResponses")}
        </p>
      </div>
    );
  }

  if (!data?.responses.length) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-center py-8 text-primary">
          {t("processManagement.noResponsesFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mb-4">
      <div className="my-4 flex items-center justify-end">
        <PDFDownloadLink
          document={
            <UserResponsesPDF
              responses={data.responses}
              allImages={allImages}
            />
          }
          fileName="user_responses.pdf"
          className="bg-primary text-sm text-white px-4 py-2 rounded hover:bg-primary/75 transition-all duration-300"
        >
          {t("processManagement.downloadPDF")}
        </PDFDownloadLink>
      </div>
      <div ref={pdfRef}>
        {data.responses.map((response: any) => (
          <div key={response.id} className="">
            <Accordion
              type="multiple"
              value={openItems}
              onValueChange={setOpenItems}
            >
              {response.responses &&
              Object.keys(response.responses).length > 0 ? (
                Object.values(response.responses).map(
                  (section: any, index: number) => (
                    <AccordionItem
                      key={section.sectionId || index}
                      value={`item-${index}`}
                      className="border-none"
                    >
                      <AccordionTrigger className="text-[#001A55] bg-[#F6F9FF] px-4 rounded my-2">
                        {section.sectionName}
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                        <Section
                          responses={section.questions || section.responses}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )
                )
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {t("processManagement.noSectionsFound")}
                </div>
              )}
            </Accordion>
          </div>
        ))}
      </div>
      <CommentsSection
        userId={userId}
        processId={processId}
        applicantProcessId={applicantProcessId}
        formId={formId}
      />
    </div>
  );
};

export default UserFormResponses;
