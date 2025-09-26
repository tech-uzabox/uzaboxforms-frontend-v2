import React from "react";
import dayjs from "dayjs";
import { Button } from "../ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ViewProcessFormsModalProps } from "@/types/process.types";

const ViewProcessFormsModal: React.FC<ViewProcessFormsModalProps> = ({
  isOpen,
  onClose,
  forms,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-500"
        >
          &times;
        </button>
      </DialogTrigger>
      <DialogContent className="sm:rounded-md max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl font-semibold">
            {t("processManagement.processForms")}
          </DialogTitle>
          <DialogDescription>
            {t("processManagement.viewProcessFormsDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-x-auto">
          {forms.length > 0 ? (
            <table className="w-full bg-white table-auto">
              <thead className="bg-subprimary text-primary font-normal text-sm sm:text-base rounded-t-lg">
                <tr>
                  <th className="main-th p-2">#</th>
                  <th className="main-th p-2">
                    {t("processManagement.formName")}
                  </th>
                  <th className="main-th p-2">
                    {t("processManagement.status")}
                  </th>
                  <th className="main-th p-2">
                    {t("processManagement.createdAt")}
                  </th>
                  <th className="main-th p-2">
                    {t("processManagement.updatedAt")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm sm:text-base font-light">
                {forms.map((processForm) => (
                  <tr
                    key={processForm.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="main-td p-2">{processForm.order}</td>
                    <td className="main-td p-2">{processForm.form.name}</td>
                    <td className="main-td p-2 capitalize">
                      {processForm.form.status}
                    </td>
                    <td className="main-td p-2">
                      {dayjs(processForm.form.createdAt).format(
                        "MMM D, YYYY, h:mm A"
                      )}
                    </td>
                    <td className="main-td p-2">
                      {dayjs(processForm.form.updatedAt).format(
                        "MMM D, YYYY, h:mm A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600">
              {t("processManagement.noFormsAvailableForThisProcess")}
            </p>
          )}
        </div>
        <div className="p-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            {t("processManagement.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProcessFormsModal;
