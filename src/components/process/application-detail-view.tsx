import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useAuthStore } from "@/store/use-auth-store";
import { useBreadcrumbStore } from "@/store/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserFormResponses from "@/components/process/user-form-responses";
import PendingFormComponent from "@/components/process/pending-form-component";
import AdminPendingFormComponent from "@/components/process/admin-pending-form-component";
import AdminUserFormResponses from "@/components/process/admin-user-form-responses";
import { EditApplicantStatusModel } from "@/components/process/edit-applicant-process-modal";

interface ApplicationDetailViewProps {
  data: any;
  isLoading: boolean;
  isError: boolean;
  isAdmin?: boolean;
  applicationType?: "pending" | "completed" | "disabled";
  showEditButton?: boolean;
}

export const ApplicationDetailView: React.FC<ApplicationDetailViewProps> = ({
  data,
  isLoading,
  isError,
  isAdmin = false,
  applicationType = "pending",
  showEditButton = false,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { setCustomBreadcrumbItems } = useBreadcrumbStore();
  const params = useParams();
  const processId = params.processId as string;
  const applicantProcessId = params.applicantProcessId as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const formNameMap: Record<string, string> = useMemo(() => {
    const nameMap: Record<string, string> = {};

    // Add completed forms
    if (data?.data?.completedForms && Array.isArray(data.data.completedForms)) {
      data.data.completedForms.forEach((form: any) => {
        if (form.id && form.formName) {
          nameMap[form.id] = form.formName;
        }
      });
    }

    // Add pending form
    if (data?.data?.pendingForm) {
      const pendingForm = data.data.pendingForm;
      if (pendingForm.id && pendingForm.formName) {
        nameMap[pendingForm.id] = pendingForm.formName;
      }
    }

    return nameMap;
  }, [data]);

  const completedFormIds: string[] = useMemo(() => {
    if (data?.data?.completedForms && Array.isArray(data.data.completedForms)) {
      return data.data.completedForms.map((form: any) => form.id);
    }
    return [];
  }, [data]);

  const allFormIds: string[] = useMemo(() => {
    const ids = [...completedFormIds];  

    if (data?.data?.pendingForm?.id) {
      ids.push(data.data.pendingForm.id);     
    } 

    return ids;
  }, [completedFormIds, data]);

  useEffect(() => {
    if (data) {
      const applicant = data?.data?.application?.applicant;
      const process = data?.data?.process;

      const applicantName = applicant
        ? applicant.lastName
          ? `${applicant.firstName} ${applicant.lastName}`
          : applicant.firstName
        : "Unknown Applicant";

      const processName = process?.name || "Unknown Process";

      const basePath = isAdmin ? "/admin/management" : "/staff/incoming";
      const typePath =
        applicationType === "pending"
          ? "pending-applications"
          : applicationType === "completed"
          ? "completed-applications"
          : "disabled-applications";

      setCustomBreadcrumbItems([
        {
          name: isAdmin ? t("sidebar.management") : t("sidebar.incoming"),
          href: "",
        },
        {
          name: t(`processManagement.${applicationType}Applications`),
          href: `${basePath}/${typePath}`,
        },
        { name: processName, href: `${basePath}/${typePath}/${processId}` },
        { name: applicantName, href: "" }
      ]);
    } else {
      setCustomBreadcrumbItems(null);
    }
  }, [data, isAdmin, applicationType, processId, t, setCustomBreadcrumbItems]);

  useEffect(() => {
    return () => {
      setCustomBreadcrumbItems(null);
    };
  }, [setCustomBreadcrumbItems]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-center py-8 text-primary">
          {t("processManagement.loading")}
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-center py-8 text-red-600">
          {t("processManagement.errorLoadingData")}
        </p>
      </div>
    );
  }

  const renderHeader = () => {
    const processName = data?.data?.process?.name;

    if (isAdmin) {
      return (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-gray-800">
            {processName} ({t("processManagement.adminView")}
            {applicationType !== "pending" &&
              ` - ${t(`processManagement.${applicationType}`)}`}
            )
          </h1>
          {showEditButton &&
            data?.data?.application?.editApplicationStatus && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-textIcon hover:text-primary transition-colors"
              >
                <Icon icon="akar-icons:edit" fontSize={20} />
              </button>
            )}
        </div>
      );
    } else {
      return (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-gray-800">{processName}</h1>
          {showEditButton &&
            data?.data?.application?.editApplicationStatus && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-textIcon hover:text-primary transition-colors"
              >
                <Icon icon="akar-icons:edit" fontSize={20} />
              </button>
            )}
        </div>
      );
    }
  };

  const renderApplicantInfo = () => {
    if (!isAdmin) return null;

    const applicant = data?.data?.application?.applicant;
    const application = data?.data?.application;

    const applicantName = applicant
      ? `${applicant.firstName} ${applicant.lastName}`
      : "Unknown Applicant";

    const status =
      applicationType === "completed"
        ? application?.isCompleted
          ? t("processManagement.completed")
          : t("processManagement.inProgress")
        : t(`processManagement.${applicationType}`);

    return (
      <div className="mb-4 text-sm text-gray-600">
        {t("processManagement.applicant")}: {applicantName}
        {applicationType !== "pending" &&
          ` | ${t("processManagement.status")}: ${status}`}
      </div>
    );
  };

  const renderFormContent = (formId: string) => {
    const isCompleted = completedFormIds.includes(formId);
    const applicantId = data?.data?.application?.applicant?.id || "";
    
    if (isAdmin) {
      if (isCompleted) {
        return (
          <AdminUserFormResponses
            formId={formId}
            processId={processId}
            applicantProcessId={applicantProcessId}
            applicantId={applicantId}
          />
        );
      } else {
        return (
          <AdminPendingFormComponent
            formId={formId}
            processId={processId}
            applicantProcessId={applicantProcessId}
            applicationData={data}
          />
        );
      }
    } else {
      if (isCompleted) {
        return (
          <UserFormResponses
            userId={user?.id || ""}
            processId={processId}
            applicantProcessId={applicantProcessId}
            formId={formId}
          />
        );
      } else {
        return (
          <PendingFormComponent
            formId={formId}
            processId={processId}
            applicantProcessId={applicantProcessId}
            completedFormIds={completedFormIds}
          />
        );
      }
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto overflow-x-hidden">
      {renderHeader()}
      {renderApplicantInfo()}

      <Tabs defaultValue={allFormIds[0] || "dummy"} className="w-full">
        <TabsList className="bg-white space-x-4 justify-start pb-6 w-full overflow-x-auto overflow-y-hidden">
          {allFormIds.map((formId) => (
            <TabsTrigger
              key={formId}
              value={formId}
              className="bg-white data-[state=active]:shadow-none data-[state=active]:border-b-[2.4px] border-[#012473] rounded-lg data-[state=active]:text-[#012473] text-black"
            >
              {formNameMap[formId] || t("processManagement.unknownForm")}
            </TabsTrigger>
          ))}
        </TabsList>

        {allFormIds.map((formId) => (
          <TabsContent
            key={formId}
            value={formId}
            className="border-none max-w-screen-md"
          >
            {renderFormContent(formId)}
          </TabsContent>
        ))}
      </Tabs>

      {!isAdmin &&
        (data?.applicantProcess ||
          data?.completedForms ||
          data?.data?.application) && (
          <EditApplicantStatusModel
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            applicantProcess={
              data.applicantProcess || {
                applicantProcessId: data?.data?.application?.id || data.id,
                applicantId:
                  data?.data?.application?.applicant?.id || data.applicantId,
                processId: data?.data?.process?.id || data.processId,
                status: data?.data?.application?.status || data.status,
                completedForms: data.completedForms,
                editApplicationStatus:
                  data.completedForms?.[0]?.editApplicationStatus,
              }
            }
          />
        )}
    </div>
  );
};
