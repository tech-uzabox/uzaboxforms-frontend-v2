import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useAuthStore } from "@/store";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useTranslation } from "react-i18next";
import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGenerateQRCode } from "@/hooks/qr-code/use-qr-code";
import { useCreateQrCodeDocument } from "@/hooks/qr-code/use-qr-code-document";
import { useUploadFile, useGetPresignedUrlById } from "@/hooks/upload/use-file";
import { generateQRCodeSchema, GenerateQRCodeFormData } from "@/components/qr-code/qr-code-schemas";

// Set up the PDF.js worker from CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Component to display QR code document using serve by-id API
const QrCodeDocumentDisplay: React.FC<{ fileId: string }> = ({ fileId }) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number | null>(null);
  const { data: fileResponse, isLoading } = useGetPresignedUrlById(fileId);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (isLoading) {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Uploaded Document</h2>
        <div className="flex justify-center items-center h-64 bg-gray-200 rounded">
          Loading document...
        </div>
      </div>
    );
  }

  if (!fileResponse?.presignedUrl) {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Uploaded Document</h2>
        <div className="flex justify-center items-center h-64 bg-gray-200 rounded text-gray-500">
          Document not found
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Uploaded Document</h2>
      <Document
        file={fileResponse.presignedUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex justify-center"
      >
        {Array.from(new Array(numPages), (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={300}
          />
        ))}
      </Document>
      <p className="text-center mt-2">
        <Link
          to={fileResponse.presignedUrl}
          download
          className="text-darkBlue"
        >
          {t("qrCode.downloadPDF")}
        </Link>
      </p>
    </div>
  );
};

const GenerateQrCodePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [qrCodeId, setQrCodeId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [savedDocumentName, setSavedDocumentName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: generateQRCode } = useGenerateQRCode();
  const { mutate: createQrCodeDocument, isPending: isCreatingDocument } =
    useCreateQrCodeDocument();
  const { mutate: uploadFile, isPending: isUploadingFile } = useUploadFile();

  // React Hook Form setup
  const form = useForm<GenerateQRCodeFormData>({
    resolver: zodResolver(generateQRCodeSchema),
    defaultValues: {
      documentName: "",
    },
  });

  const handleGenerateQRCode = form.handleSubmit((data) => {
    console.log("🔍 Form data:", data);
    console.log("🔍 Document name from form:", data.documentName);
    console.log("🔍 Host:", window.location.host);
    
    const requestPayload = {
      documentName: data.documentName,
      host: window.location.host,
    };
    
    console.log("🔍 Request payload:", requestPayload);
    
    generateQRCode(requestPayload, {
      onSuccess: (response) => {
        console.log("✅ QR Code generation success:", response);
        // Handle both response formats: with success wrapper or direct data
        if (response.success && response.qrCodeDataUrl && response.qrCodeId) {
          // Response with success wrapper
          setQrCodeDataUrl(response.qrCodeDataUrl);
          setQrCodeId(response.qrCodeId);
          setSavedDocumentName(data.documentName);
          console.log("✅ Saved document name:", data.documentName);
        } else if (response.qrCodeDataUrl && response.qrCodeId) {
          // Direct response without success wrapper
          setQrCodeDataUrl(response.qrCodeDataUrl);
          setQrCodeId(response.qrCodeId);
          setSavedDocumentName(data.documentName);
          console.log("✅ Saved document name:", data.documentName);
          console.log("✅ QR Code generated successfully!");
        } else {
          console.error("❌ Invalid response format:", response);
        }
      },
      onError: (error) => {
        console.error("❌ QR Code generation error:", error);
      }
    });
  });

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const documentName = savedDocumentName || form.getValues("documentName") || "qrcode";
      const link = document.createElement("a");
      link.href = qrCodeDataUrl;
      link.download = `${documentName}-qrcode.png`;
      link.click();
    }
  };

  const handleUpload = async (file: File) => {
    console.log("🔍 Starting file upload...");
    console.log("🔍 QR Code ID:", qrCodeId);
    console.log("🔍 Saved document name:", savedDocumentName);
    console.log("🔍 Form document name:", form.getValues("documentName"));
    
    if (!qrCodeId) {
      toast.error(t("qrCode.generateQRCodeFirst"));
      return;
    }

    // Validate document name before proceeding
    const documentName = savedDocumentName || form.getValues("documentName");
    console.log("🔍 Final document name:", documentName);
    
    if (!documentName || documentName.trim() === "") {
      toast.error("Document name is required. Please generate a QR code first.");
      return;
    }

    try {
      setIsUploading(true);
      console.log("🔍 Uploading file using new file service...");
      
      // Use the new file service to upload
      uploadFile(
        { file, folder: 'qr-codes' },
        {
          onSuccess: (uploadResponse) => {
            console.log("🔍 Upload response:", uploadResponse);
            
            const documentPayload = {
              documentName: documentName.trim(),
              fileName: uploadResponse.id,
              qrCodeId,
              creatorId: user?.id || "",
            };
            
            console.log("🔍 Creating QR code document with payload:", documentPayload);
            
            // Save the QR code document using the hook
            createQrCodeDocument(documentPayload,
              {
                onSuccess: () => {
                  toast.success("QR code document saved successfully!");
                  setUploadedFileName(uploadResponse.id);
                  form.reset();
                  setQrCodeDataUrl(null);
                  setQrCodeId(null);
                  setSavedDocumentName(""); // Clear saved document name
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                },
                onError: (error) => {
                  toast.error(t("qrCode.failedToSaveDocument"));
                  console.error("QR code document creation error:", error);
                },
              }
            );
            toast.success(t("qrCode.documentUploadedSuccessfully"));
          },
          onError: (error) => {
            console.error("Upload error:", error);
            toast.error(t("qrCode.failedToUploadDocument"));
          }
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(t("qrCode.failedToUploadDocument"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl shadow-darkBlue/5 p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Generate QR Code
        </h1>

        {/* Document Name Input */}
        <div className="mb-4 question-container">
          <label htmlFor="documentName" className="main-label">
            Document Name *
          </label>
          <input
            type="text"
            id="documentName"
            {...form.register("documentName")}
            className={`main-input ${form.formState.errors.documentName ? 'border-red-500' : ''}`}
            placeholder={t("qrCode.enterDocumentName")}
          />
          {form.formState.errors.documentName && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.documentName.message}
            </p>
          )}
        </div>

        {/* Generate QR Code Button */}
        <button
          onClick={handleGenerateQRCode}
          className="main-dark-button w-full cursor-pointer"
          disabled={!form.formState.isValid}
        >
          {t("qrCode.generateQRCodeButton")}
        </button>

        {/* QR Code Display and Download */}
        {qrCodeDataUrl && (
          <div className="mb-4 flex flex-col items-center">
            <img src={qrCodeDataUrl} alt="QR Code" width={200} height={200} />
            <button
              onClick={downloadQRCode}
              className="mt-2 flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <Icon icon="mdi:download" className="mr-1" />
              {t("qrCode.downloadQRCode")}
            </button>
          </div>
        )}

        {/* File Upload */}
        {qrCodeId && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Document with QR Code
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleButtonClick}
                className="px-4 py-2 bg-gray-200 rounded text-sm text-gray-800 hover:bg-gray-300"
                disabled={isUploading || isCreatingDocument || isUploadingFile}
                type="button"
              >
                {isUploading || isCreatingDocument || isUploadingFile
                  ? t("qrCode.processing")
                  : t("qrCode.chooseFile")}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading || isCreatingDocument || isUploadingFile}
              />
            </div>
          </div>
        )}

        {/* Display Uploaded PDF */}
        {uploadedFileName && (
          <QrCodeDocumentDisplay fileId={uploadedFileName} />
        )}
      </div>
    </div>
  );
};

export default GenerateQrCodePage;
