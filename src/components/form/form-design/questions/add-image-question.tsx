import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import { useFormStore } from '@/store';
import { useTranslation } from 'react-i18next';
import type { QuestionItemProps } from '@/types';
import React, { useState, useRef, useEffect } from 'react';
import { fileService } from '@/services/upload/file.service';
import { useServeFileById } from '@/hooks/upload/use-file';

export const AddImageQuestion: React.FC<QuestionItemProps> = ({ question, questionIndex, sectionIndex, isMinimized }) => {
  const { t } = useTranslation();
  const { sections, updateSection } = useFormStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageName, setImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the hook to get file content and convert to blob URL
  const { 
    data: imageUrl, 
    isLoading: isLoadingImage, 
    error: imageError 
  } = useServeFileById(imageName || '');

  useEffect(() => {
    if (question.image) {
      setImageName(question.image);
    }
  }, [question]);

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await fileService.uploadFile({ file, folder: 'form-design' });
      
      if (response.id) {
        const updatedQuestion = { ...question, image: response.id };
        const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
        updatedSection.questions[questionIndex] = updatedQuestion;
        updateSection(sectionIndex, updatedSection);
        setImageName(response.id);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Uploading image failed');
      }
    } catch (error) {
      toast.error('Uploading image failed');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (fileId: string) => {
    try {
      setIsDeleting(true);
      const response = await fileService.deleteFile(fileId);
      
      if (response.success) {
        const updatedQuestion = { ...question, image: '' };
        const updatedSection = { ...sections[sectionIndex], questions: [...sections[sectionIndex].questions] };
        updatedSection.questions[questionIndex] = updatedQuestion;
        updateSection(sectionIndex, updatedSection);
        setImageName(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        toast.success('Image deleted successfully!');
      } else {
        toast.error('Deleting image failed');
      }
    } catch (error) {
      toast.error('Deleting image failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      uploadImage(selectedFile);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteClick = () => {
    if (imageName) {
      deleteImage(imageName);
    }
  };

  return (
    !isMinimized && (
      <div className="space-y-4">
        {/* Upload Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleButtonClick}
            className="px-4 py-2 rounded bg-[#F1F1F2] font-sm text-sm text-[#000B22] hover:bg-[#E5E5E6] transition-colors"
            style={{ color: isUploading || isDeleting ? 'gray' : 'darkBlue' }}
            disabled={isUploading || isDeleting || !!imageName}
            type="button"
          >
            {!isUploading ? <p className='whitespace-nowrap'>{t('questionDesign.chooseImage')}</p> : <p>{t('questionDesign.uploading')}</p>}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            disabled={isUploading || isDeleting}
          />
          {imageName && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDeleteClick}
                className="px-3 py-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center space-x-1"
                disabled={isDeleting}
                type="button"
              >
                <Icon icon="mdi:bin" className="text-sm" />
                <span className="text-sm">{isDeleting ? 'Deleting...' : 'Remove'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Image Preview */}
        {imageName && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/70">
            {isLoadingImage ? (
              <div className="flex items-center justify-center h-48 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Icon icon="mdi:loading" className="animate-spin text-lg" />
                  <span>Loading image preview...</span>
                </div>
              </div>
            ) : imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Image preview"
                  className="max-w-full max-h-64 object-contain rounded-lg shadow-sm border border-gray-200"
                />
              </div>
            ) : imageError ? (
              <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                <div className="text-center text-gray-500">
                  <Icon icon="mdi:image-broken" className="text-2xl mx-auto mb-2" />
                  <p className="text-sm">Failed to load image preview</p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    )
  );
};