import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useFormResponseStore } from '@/store';
import React, { useState, useEffect, useRef } from 'react';
import { fileService } from '@/services/upload/file.service';
import { useServeFileById } from '@/hooks/upload/use-file';
import {
  ImagePreview,
  PdfPreview,
  DocumentPreview,
  SpreadsheetPreview,
  PresentationPreview,
  AudioPreview,
  VideoPreview
} from './previews';

interface UploadProps {
  question: any;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const UploadAnswer: React.FC<UploadProps> = ({ question, sectionId, sectionName, setValidationErrors }) => {
  const { t } = useTranslation();
  const { setResponse, formResponses } = useFormResponseStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the hook to get file content for preview
  const { 
    data: fileUrl, 
    isLoading: isLoadingFile, 
    error: fileError 
  } = useServeFileById(fileName || '');

  const allowedTypesMap: Record<string, string[]> = {
    pdf: ['application/pdf'],
    image: ['image/jpeg', 'image/png', 'image/gif'],
    document: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    presentation: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    audio: ['audio/mpeg', 'audio/wav'],
    video: ['video/mp4', 'video/mpeg'],
  };

  useEffect(() => {
    const existingSection = formResponses[sectionId];
    const existingResponse = existingSection?.questions[question.id]?.response;
    setFileName(existingResponse || null);

    if (question.required === 'yes' && !existingResponse) {
      setValidationErrors(sectionId, question.id, t('forms.fileRequired'));
    }
  }, []);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await fileService.uploadFile({ file, folder: 'form-answer' });

      if (response.id) {
        setResponse(
          sectionId,
          sectionName,
          question.id,
          question.type,
          question.label,
          response.id
        );

        setFileName(response.id);

        if (question.required === 'yes' && !response.id) {
          setValidationErrors(sectionId, question.id, t('forms.fileRequired'));
        } else {
          setValidationErrors(sectionId, question.id, null);
        }

        toast.success('File uploaded successfully!');
      } else {
        toast.error(t('forms.uploadingFileFailed'));
        setValidationErrors(sectionId, question.id, t('forms.uploadingFileFailed'));
      }
    } catch (error) {
      console.error('Upload error', error);
      toast.error(t('forms.uploadingFileFailed'));
      setValidationErrors(sectionId, question.id, t('forms.uploadingFileFailed'));
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      setIsDeleting(true);
      const response = await fileService.deleteFile(fileId);

      if (response.success) {
        setResponse(
          sectionId,
          sectionName,
          question.id,
          question.type,
          question.label,
          ''
        );

        setFileName(null);
        setValidationErrors(sectionId, question.id, null);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        toast.success('File deleted successfully!');
      } else {
        toast.error(t('forms.deletingFileFailed'));
        setValidationErrors(sectionId, question.id, t('forms.deletingFileFailed'));
      }
    } catch (error) {
      console.error('Delete error', error);
      toast.error(t('forms.deletingFileFailed'));
      setValidationErrors(sectionId, question.id, t('forms.deletingFileFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = allowedTypesMap[question.documentType] || [];

      // Validate file type
      if (!allowedTypes.includes(selectedFile.type)) {
        setValidationErrors(sectionId, question.id, `File type must be ${question.documentType}`);
        toast.error(`File type must be ${question.documentType}`);
        return;
      }

      // Validate file size
      if (question.maxFileSize && selectedFile.size > question.maxFileSize * 1024 * 1024) {
        setValidationErrors(sectionId, question.id, `File must be less than ${question.maxFileSize} MB`);
        toast.error(`File must be less than ${question.maxFileSize} MB`);
        return;
      }

      setValidationErrors(sectionId, question.id, null);
      uploadFile(selectedFile);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteClick = () => {
    if (fileName) {
      deleteFile(fileName);
    }
  };

  const renderFilePreview = () => {
    if (isLoadingFile) {
      return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/70">
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center space-x-2 text-gray-500">
              <Icon icon="mdi:loading" className="animate-spin text-lg" />
              <span>Loading preview...</span>
            </div>
          </div>
        </div>
      );
    }

    if (fileError || !fileUrl) {
      return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/70">
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <Icon icon="mdi:file-alert" className="text-2xl mx-auto mb-2" />
              <p className="text-sm">Failed to load preview</p>
            </div>
          </div>
        </div>
      );
    }

    const previewProps = { fileUrl, fileName: fileName || 'Unknown file' };

    switch (question.documentType) {
      case 'image':
        return <ImagePreview {...previewProps} />;
      case 'pdf':
        return <PdfPreview {...previewProps} />;
      case 'document':
        return <DocumentPreview {...previewProps} />;
      case 'spreadsheet':
        return <SpreadsheetPreview {...previewProps} />;
      case 'presentation':
        return <PresentationPreview {...previewProps} />;
      case 'audio':
        return <AudioPreview {...previewProps} />;
      case 'video':
        return <VideoPreview {...previewProps} />;
      default:
        return (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/70">
            <div className="flex items-center space-x-3">
              <Icon icon="mdi:file" className="text-4xl text-gray-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate" title={fileName || undefined}>
                  {fileName}
                </p>
                <p className="text-xs text-gray-500">File</p>
              </div>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label className="main-label">
          {question.label} {question.required == 'yes' && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center space-x-4 mt-1">
          <button
            onClick={handleButtonClick}
            className="px-4 py-2 rounded bg-[#F1F1F2] font-sm text-sm text-[#000B22] hover:bg-[#E5E5E6] transition-colors"
            style={{ color: isUploading || isDeleting ? 'gray' : 'darkBlue' }}
            disabled={isUploading || isDeleting || !!fileName}
            type="button"
          >
            {!isUploading ? <p>Choose File</p> : <p>Uploading...</p>}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypesMap[question.documentType]?.join(',') || '*/*'}
            className="hidden"
            onChange={handleChange}
            disabled={isUploading || isDeleting}
          />
          <div className="truncate text-sm text-[#494C52]">
            <p>{fileName ? fileName : `No file chosen / ${question.documentType}`}</p>
          </div>
          {fileName && (
            <button
              onClick={handleDeleteClick}
              className="text-[#FF7C72] hover:text-red-600 transition-colors"
              disabled={isDeleting}
              type='button'
            >
              <Icon icon="mdi:bin" className="text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* File Preview */}
      {fileName && renderFilePreview()}
    </div>
  );
};
