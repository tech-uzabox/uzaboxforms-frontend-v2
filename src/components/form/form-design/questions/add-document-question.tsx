import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';
import React, { useState, useRef, useEffect } from 'react';
import { fileService } from '@/services/upload/file.service';

export const AddDocumentQuestion: React.FC<QuestionItemProps> = ({ question, questionIndex, sectionIndex, isMinimized }) => {
  const { t } = useTranslation();
  const { sections, updateSection } = useFormStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize documentName from question.document
  useEffect(() => {
    if (question.document) {
      setDocumentName(question.document);
    }
  }, [question.document]);

  const uploadDocument = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await fileService.uploadFile({ file, folder: 'form-design' });
      
      if (response.id) {
        const updatedQuestion = { ...question, document: response.id };
        const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
        updatedSection.questions[questionIndex] = updatedQuestion;
        updateSection(sectionIndex, updatedSection);
        toast.success('Document uploaded successfully!');
        setDocumentName(response.id);
      } else {
        toast.error('Uploading document failed');
      }
    } catch (error) {
      console.error('Upload error', error);
      toast.error('Uploading document failed');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = async (fileId: string) => {
    try {
      setIsDeleting(true);
      const response = await fileService.deleteFile(fileId);
      
      if (response.success) {
        const updatedQuestion = { ...question, document: '' };
        const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
        updatedSection.questions[questionIndex] = updatedQuestion;
        updateSection(sectionIndex, updatedSection);
        toast.success('Document deleted successfully!');
        setDocumentName(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error('Deleting document failed');
      }
    } catch (error) {
      console.error('Delete error', error);
      toast.error('Deleting document failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      uploadDocument(selectedFile);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteClick = () => {
    if (documentName) {
      deleteDocument(documentName);
    }
  };

  return (
    !isMinimized && (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <button
            onClick={handleButtonClick}
            className="px-4 py-2 rounded bg-[#F1F1F2] font-sm text-sm text-[#000B22]"
            style={{ color: isUploading || isDeleting ? 'gray' : 'darkBlue' }}
            disabled={isUploading || isDeleting || !!documentName}
            type="button"
          >
            {!isUploading ? <p>{t('questionDesign.chooseFile')}</p> : <p>{t('questionDesign.uploading')}</p>}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={handleChange}
            disabled={isUploading || isDeleting}
          />
          {documentName && (
            <div className="flex items-center space-x-2 min-w-0">
              <div
                className="min-w-0 max-w-[200px] sm:max-w-[300px] overflow-hidden"
                title={documentName}
              >
                <p className="text-sm truncate">{documentName || t('questionDesign.noFileChosen')}</p>
              </div>
              <button
                onClick={handleDeleteClick}
                className="text-[#FF7C72] flex-shrink-0"
                disabled={isDeleting}
                type="button"
              >
                <Icon icon="mdi:bin" className="text-lg" />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
};