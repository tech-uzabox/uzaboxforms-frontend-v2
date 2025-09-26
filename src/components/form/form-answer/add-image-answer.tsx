import React from 'react';
import { useServeFileById } from '@/hooks/upload/use-file';
import { Question } from '@/types';

interface AddImageProps {
  question: Question;
}

export const AddImageAnswer: React.FC<AddImageProps> = ({ question }) => {
  const { 
    data: imageUrl, 
    isLoading, 
    error 
  } = useServeFileById(question.image || '');

  if (isLoading) {
    return <div className="max-h-[320px] bg-gray-200 flex items-center justify-center">Loading...</div>;
  }

  if (error || !imageUrl) {
    return <div className="max-h-[320px] bg-gray-200 flex items-center justify-center text-gray-500">Failed to load image</div>;
  }

  return <img src={imageUrl} alt="Uploaded" className="max-h-[320px] object-cover" />;
};
