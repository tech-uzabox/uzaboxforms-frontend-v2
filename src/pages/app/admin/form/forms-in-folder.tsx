import dayjs from "dayjs";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import type { Folder } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useGetFolderById } from "@/hooks/folder";
import { formStore } from "@/store/form/form-store";
import { useDuplicateForm } from "@/hooks/form/use-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBreadcrumbStore } from "@/store/ui";
import { Table } from "@/components/table";
import {
  AddFormNameModal,
  FormNameModal,
} from "@/components/form/add-edit-form-name-modal";
import BulkUploadModal from "@/components/form/bulk-upload-modal";

const FormsInFolder = () => {
  const { t } = useTranslation();
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const { setFormList } = formStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormName, setSelectedFormName] = useState<any>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedFormForBulk, setSelectedFormForBulk] = useState<any>(null);
  const duplicateFormMutation = useDuplicateForm();

  const { data: folderData, isPending: isFolderPending } = useGetFolderById(
    folderId || ""
  );
  const { setCustomBreadcrumbItems } = useBreadcrumbStore();

  useEffect(() => {
    if (folderData?.forms) setFormList(folderData.forms);
  }, [folderData, setFormList]);

  // Set custom breadcrumbs with folder name
  useEffect(() => {
    if (folderData) {
      setCustomBreadcrumbItems([
        { name: t('sidebar.home'), href: '/' },
        { name: t('sidebar.forms'), href: '/admin/form' },
        { name: folderData.name, href: '' }
      ]);
    } else {
      setCustomBreadcrumbItems(null);
    }
  }, [folderData, t, setCustomBreadcrumbItems]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setCustomBreadcrumbItems(null);
    };
  }, [setCustomBreadcrumbItems]);

  // Use forms directly from folder response
  const folderForms = folderData?.forms || [];

  const openModal = (formName: any) => {
    setSelectedFormName(formName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFormName(null);
  };

  const openBulkModal = (form: any) => {
    setSelectedFormForBulk(form);
    setIsBulkModalOpen(true);
  };

  const closeBulkModal = () => {
    setIsBulkModalOpen(false);
    setSelectedFormForBulk(null);
  };

  const handleDuplicate = async (form: any) => {
    try {
      const response = await duplicateFormMutation.mutateAsync({
        formId: form.id,
        newName: `${form.name} (Copy)`,
      });
      if (response) {
        toast.success(t('common.duplicateFormSuccessfully'));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("formManagement.updatingFormNameFailed"));
    }
  };

  const formattedFormNames = useMemo(() => {
    if (!folderForms || !Array.isArray(folderForms)) return [];
    return folderForms.map((form: any) => ({
      ...form,
      createdByDisplay: folderData?.creator
        ? `${folderData.creator.firstName || ""} ${folderData.creator.lastName || ""}`
        : "Unknown",
      updatedAtDisplay: form.updatedAt
        ? dayjs(form.updatedAt).format("MMM D, YYYY, h:mm A")
        : "",
    }));
  }, [folderForms, folderData]);

  const columns = [
    {
      key: "name",
      label: t("formManagement.formName"),
      width: 250,
      minWidth: 200,
      maxWidth: 400,
    },
    {
      key: "type",
      label: t("formManagement.type"),
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      key: "status",
      label: t("formManagement.status"),
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      key: "createdByDisplay",
      label: t("formManagement.createdBy"),
      width: 180,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      key: "updatedAtDisplay",
      label: t("formManagement.updatedAt"),
      width: 200,
      minWidth: 180,
      maxWidth: 250,
    },
    {
      key: "actions",
      label: t("formManagement.actions"),
      width: 150,
      minWidth: 120,
      maxWidth: 180,
      resizable: false,
    },
  ];

  const tableData = useMemo(() => {
    if (!Array.isArray(formattedFormNames)) return [];
    return formattedFormNames.map((form: any) => ({
      ...form,
      actions: (
        <div className="flex items-center gap-2">
          <button className="text-textIcon" onClick={() => openModal(form)}>
            <Icon icon="ic:baseline-edit" fontSize={18} />
          </button>
          <Link to={`/admin/form/design/${form.id}`} className="text-textIcon">
            <Icon
              icon={form.design ? "mdi:file-document-edit" : "gridicons:create"}
              fontSize={18}
            />
          </Link>
          {form.design && (
            <Link to={`/admin/form/${form.id}`} className="text-textIcon">
              <Icon icon="icon-park-solid:preview-open" fontSize={18} />
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-textIcon">
                <Icon icon="ic:baseline-more-vert" fontSize={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem onClick={() => handleDuplicate(form)}>
                <Icon
                  icon="ic:baseline-content-copy"
                  className="mr-2 h-4 w-4"
                />
                {t("formManagement.duplicate")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openBulkModal(form)}>
                <Icon icon="bytesize:upload" className="mr-2 h-4 w-4" />
                Bulk Upload
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }));
  }, [formattedFormNames, t, duplicateFormMutation]);

  if (isFolderPending) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="flex items-center gap-2">
          <Icon icon="eos-icons:loading" className="text-xl" />
          <span>{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  if (!folderData) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Icon
            icon="material-symbols:folder-off"
            className="text-6xl text-gray-400"
          />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {t("folders.folderNotFound")}
            </h3>
            <p className="text-gray-500">
              {t("folders.folderNotFoundDescription")}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate(-1)} variant="outline">
              <Icon icon="material-symbols:arrow-back" className="mr-2" />
              {t("common.goBack")}
            </Button>
            <Button onClick={() => navigate("/admin/form")} variant="outline">
              <Icon icon="material-symbols:home" className="mr-2" />
              {t("folders.backToFolders")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const folder: Folder = folderData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/form")}
          >
            <Icon icon="material-symbols:arrow-back" className="" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Icon
                icon="material-symbols:folder"
                className="text-2xl text-darkBlue"
              />
              {folder.name}
            </h1>
            {folder.description && (
              <p className="text-gray-600 mt-1">{folder.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Forms Table */}
      <div>
        <Table
          paginate
          exportable
          data={tableData}
          columns={columns}
          title={`${folder.name} - ${t("formManagement.formNames")}`}
          exportData={tableData}
          additionalButton={
            <>
              <AddFormNameModal folderId={folderId} />
              <Link to={`/admin/form/upload-track?folderId=${folderId}`}>
                <button
                  type="submit"
                  className="main-dark-button !px-4 float-right"
                >
                  <Icon icon={"bytesize:upload"} className="text-white text-xl" />
                </button>
              </Link>
            </>
          }
        />
        {selectedFormName && (
          <FormNameModal
            mode="edit"
            isOpen={isModalOpen}
            onClose={closeModal}
            formData={selectedFormName}
            onSuccess={closeModal}
          />
        )}
        {selectedFormForBulk && (
          <BulkUploadModal
            isOpen={isBulkModalOpen}
            onClose={closeBulkModal}
            formId={selectedFormForBulk.id}
          />
        )}
      </div>
    </div>
  );
};

export default FormsInFolder;
