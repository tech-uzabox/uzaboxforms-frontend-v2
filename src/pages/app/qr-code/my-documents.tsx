'use client'
import dayjs from 'dayjs';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store';
import { Link } from 'react-router-dom';
import { Table } from '@/components/table';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useTranslation } from 'react-i18next';
import React, { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useGetQRCodesByCreator } from '@/hooks/qr-code/use-qr-code';
import { DownloadCloudIcon, EyeIcon, MoreVertical, XIcon, LinkIcon } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MyDocumentsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { data, isLoading, error } = useGetQRCodesByCreator(user?.id || '');
  const [numPagesMap, setNumPagesMap] = useState<{ [key: string]: number }>({});
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const host = typeof window !== 'undefined' ? window.location.origin : '';

  const onDocumentLoadSuccess = (fileName: string, { numPages }: { numPages: number }) => {
    setNumPagesMap((prev) => ({ ...prev, [fileName]: numPages }));
  };

  const filteredDocuments = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((doc: any): any => {
      return doc.creatorId
        ? `${doc.creatorId.firstName} ${doc.creatorId.lastName}`.toLowerCase()
        : '';
    });
  }, [data]);

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
      toast.success(t('qrCode.documentLinkCopied'));
    } catch (err) {
      toast.error(t('qrCode.failedToCopyLink'));
    }
  };

  const columns = [
    { key: 'documentName', label: t('qrCode.documentName') },
    { key: 'qrCodeId', label: t('qrCode.qrCodeId') },
    { key: 'creatorName', label: t('qrCode.creator') },
    { key: 'createdAtDisplay', label: t('qrCode.createdAt') },
    { key: 'actions', label: t('qrCode.actions') },
  ];

  const tableData = useMemo(() => {
    return filteredDocuments.map((doc: any): any => ({
      documentName: doc.documentName,
      qrCodeId: doc.qrCodeId,
      creatorName: doc.creatorId
        ? `${doc.creatorId.firstName} ${doc.creatorId.lastName}`
        : 'Unknown',
      createdAtDisplay: doc.createdAt ? dayjs(doc.createdAt).format('MMM D, YYYY, h:mm A') : '',
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
              <button className="p-1 hover:bg-gray-100 rounded-full" aria-label={t("qrCode.documentActions")}>
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
                onClick={() => copyDocumentLink(doc.qrCodeId)}
                className="flex items-center w-full text-gray-700 hover:bg-gray-100"
              >
                <LinkIcon size={16} className="mr-2" />
                {t("qrCode.copyLink")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }));
  }, [filteredDocuments]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-600">{t("qrCode.loadingDocuments")}</div>
      </div>
    );
  }

  if (error) {
    toast.error(t('qrCode.failedToLoadDocuments'));
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-red-600">{t("qrCode.errorLoadingDocuments")}</div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <header className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            My Documents
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4">
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
            title={t("qrCode.documentsByCreator")}
            exportData={tableData}
          />
        )}
      </main>

      {/* Large PDF Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{selectedDoc.documentName}</h2>
              <button onClick={closePreview} className="text-gray-500 hover:text-gray-700">
                <XIcon />
              </button>
            </div>
            <Document
              file={`/api/uploads/${selectedDoc.fileName}`}
              onLoadSuccess={(data) => onDocumentLoadSuccess(selectedDoc.fileName, data)}
              onLoadError={() => toast.error(`${t('qrCode.failedToLoadPDFFor')} ${selectedDoc.documentName}`)}
              loading={<div className="text-gray-500 text-center py-4">{t('qrCode.loadingPDF')}</div>}
              error={<div className="text-red-500 text-center py-4">{t('qrCode.failedToLoadPDF')}</div>}
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
                {t('qrCode.previousPage')}
              </button>
              <span className="text-gray-600">
                {t('qrCode.page')} {currentPage} {t('qrCode.of')} {numPagesMap[selectedDoc.fileName] || 1}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === (numPagesMap[selectedDoc.fileName] || 1)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200"
              >
                {t('qrCode.nextPage')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDocumentsPage;