import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { fileService } from '@/services/upload/file.service';

interface SignatureResponseProps {
  response: string;
  label: string;
}

const SignatureResponse: React.FC<SignatureResponseProps> = ({ response }) => {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const loadImage = async () => {
      if (response) {
        try {
          const fileResponse = await fileService.getPresignedUrlById(response);
          if (fileResponse.presignedUrl) {
            setImageUrl(fileResponse.presignedUrl);
          }
        } catch (error) {
          console.error('Error loading signature:', error);
        }
      }
    };

    loadImage();
  }, [response]);
  
  if (!imageUrl) {
    return (
      <div className="mb-4">
        <div className="mt-2">
          <div className="border-2 border-gray-300 rounded-md max-w-full h-32 bg-gray-200 flex items-center justify-center">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="mt-2">
        <img
          src={imageUrl}
          alt={t('formResponses.signature')}
          className="border-2 border-gray-300 rounded-md max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default SignatureResponse;