import dayjs from "dayjs";
import { toast } from "sonner";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Table } from "@/components/table";
import { MoreVertical } from "lucide-react";
import AddButton from "../button/add-button";
import { useDuplicateProcess } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Process } from "@/types/process.types";
import { Icon } from "@iconify/react/dist/iconify.js";
import ViewProcessFormsModal from "./view-process-forms-modal";
import { AddEditProcessModal } from "./add-edit-process-modal";

const ProcessTable = ({
  processes,
  status,
}: {
  processes: Process[];
  status?: "ENABLED" | "DISABLED";
}) => {
  const { t } = useTranslation();
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const duplicateProcessMutation = useDuplicateProcess();

  const handleEditOpen = (process: Process) => {
    setSelectedProcess(process);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedProcess(null);
  };

  const handleAddOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddClose = () => {
    setAddDialogOpen(false);
  };

  const [isFormsModalOpen, setFormsModalOpen] = useState(false);
  const [selectedForms, setSelectedForms] = useState<any[]>([]);

  const handleFormsOpen = (forms: any[]) => {
    setSelectedForms(forms);
    setFormsModalOpen(true);
  };

  const handleFormsClose = () => {
    setFormsModalOpen(false);
    setSelectedForms([]);
  };

  const handleDuplicate = async (process: Process) => {
    try {
      const response = await duplicateProcessMutation.mutateAsync({
        id: process.id,
      });
      if (response) {
        toast.success(t('common.processUpdatedSuccessfully'));
      } else {
        toast.error(t('common.operationFailed'));
      }
    } catch (error) {
      toast.error(t("processManagement.failedToDuplicateProcess"));
    }
  };

  const columns = [
    { key: "name", label: t("processManagement.processName"), width: 200 },
    { key: "groupName", label: t("processManagement.groupName"), width: 150 },
    { key: "type", label: t("processManagement.type"), width: 100 },
    { key: "status", label: t("processManagement.status"), width: 100 },
    { key: "createdBy", label: t("processManagement.createdBy"), width: 150 },
    { key: "updatedAt", label: t("processManagement.updatedAt"), width: 120 },
    { key: "actions", label: t("processManagement.actions"), width: 100 },
  ];

  const tableData = (processes && Array.isArray(processes) ? processes : [])
    .filter((process: Process) => process.status === (status || "ENABLED"))
    .map((process: Process) => ({
      ...process,
      groupName: process.group?.name || "",
      createdBy: `${process.creator?.firstName || ""} ${
        process.creator?.lastName || ""
      }`.trim(),
      updatedAt: process.updatedAt
        ? dayjs(process.updatedAt).format("DD-MMM-YYYY")
        : "",
      actions: (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-[#494C52]"
            onClick={() => handleEditOpen(process)}
          >
            <Icon icon="ic:baseline-edit" fontSize={18} />
          </button>
          <Link
            to={`/admin/process/process-design/${process.id}`}
            className="text-[#494C52]"
          >
            <Icon icon="mdi:file-document-edit" fontSize={18} />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="text-[#494C52] focus:outline-none">
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => handleFormsOpen(process.forms || [])}
              >
                <Icon icon="mdi:eye-outline" className="mr-2 h-4 w-4" />
                {t("processManagement.viewForms")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={duplicateProcessMutation.isPending}
                onClick={() => handleDuplicate(process)}
              >
                <Icon icon="mdi:content-copy" className="mr-2 h-4 w-4" />
                {duplicateProcessMutation.isPending
                  ? t("processManagement.duplicating")
                  : t("processManagement.duplicate")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }));

  return (
    <div className="overflow-x-hidden w-full">
      <Table
        paginate
        exportable
        data={tableData}
        columns={columns}
        title={t("sidebar.processNames")}
        exportData={tableData}
        additionalButton={
          <AddButton
            handleClick={handleAddOpen}
            hoverText={t("processManagement.addProcessName")}
          />
        }
      />

      {/* Add Process Modal */}
        <AddEditProcessModal
        mode="add"
        isOpen={isAddDialogOpen}
        onClose={handleAddClose}
      />

      {/* Edit Process Modal */}
      {selectedProcess && (
        <AddEditProcessModal
          mode="edit"
          isOpen={isEditDialogOpen}
          onClose={handleEditClose}
          selectedProcess={selectedProcess}
        />
      )}

      <ViewProcessFormsModal
        isOpen={isFormsModalOpen}
        onClose={handleFormsClose}
        forms={selectedForms}
      />
    </div>
  );
};

export default ProcessTable;
