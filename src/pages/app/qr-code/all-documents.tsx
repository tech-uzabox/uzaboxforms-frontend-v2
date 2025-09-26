"use client";
import {
  DownloadCloudIcon,
  Trash2Icon,
  MoreVertical,
  EyeIcon,
  XIcon,
  LinkIcon,
} from "lucide-react";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  useGetAllQRCodes,
  useDeleteQRCode,
} from "@/hooks/qr-code/use-qr-code";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Table } from "@/components/table";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useTranslation } from "react-i18next";
import React, { useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "@react-pdf-viewer/core/lib/styles/index.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const AllDocumentsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetAllQRCodes();
  const { mutate: deleteQRCode, isPending: isDeleting } = useDeleteQRCode();
  const [numPagesMap, setNumPagesMap] = useState<{ [key: string]: number }>({});
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<{
    qrCodeId: string;
    documentName: string;
  } | null>(null);

  const host = typeof window !== "undefined" ? window.location.origin : "";

  const onDocumentLoadSuccess = (
    fileName: string,
    { numPages }: { numPages: number }
  ) => {
    setNumPagesMap((prev) => ({ ...prev, [fileName]: numPages }));
  };

  const filteredDocuments = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((doc: any): any => {
      return doc.creatorId
        ? `${doc.creatorId.firstName} ${doc.creatorId.lastName}`.toLowerCase()
        : "";
    });
  }, [data]);

  const handleDelete = (id: string): void => {
    deleteQRCode(id, {
      onSuccess: () => {
        toast.success(t("qrCode.documentDeletedSuccessfully"));
        setIsDeleteDialogOpen(false);
        setDocToDelete(null);
      },
      onError: () => {
        toast.error(t("qrCode.failedToDeleteDocument"));
        setIsDeleteDialogOpen(false);
        setDocToDelete(null);
      },
    });
  };

  const openDeleteDialog = (qrCodeId: string, documentName: string): void => {
    setDocToDelete({ qrCodeId, documentName });
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = (): void => {
    setIsDeleteDialogOpen(false);
    setDocToDelete(null);
  };

  const openPreview = (doc: any): void => {
    setSelectedDoc(doc);
    setCurrentPage(1);
  };

  const closePreview = (): void => {
    setSelectedDoc(null);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= (numPagesMap[selectedDoc?.fileName] || 1)) {
      setCurrentPage(newPage);
    }
  };

  const copyDocumentLink = async (qrCodeId: string): Promise<void> => {
    try {
      const link = `${host}/document/qr-code/${qrCodeId}`;
      await navigator.clipboard.writeText(link);
      toast.success(t("qrCode.documentLinkCopied"));
    } catch (err) {
      toast.error(t("qrCode.failedToCopyLink"));
    }
  };

  const columns = [
    { key: "documentName", label: t("qrCode.documentName") },
    { key: "creatorName", label: t("qrCode.creator") },
    { key: "createdAtDisplay", label: t("qrCode.createdAt") },
    { key: "actions", label: t("qrCode.actions") },
  ];

  const tableData = useMemo(() => {
    return filteredDocuments.map((doc: any): any => ({
      documentName: doc.documentName,
      qrCodeId: doc.qrCodeId,
      creatorName: doc.creatorId
        ? `${doc.creatorId.firstName} ${doc.creatorId.lastName}`
        : t("qrCode.unknown"),
      createdAtDisplay: doc.createdAt
        ? dayjs(doc.createdAt).format("MMM D, YYYY, h:mm A")
        : "",
      actions: (
        <div className="flex space-x-2">
          <button
            onClick={(): void => openPreview(doc)}
            className="text-gray-600 hover:text-blue-600"
            aria-label={`View ${doc.documentName}`}
          >
            <EyeIcon size={18} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1 hover:bg-gray-100 rounded-full"
                aria-label={t("qrCode.documentActions")}
              >
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  to={`/api/uploads/${doc.fileName}`}
                  download
                  className="flex items-center w-full text-gray-700 hover:bg-gray-100"
                >
                  <DownloadCloudIcon size={16} className="mr-2" />
                  {t("qrCode.downloadPDF")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(): Promise<void> => copyDocumentLink(doc.qrCodeId)}
                className="flex items-center w-full text-gray-700 hover:bg-gray-100"
              >
                <LinkIcon size={16} className="mr-2" />
                {t("qrCode.copyLink")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDeleteDialog(doc.qrCodeId, doc.documentName)}
                disabled={isDeleting}
                className={`flex items-center w-full text-red-600 hover:bg-red-50 ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Trash2Icon size={16} className="mr-2" />
                {t("qrCode.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }));
  }, [filteredDocuments, isDeleting]);

  if (isLoading) {
    return (
      <div className="text-lg font-semibold text-center py-6 text-gray-600">
        {t("qrCode.loadingDocuments")}
      </div>
    );
  }

  if (error) {
    toast.error(t("qrCode.failedToLoadDocuments"));
    return (
      <div className="text-lg font-semibold text-center py-6 text-red-600">
        {t("qrCode.errorLoadingDocuments")}
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 py-4">
        Documents with QR Code
      </h1>
      {/* Main Content */}
      <main className="">
        {filteredDocuments.length === 0 ? (
          <div className="text-center text-lg font-medium text-gray-600 bg-white rounded-lg p-6">
            {t("qrCode.noDocumentsFound")}
          </div>
        ) : (
          <Table
            paginate
            exportable
            data={tableData}
            columns={columns}
            title={t("qrCode.documentsWithQRCode")}
            exportData={tableData}
          />
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("qrCode.deleteDocumentConfirmation")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("qrCode.deleteDocumentDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => docToDelete && handleDelete(docToDelete.qrCodeId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("qrCode.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Large PDF Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedDoc.documentName}
              </h2>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon />
              </button>
            </div>
            <Document
              file={`/api/uploads/${selectedDoc.fileName}`}
              onLoadSuccess={(data) =>
                onDocumentLoadSuccess(selectedDoc.fileName, data)
              }
              onLoadError={() =>
                toast.error(
                  `${t("qrCode.failedToLoadPDFFor")} ${selectedDoc.documentName}`
                )
              }
              loading={
                <div className="text-gray-500 text-center py-4">
                  {t("qrCode.loadingPDF")}
                </div>
              }
              error={
                <div className="text-red-500 text-center py-4">
                  {t("qrCode.failedToLoadPDF")}
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={700}
                className="mx-auto mb-4 border border-gray-200 rounded"
              />
            </Document>
            <div className="flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200"
              >
                {t("qrCode.previousPage")}
              </button>
              <span className="text-gray-600">
                {t("qrCode.page")} {currentPage} {t("qrCode.of")} {numPagesMap[selectedDoc.fileName] || 1}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === (numPagesMap[selectedDoc.fileName] || 1)
                }
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200"
              >
                {t("qrCode.nextPage")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDocumentsPage;
