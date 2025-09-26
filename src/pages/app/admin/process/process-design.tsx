import {
  useGetAllUsers,
  useGetProcessById,
  useGetAllForms,
  useCreateProcessAndForm,
  useGetAllRoles,
} from "@/hooks";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ProcessFormTypes } from "@/types";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { roleStore } from "@/store/user/role-store";
import { formStore } from "@/store/form/form-store";
import {
  processDesignSchema,
  ProcessDesignFormData,
} from "@/components/process/process-design-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { userStore, ProcessDesignStore } from "@/store";
import { useNavigate, useParams } from "react-router-dom";
import FormListComponent from "@/components/process/form-list-component";
import ProcessSettingsComponent from "@/components/process/process-settings-component";

const ProcessDesign: React.FC = () => {
  const { setFormList } = formStore();
  const { t } = useTranslation();
  const {
    forms,
    addFormAtIndex,
    removeForm,
    setProcessId,
    checkDuplicateForm,
    setForms,
    staffViewForms,
    setStaffViewForms,
    applicantViewProcessLevel,
    setApplicantViewProcessLevel,
    resetProcessDesignState,
    updateFormField,
    moveFormUp,
    moveFormDown,
  } = ProcessDesignStore();
  const { setUsers } = userStore();
  const { setRoles } = roleStore();

  const { data: formNamesData, isLoading: isFormNamesLoading } =
    useGetAllForms();
  const { data: users } = useGetAllUsers({ names: ["Staff"] });
  const { data: roles } = useGetAllRoles();

  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const params = useParams();
  const processId = params.processId as string;
  const navigate = useNavigate();

  const { data: processData, isLoading: isProcessLoading } =
    useGetProcessById(processId);
  const { mutate: createProcessAndForm, isPending } = useCreateProcessAndForm();

  // React Hook Form setup
  const form = useForm<ProcessDesignFormData>({
    resolver: zodResolver(processDesignSchema),
    defaultValues: {
      staffViewForms: "NO",
      applicantViewProcessLevel: "NO",
      forms: [],
    },
  });

  useEffect(() => {
    if (users) {
      setUsers(users);
    }
  }, [users, setUsers]);

  useEffect(() => {
    if (roles) {
      setRoles(roles);
    }
  }, [roles, setRoles]);

  useEffect(() => {
    return () => {
      resetProcessDesignState();
    };
  }, [resetProcessDesignState]);

  useEffect(() => {
    if (isFormNamesLoading || isProcessLoading) return;

    if (formNamesData) setFormList(formNamesData);

    if (processData) {
      // Handle new backend response structure (wrapped in success/data)
      const data = processData.data || processData;
      
      // Initialize with actual forms data from backend
      if (data.forms && Array.isArray(data.forms)) {
        const mappedForms = data.forms.map((formData: any) => ({
          formId: formData.formId,
          nextStepType: formData.nextStepType,
          nextStepRoles: formData.nextStepRoles || [],
          nextStepSpecifiedTo: formData.nextStepSpecifiedTo || undefined,
          nextStaff: formData.nextStaff || '',
          notificationType: formData.notificationType,
          notificationTo: formData.notificationTo || '',
          notificationToRoles: formData.notificationToRoles || [],
          notificationComment: formData.notificationComment || '',
          editApplicationStatus: formData.editApplicationStatus ?? false,
          applicantViewFormAfterCompletion: formData.applicantViewFormAfterCompletion ?? false,
          notifyApplicant: formData.notifyApplicant ?? false,
          applicantNotificationContent: formData.applicantNotificationContent || '',
        }));
        setForms(mappedForms);
      } else {
        setForms([]);
      }
      
      setStaffViewForms(data.staffViewForms ? "YES" : "NO");
      setApplicantViewProcessLevel(
        data.applicantViewProcessLevel ? "YES" : "NO"
      );
    }

    setProcessId(processId);
    setIsInitialLoadComplete(true);
  }, [
    formNamesData,
    processData,
    processId,
    isFormNamesLoading,
    isProcessLoading,
    setFormList,
    setForms,
    setStaffViewForms,
    setApplicantViewProcessLevel,
    setProcessId,
  ]);

  // Sync form with store state
  useEffect(() => {
    form.setValue("staffViewForms", staffViewForms as "YES" | "NO");
    form.setValue(
      "applicantViewProcessLevel",
      applicantViewProcessLevel as "YES" | "NO"
    );
    form.setValue("forms", forms);
  }, [staffViewForms, applicantViewProcessLevel, forms, form]);

  const handleAddForm = (index: number, selectedFormId: string) => {
    if (checkDuplicateForm(selectedFormId)) {
      toast.error(t("processManagement.formAlreadyAdded"));
      return;
    }

    const newForm: ProcessFormTypes = {
      formId: selectedFormId,
      nextStepType: "STATIC",
      nextStaff: "",
      notificationType: "NOT_APPLICABLE",
      editApplicationStatus: false,
      applicantViewFormAfterCompletion: false,
      notifyApplicant: false,
      applicantNotificationContent: "",
    };

    addFormAtIndex(index, newForm);
  };

  const handleRemoveForm = (index: number) => {
    removeForm(index);
  };

  const handleSubmit = form.handleSubmit((data) => {
    // Update form data with current state
    const formData = {
      processId,
      staffViewForms: data.staffViewForms === "YES",
      applicantViewProcessLevel: data.applicantViewProcessLevel === "YES",
      processForms: data.forms.map((form, index) => {
        const formData: any = {
          formId: form.formId,
          order: index + 1,
          nextStepType: form.nextStepType,
          notificationType: form.notificationType,
          notifyApplicant: form.notifyApplicant,
        };

        // Only add fields that have values
        if (form.nextStepRoles && form.nextStepRoles.length > 0) {
          formData.nextStepRoles = form.nextStepRoles;
        }
        if (form.nextStepSpecifiedTo) {
          formData.nextStepSpecifiedTo = form.nextStepSpecifiedTo;
        }
        if (form.nextStaff && form.nextStaff.trim() !== "") {
          formData.nextStaff = form.nextStaff;
        }
        if (form.notificationTo && form.notificationTo.trim() !== "") {
          formData.notificationTo = form.notificationTo;
        }
        if (form.notificationToRoles && form.notificationToRoles.length > 0) {
          formData.notificationToRoles = form.notificationToRoles;
        }
        if (form.notificationComment && form.notificationComment.trim() !== "") {
          formData.notificationComment = form.notificationComment;
        }
        if (form.editApplicationStatus === true) {
          formData.editApplicationStatus = form.editApplicationStatus;
        }
        if (form.applicantViewFormAfterCompletion === true) {
          formData.applicantViewFormAfterCompletion = form.applicantViewFormAfterCompletion;
        }
        if (form.applicantNotificationContent && form.applicantNotificationContent.trim() !== "") {
          formData.applicantNotificationContent = form.applicantNotificationContent;
        }

        return formData;
      }),
    };

    createProcessAndForm(
      { processId, formData },
      {
        onSuccess: () => {
          toast.success(t("common.savedSuccessfully"));
          navigate("/admin/processes");
        },
        onError: () => {
          toast.error(t("processManagement.failedToSaveProcess"));
        },
      }
    );
  });

  const formOptions =
    formNamesData?.map((form: any) => ({
      title: form.name,
      value: form.id,
      icon: "mdi:form-select",
    })) || [];

  if (!isInitialLoadComplete) {
    return <p className="text-center py-6">{t("processManagement.loading")}</p>;
  }

  return (
    <div className="max-w-screen-md mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Process Settings */}
        <ProcessSettingsComponent form={form} processData={processData} />

        {/* Form List */}
        <FormListComponent
          forms={forms}
          formOptions={formOptions}
          onAddForm={handleAddForm}
          onRemoveForm={handleRemoveForm}
          onUpdateFormField={updateFormField}
          onMoveFormUp={moveFormUp}
          onMoveFormDown={moveFormDown}
          checkDuplicateForm={checkDuplicateForm}
        />

        {/* Submit Button */}
        <div className="flex items-center mt-8 justify-center">
          <button
            type="submit"
            className="main-dark-button float-right !px-12"
            disabled={isPending}
          >
            {isPending ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcessDesign;
