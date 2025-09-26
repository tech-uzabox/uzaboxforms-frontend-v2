import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { fileService } from '@/services/upload/file.service';

interface UploadResponseProps {
  response: any;
  label: string;
}

const UploadResponse: React.FC<UploadResponseProps> = ({ response, label }) => {
  const { t } = useTranslation();
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadFile = async () => {
      if (response) {
        try {
          const fileResponse = await fileService.getPresignedUrlById(response);
          if (fileResponse.presignedUrl) {
            setFileUrl(fileResponse.presignedUrl);
          }
        } catch (error) {
          console.error('Error loading file:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadFile();
  }, [response]);

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase();
  };

  const renderResponse = () => {
    if (isLoading) {
      return <div className="max-w-[480px] h-32 bg-gray-200 flex items-center justify-center rounded">Loading...</div>;
    }

    if (!fileUrl) {
      return <div className="text-gray-500">File not found</div>;
    }

    const fileExtension = getFileExtension(response);

    switch (fileExtension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return <img src={fileUrl} alt={label} className="max-w-[480px] h-auto rounded object-cover" />;
      case 'mp4':
      case 'webm':
      case 'ogg':
        return (
          <video controls className="max-w-full h-auto rounded-md">
            <source src={fileUrl} type={`video/${fileExtension}`} />
{t('formResponses.yourBrowserDoesNotSupportVideo')}
          </video>
        );
      case 'mp3':
      case 'wav':
      case 'ogg':
        return (
          <audio controls className="w-full">
            <source src={fileUrl} type={`audio/${fileExtension}`} />
{t('formResponses.yourBrowserDoesNotSupportAudio')}
          </audio>
        );
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
      case 'ppt':
      case 'pptx':
        return (
          <Link to={fileUrl} download className="text-blue-500 underline">
{t('formResponses.downloadFileType', { type: fileExtension.toUpperCase() })}
          </Link>
        );
      default:
        return (
          <Link to={fileUrl} download className="text-blue-500 underline">
{t('formResponses.downloadFile')}
          </Link>
        );
    }
  };

  return (
    <div className="mb-2 flex space-x-4 items-center">
      {renderResponse()}
    </div>
  );
};

export default UploadResponse;