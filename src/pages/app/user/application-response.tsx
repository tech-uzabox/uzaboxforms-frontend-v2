import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuthStore } from "@/store";
import { useGetAllImages } from "@/hooks";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useGetResponsesByUserIdAndFormId } from "@/hooks";
import UserResponsesPDF from "@/components/user-responses-pdf";
import CommentsSection from "@/components/process/comments-section";
import Section from "@/components/form/form-responses/form-responses-renderer";

const UserFormResponsePage: React.FC = () => {
  const { t } = useTranslation();
  const params = useParams();
  const { formId, userId, processId, applicantProcessId } = params;
  const { user } = useAuthStore();

  const { data, isLoading, isError } = useGetResponsesByUserIdAndFormId({
    userId: user?.id || "",
    applicantProcessId: (applicantProcessId as string) || "",
    formId: (formId as string) || "",
  });

  const { data: allImages } = useGetAllImages();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-center py-8 text-primary">{t('applicationResponse.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-center py-8 text-red-600">
          {t('applicationResponse.errorFetchingResponses')}
        </p>
      </div>
    );
  }

  if (!data?.responses.length) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-center py-8 text-primary">{t('applicationResponse.noResponsesFound')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto">
      <div className="">
        {data.responses.map((response: any) => (
          <div key={response.id} className="bg-white mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-primary">
                {response.name}
              </h2>
              <PDFDownloadLink
                document={
                  <UserResponsesPDF
                    responses={data.responses}
                    allImages={allImages}
                  />
                }
                fileName="user_responses.pdf"
                className="bg-darkBlue hover:bg-darkBlue/75 text-white px-2 py-1 rounded "
              >
                <Icon icon="humbleicons:download" fontSize={19} />
              </PDFDownloadLink>
            </div>
            <Accordion type="multiple">
              {response.responses && Object.keys(response.responses).length > 0 ? (
                Object.values(response.responses).map((section: any, index: number) => (
                  <AccordionItem
                    key={section.sectionId || index}
                    value={`item-${index}`}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className={`${
                        response.userId == user?.id
                          ? "bg-[#F6F9FF]"
                          : "bg-[#efefed]"
                      } px-4 rounded my-2 text-[#001A55]`}
                    >
                      {section.sectionName}
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <Section responses={section.questions || section.responses} />
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {t('applicationResponse.noSectionsFound')}
                </div>
              )}
            </Accordion>
          </div>
        ))}
      </div>
      <CommentsSection
        processId={processId as string}
        applicantProcessId={applicantProcessId as string}
        formId={formId as string}
        userId={userId as string}
      />
    </div>
  );
};

export default UserFormResponsePage;