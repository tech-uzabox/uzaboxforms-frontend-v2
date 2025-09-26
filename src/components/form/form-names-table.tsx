import dayjs from "dayjs";
import { toast } from "sonner";
import { formStore } from "@/store";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Table } from "@/components/table";
import { useTranslation } from 'react-i18next';
import React, { useMemo, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useDuplicateForm } from "@/hooks/form/use-form";
import { AddFormNameModal, FormNameModal } from "./add-edit-form-name-modal";
import BulkUploadModal from "./bulk-upload-modal";

const FormNameTable: React.FC = () => {
  const { t } = useTranslation();
  const { formList } = formStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormName, setSelectedFormName] = useState<any>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedFormForBulk, setSelectedFormForBulk] = useState<any>(null);
  const duplicateFormMutation = useDuplicateForm();

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

  const formattedFormNames = useMemo(() => {
    if (!formList || !Array.isArray(formList)) return [];
    return formList.map((form: any) => ({
      ...form,
      createdByDisplay: `${form.createdBy?.firstName || ''} ${form.createdBy?.lastName || ''}`,
      updatedAtDisplay: form.updatedAt ? dayjs(form.updatedAt).format("MMM D, YYYY, h:mm A") : '',
    }));
  }, [formList]);

  const columns = [
    { key: "name", label: t('formManagement.formName'), width: 250, minWidth: 200, maxWidth: 400 },
    { key: "type", label: t('formManagement.type'), width: 120, minWidth: 100, maxWidth: 150 },
    { key: "status", label: t('formManagement.status'), width: 120, minWidth: 100, maxWidth: 150 },
    { key: "createdByDisplay", label: t('formManagement.createdBy'), width: 180, minWidth: 150, maxWidth: 250 },
    { key: "updatedAtDisplay", label: t('formManagement.updatedAt'), width: 200, minWidth: 180, maxWidth: 250 },
    { key: "actions", label: t('formManagement.actions'), width: 150, minWidth: 120, maxWidth: 180, resizable: false },
  ];

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
      toast.error(t('formManagement.updatingFormNameFailed'));
    }
  };

  const tableData = useMemo(() => {
    if (!Array.isArray(formattedFormNames)) return [];
    return formattedFormNames.map((form: any) => ({
    ...form,
    actions: (
      <div className="flex items-center gap-2">
        <button className="text-textIcon" onClick={() => openModal(form)}>
          <Icon icon="ic:baseline-edit" fontSize={18} />
        </button>
        <Link
          to={`/admin/form/design/${form.id}`}
          className="text-textIcon"
        >
          <Icon icon={form.design ? "mdi:file-document-edit" : "gridicons:create"} fontSize={18} />
        </Link>
        {form.design && (
          <Link
            to={`/admin/form/${form.id}`}
            className="text-textIcon"
          >
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
              <Icon icon="ic:baseline-content-copy" className="mr-2 h-4 w-4" />
              {t('formManagement.duplicate')}
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
  }, [formattedFormNames, t, user?.id, duplicateFormMutation]);

  return (
    <div>
      <Table
        paginate
        exportable
        data={tableData}
        columns={columns}
        title={t('formManagement.formNames')}
        exportData={tableData}
        additionalButton={
          <>
            <AddFormNameModal />
            <Link to={"/admin/form/upload-track"}>
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
  );
};

export default FormNameTable;
