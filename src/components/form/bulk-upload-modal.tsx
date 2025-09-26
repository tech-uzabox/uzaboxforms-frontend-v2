"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBulkCreateApplicantProcess } from "@/hooks/process/use-applicant-process";
import { useGetProcessesByFormId } from "@/hooks/process/use-process";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Upload,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  formId,
}) => {
  const [selectedProcessId, setSelectedProcessId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bulkResult, setBulkResult] = useState<any>(null);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  const { data: processes, isLoading: isLoadingProcesses } =
    useGetProcessesByFormId(formId);
  const bulkCreateMutation = useBulkCreateApplicantProcess();

  const handleBulkSubmit = async () => {
    if (!selectedProcessId) {
      toast.error("Please select a process");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select an Excel file");
      return;
    }

    setIsBulkSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("excelFile", selectedFile);
      formData.append("processId", selectedProcessId);
      formData.append("formId", formId);

      const result = await bulkCreateMutation.mutateAsync(formData);
      setBulkResult(result);
      setSelectedFile(null);

      if (result.success) {
        toast.success(
          `Bulk submission completed: ${result.results.successful} successful, ${result.results.failed} failed`
        );
      } else {
        toast.error("Bulk submission failed");
      }
    } catch (error: any) {
      console.error("Bulk submission error:", error);
      toast.error(error?.response?.data?.message || "Bulk submission failed");
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid Excel file (.xls, .xlsx, .xlsm)");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast.error("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleClose = () => {
    setBulkResult(null);
    setSelectedFile(null);
    setSelectedProcessId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Application Submission</DialogTitle>
        </DialogHeader>

        {!bulkResult ? (
          <div className="space-y-4">
            {isLoadingProcesses ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Loading processes...</p>
              </div>
            ) : processes?.data && processes?.data?.length > 0 ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Select Process
                </label>
                <Select value={selectedProcessId} onValueChange={setSelectedProcessId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a process" />
                  </SelectTrigger>
                  <SelectContent>
                    {processes?.data?.map((process: any) => (
                      <SelectItem key={process.id} value={process.id}>
                        {process.processName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-red-500">
                  No processes found for this form. Please create a process first.
                </p>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload Excel file
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".xls,.xlsx,.xlsm"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  XLS, XLSX, XLSM up to 10MB
                </p>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-800">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-blue-600 ml-auto">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded">
              <h4 className="font-medium text-yellow-800 mb-2">
                Excel Format Requirements:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • First row should contain column headers matching question
                  labels
                </li>
                <li>
                  • Each subsequent row represents one application submission
                </li>
                <li>
                  • Column names are matched flexibly (case-insensitive, partial
                  matches)
                </li>
                <li>
                  • All submissions will be created for the current logged-in
                  user
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleBulkSubmit}
                disabled={!selectedProcessId || !selectedFile || isBulkSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isBulkSubmitting ? "Processing..." : "Upload & Submit"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bulkResult.success ? (
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-2 text-lg font-medium text-green-800">
                  Bulk Submission Completed
                </h3>
                <p className="mt-1 text-sm text-green-600">
                  {bulkResult.results.successful} successful,{" "}
                  {bulkResult.results.failed} failed
                </p>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-2 text-lg font-medium text-red-800">
                  Submission Failed
                </h3>
              </div>
            )}

            {bulkResult.errors && bulkResult.errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded">
                <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Validation Errors
                </h4>
                <div className="max-h-40 overflow-y-auto">
                  {bulkResult.errors.map((error: any, index: number) => (
                    <div key={index} className="text-sm text-red-700 mb-2">
                      <strong>
                        Row {error.row}, Column: {error.column}
                      </strong>
                      <br />
                      {error.error}
                      {error.suggestion && (
                        <>
                          <br />
                          <em>Suggestion: {error.suggestion}</em>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bulkResult.results?.details && (
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium text-gray-800 mb-2">
                  Submission Details
                </h4>
                <div className="max-h-40 overflow-y-auto text-sm">
                  {bulkResult.results.details.map(
                    (detail: any, index: number) => (
                      <div
                        key={index}
                        className={`mb-1 ${
                          detail.success ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        Row {detail.rowNumber}:{" "}
                        {detail.success ? "Success" : detail.error}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setBulkResult(null);
                  setSelectedFile(null);
                }}
              >
                Upload Another
              </Button>
              <Button
                onClick={handleClose}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadModal;
