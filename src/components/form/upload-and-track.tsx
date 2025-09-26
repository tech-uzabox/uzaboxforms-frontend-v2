import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useGetJobStatus, useUploadMultipleFiles, useGetFolderById } from "@/hooks";
import { useBreadcrumbStore } from "@/store/ui";
import { AlertCircle, CheckCircle, UploadCloud } from "lucide-react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

const UploadAndTrack = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('folderId');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [jobIds, setJobIds] = useState<{ id: string; name: string }[]>([]);
  const uploadMutation = useUploadMultipleFiles();
  
  // Fetch folder data to display folder name
  const { data: folderData, isError: isFolderError, isLoading: isFolderLoading } = useGetFolderById(folderId || "");

  const { setCustomBreadcrumbItems } = useBreadcrumbStore();

  // Set custom breadcrumbs with folder name
  useEffect(() => {
    if (folderData) {
      setCustomBreadcrumbItems([
        { name: t('sidebar.home'), href: '/' },
        { name: t('sidebar.forms'), href: '/admin/form' },
        { name: folderData.name, href: `/admin/form/folder/${folderId}` },
        { name: t('formManagement.uploadForms'), href: '' }
      ]);
    } else {
      setCustomBreadcrumbItems(null);
    }
  }, [folderData, folderId, t, setCustomBreadcrumbItems]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setCustomBreadcrumbItems(null);
    };
  }, [setCustomBreadcrumbItems]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    // Prevent upload if folder is not found
    if (isFolderError || !folderData) {
      toast.error(t("folders.folderNotFound"));
      return;
    }

    try {
      const data = await uploadMutation.mutateAsync({ 
        files: selectedFiles, 
        folder: folderId || undefined 
      });
      setJobIds(data);
      toast.success(t("common.filesUploadedSuccessfully"));
    } catch (error: any) {
      toast.error(t("common.filesUploadFailed"));
    }
  };

  return (
    <div className="pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-textHeading tracking-tight">
            {t("formManagement.uploadMultipleFilesToAI")}
          </h1>
          <p className="mt-3 text-lg text-textmain">
            {t("formManagement.seamlesslyUploadFiles")}
          </p>
          {folderId && (
            <div className="mt-4">
              {isFolderError ? (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <Icon icon="material-symbols:error" className="mr-2" />
                  {t("folders.folderNotFound")}
                </div>
              ) : isFolderLoading ? (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <Icon icon="eos-icons:loading" className="mr-2" />
                  {t("common.loading")}
                </div>
              ) : (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Icon icon="material-symbols:folder" className="mr-2" />
                  {t("folders.uploadingToFolder")}: {folderData?.name || folderId}
                </div>
              )}
            </div>
          )}
        </header>

        {/* Error Section */}
        {(!folderId || isFolderError) && (
          <div className="rounded-xl p-8 mb-8 border border-red-200 bg-red-50">
            <div className="flex items-center justify-center space-y-4">
              <div className="text-center">
                <Icon icon="material-symbols:error" className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  {!folderId ? t("folders.noFolderSpecified") : t("folders.folderNotFound")}
                </h3>
                <p className="text-red-600 mb-4">
                  {!folderId ? t("folders.noFolderSpecifiedDescription") : t("folders.folderNotFoundDescription")}
                </p>
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Icon icon="material-symbols:arrow-back" className="mr-2" />
                  {t("common.goBack")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {folderId && !isFolderError && (
          <div className="rounded-xl p-8 mb-8 border border-sidebar-border">
            <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={isFolderError || !folderData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-all duration-300 ${
                  isFolderError || !folderData
                    ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                    : "border-primary bg-white hover:bg-subprimary hover:border-darkBlue cursor-pointer"
                }`}
              >
                <UploadCloud className="w-12 h-12 text-primary mb-4" />
                <span className="text-lg font-medium text-textmain">
                  {selectedFiles.length > 0
                    ? t("formManagement.filesSelected", {
                        count: selectedFiles.length,
                        plural: selectedFiles.length > 1 ? "s" : "",
                      })
                    : t("formManagement.dragAndDropFiles")}
                </span>
                <span className="text-sm text-textIcon mt-2">
                  {t("formManagement.supportsMultipleFileTypes")}
                </span>
              </label>
            </div>
            <Button
              disabled={uploadMutation.isPending || selectedFiles.length === 0 || isFolderError || !folderData}
              onClick={handleUpload}
              className="bg-primary text-white hover:bg-darkBlue transition-colors duration-200 px-8 py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploadMutation.isPending ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                    />
                  </svg>
                  {t("formManagement.uploading")}
                </span>
              ) : (
                t("formManagement.uploadFiles")
              )}
            </Button>
            </div>
          </div>
        )}

        {/* Status Tracking Section */}
        {jobIds.length > 0 && (
          <div className="rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-textHeading mb-6">
              {t("formManagement.processingStatus")}
            </h2>
            <ul className="space-y-4">
              {jobIds.map((jobId) => (
                <JobStatusItem key={jobId.id} {...jobId} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const JobStatusItem = ({ id, name }: { id: string; name: string }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetJobStatus(id);
  const [formId, setFormId] = useState<string | null>(null);
  useEffect(() => {
    if (data?.result) {
      setFormId(data?.result?.formId);
    }
  }, [data]);
  const navigate = useNavigate();
  return (
    <li
      className={cn(
        "bg-white p-4 rounded-lg  border border-sidebar-border transition-all duration-200",
        formId && "cursor-pointer hover:shadow-md"
      )}
      onClick={
        formId
          ? () => {
              navigate(`/admin/form/${formId}`);
            }
          : undefined
      }
    >
      <div className="flex items-center space-x-4">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-primary"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
              />
            </svg>
            <span className="text-textmain">
              {t("formManagement.loadingStatusFor", { name })}
            </span>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <p className="font-medium text-textHeading">
                {t("formManagement.file", { name })}
              </p>
              <p className="text-textmain">
                {t("formManagement.statusLabel")}{" "}
                <span
                  className={`uppercase font-semibold ${
                    data?.state === "completed"
                      ? "text-green-600"
                      : data?.state === "failed"
                      ? "text-red-600"
                      : "text-primary"
                  }`}
                >
                  {data?.state || "-"}
                </span>
              </p>
              <p className="text-textmain">
                {t("formManagement.progress", {
                  progress: data?.progress ?? 0,
                })}
              </p>
              {data?.failedReason && (
                <p className="text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {t("formManagement.failedReason", {
                    reason: data.failedReason,
                  })}
                </p>
              )}
              {/* {data?.result && (
                <p className="text-textmain flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Result: {JSON.stringify(data.result)}
                </p>
              )} */}
            </div>
            {data?.state === "completed" && (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
            {data?.state === "failed" && (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
          </>
        )}
      </div>
    </li>
  );
};

export default UploadAndTrack;