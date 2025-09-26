import { toast } from 'sonner';
import type { QuestionTypes } from '@/types';
import { useTranslation } from 'react-i18next';
import { useFormResponseStore } from '@/store';
import SignatureCanvas from 'react-signature-canvas';
import { SignatureChoice } from './signature-choice';
import { fileService } from '@/services/upload/file.service';
import React, { type FC, useState, useRef, useEffect } from 'react';

interface SignatureProps {
  question: QuestionTypes;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (sectionId: string, questionId: string, error: string | null) => void;
}

export const SignatureAnswer: FC<SignatureProps> = ({ question, sectionId, sectionName, setValidationErrors }) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState<string>('');
  const [choice, setChoice] = useState<'draw' | 'upload' | null>(null);
  const signCanvasRef = useRef<SignatureCanvas | null>(null);
  const { setResponse, formResponses } = useFormResponseStore();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to check if signature is valid
  const isSignatureValid = () => {
    // Must have a choice selected AND a signature
    if (!choice) return false;
    return !!(fileName || url);
  };

  // Helper function to update validation state
  const updateValidationState = () => {
    if (question.required === 'yes') {
      if (isSignatureValid()) {
        setValidationErrors(sectionId, question.id, null);
      } else {
        setValidationErrors(sectionId, question.id, t('forms.signatureRequired'));
      }
    } else {
      setValidationErrors(sectionId, question.id, null);
    }
  };

  useEffect(() => {
    const existingSection = formResponses[sectionId];
    const existingResponse = existingSection?.questions[question.id]?.response;
    
    if (existingResponse) {
      // Check if it's a signature object with choice and data
      if (typeof existingResponse === 'object' && existingResponse.choice) {
        setChoice(existingResponse.choice);
        if (existingResponse.choice === 'draw' && existingResponse.signatureData) {
          setUrl(existingResponse.signatureData);
        } else if (existingResponse.choice === 'upload' && existingResponse.fileName) {
          setFileName(existingResponse.fileName);
        }
      } else {
        // Legacy format - just filename
        setFileName(existingResponse);
      }
    }

    // Update validation state after setting data
    setTimeout(() => updateValidationState(), 0);
  }, [formResponses, question.id, question.required, sectionId, setValidationErrors]);

  // Watch for changes in signature state and update validation
  useEffect(() => {
    updateValidationState();
  }, [fileName, url, question.required, choice]);

  // Restore drawn signature to canvas when coming back to section
  useEffect(() => {
    if (choice === 'draw' && url && signCanvasRef.current) {
      const canvas = signCanvasRef.current.getCanvas();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = url;
      }
    }
  }, [choice, url]);

  const handleClear = () => {
    if (signCanvasRef.current) {
      signCanvasRef.current.clear();
      setUrl('');
      
      // Clear the stored signature data
      if (choice === 'draw') {
        const signatureData = {
          choice: 'draw',
          fileName: '',
          signatureData: ''
        };
        
        setResponse(
          sectionId,
          sectionName,
          question.id,
          question.type,
          question.label as string,
          signatureData
        );
      }
      
      updateValidationState();
    }
  };

  const handleGenerate = () => {
    if (signCanvasRef.current) {
      try {
        const canvas = signCanvasRef.current.getCanvas();
        if (signCanvasRef.current.isEmpty()) {
          toast.error(t('forms.pleaseDrawSignatureFirst'));
          if (question.required === 'yes') {
            setValidationErrors(sectionId, question.id, t('forms.signatureRequired'));
          }
          return;
        }

        const dataUrl = canvas.toDataURL('image/png');
        setUrl(dataUrl);
        
        // Clear any existing upload data when saving new drawn signature
        setFileName(null);
        
        // Store the drawn signature data
        const signatureData = {
          choice: 'draw',
          fileName: '',
          signatureData: dataUrl
        };
        
        setResponse(
          sectionId,
          sectionName,
          question.id,
          question.type,
          question.label as string,
          signatureData
        );
        
        updateValidationState();
        // Convert canvas data to file and upload to server
        saveSignature(dataUrl);
      } catch (error) {
        console.error('Error generating signature:', error);
        toast.error('Failed to generate signature');
      }
    }
  };

  const saveSignature = async (dataUrl: string) => {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'signature.png', { type: 'image/png' });
      uploadFile(file, true); // Pass true to indicate this is a drawn signature
    } catch (error) {
      console.error('Saving signature failed:', error);
      toast.error('Saving signature failed');
    }
  };

  const uploadFile = async (file: File, isDrawnSignature: boolean = false) => {
    try {
      setIsUploading(true);
      const response = await fileService.uploadFile({ file, folder: 'form-answer' });

      if (response.id) {
        if (isDrawnSignature) {
          // Handle drawn signature upload
          setFileName(response.id);
          
          // Store complete signature data including choice
          const signatureData = {
            choice: 'draw',
            fileName: response.id,
            signatureData: ''
          };
          
          setResponse(
            sectionId,
            sectionName,
            question.id,
            question.type,
            question.label as string,
            signatureData
          );
          
          toast.success('Signature drawn and saved successfully!');
        } else {
          // Handle regular file upload
          // Clear any existing drawn signature data when uploading new file
          setUrl('');
          if (signCanvasRef.current) {
            signCanvasRef.current.clear();
          }
          
          // Store complete signature data including choice
          const signatureData = {
            choice: 'upload',
            fileName: response.id,
            signatureData: ''
          };
          
          setResponse(
            sectionId,
            sectionName,
            question.id,
            question.type,
            question.label as string,
            signatureData
          );

          setFileName(response.id);
          toast.success('Signature uploaded successfully!');
        }
        
        updateValidationState();
      } else {
        toast.error('Uploading signature failed');
        setValidationErrors(sectionId, question.id, 'Uploading signature failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Uploading signature failed');
      setValidationErrors(sectionId, question.id, 'Uploading signature failed');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      setIsDeleting(true);
      const response = await fileService.deleteFile(fileId);

      if (response.success) {
        // Clear the signature data and reset choice
        setResponse(
          sectionId,
          sectionName,
          question.id,
          question.type,
          question.label as string,
          null
        );
        
        setChoice(null);

        setFileName(null);
        updateValidationState();
        toast.success('File deleted successfully!');
      } else {
        toast.error('Deleting file failed');
        setValidationErrors(sectionId, question.id, 'Deleting file failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Deleting file failed');
      setValidationErrors(sectionId, question.id, 'Deleting file failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (question.maxFileSize && selectedFile.size > question.maxFileSize * 1024 * 1024) {
        setValidationErrors(sectionId, question.id, `File must be less than ${question.maxFileSize} MB`);
        return;
      }

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

  return (
    <div className="">
      <label className="main-label">
        {question.label} {question.required === 'yes' && <span className="text-red-500">*</span>}
      </label>
      <SignatureChoice 
        currentChoice={choice}
        onChoice={(newChoice: any) => {
          setChoice(newChoice);
          
          // Store the choice in form response store
          if (newChoice) {
            const currentData = {
              choice: newChoice,
              fileName: fileName || '',
              signatureData: url || ''
            };
            setResponse(
              sectionId,
              sectionName,
              question.id,
              question.type,
              question.label as string,
              currentData
            );
          }
          
          // Update validation state when switching methods
          setTimeout(() => updateValidationState(), 0);
        }} 
      />
     
      {choice === 'draw' && (
        <div className="space-y-4 pt-3">
          <div className="flex items-start w-fit space-x-4">
            <div className="border w-full max-w-md h-[12.5rem] rounded mb-4">
              <SignatureCanvas
                canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                ref={signCanvasRef}
              />
              {!url && <p className='text-sm text-darkBlue'>Save the signature before proceeding.</p>}
            </div>
            <div className="flex flex-col space-y-4">
              <button
                type="button"
                className="main-dark-button text-sm !h-[32px]"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                type="button"
                className="main-dark-button hover:!text-white text-sm !text-[#012473] !bg-subprimary !h-[32px]"
                onClick={handleGenerate}
              >
                Save
              </button>
            </div>
          </div>
          
          {/* Show saved signature info - same format as upload */}
          {fileName && choice === 'draw' && (
            <div className="flex space-x-4 items-center mt-3">
              <div className="truncate text-sm text-[#494C52]">
                <p>{fileName}</p>
              </div>
              <button
                onClick={handleClear}
                className="px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-medium text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </span>
              </button>
            </div>
          )}
        </div>
      )}
      {choice === 'upload' && (
        <div className="space-y-4 mt-3">
          <div className="flex space-x-4 items-center">
            <button
              onClick={handleButtonClick}
              className="px-[36px] py-2 rounded-md bg-subprimary border border-primary/20 text-primary font-medium text-sm transition-colors duration-200 cursor-pointer"
              disabled={isUploading || isDeleting || !!fileName}
              type="button"
            >
              {!isUploading ? (
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Upload</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Uploading...</span>
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleChange}
              disabled={isUploading || isDeleting}
            />
            <div className="truncate text-sm text-[#494C52]">
              <p>{fileName ? fileName : 'No signature chosen'}</p>
            </div>
            {fileName && (
              <button
                onClick={handleDeleteClick}
                className="px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-medium text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
                type="button"
              >
                {isDeleting ? (
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Deleting...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
  };