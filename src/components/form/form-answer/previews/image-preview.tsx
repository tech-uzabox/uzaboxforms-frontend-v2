import React from 'react';

interface ImagePreviewProps {
  fileUrl: string;
  fileName: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ fileUrl, fileName }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/70">
      <div className="relative">
        <img
          src={fileUrl}
          alt="File preview"
          className="max-w-full max-h-64 object-contain rounded-lg shadow-sm border border-gray-200"
        />
        <div className="mt-2 text-xs text-gray-500 truncate" title={fileName}>
          {fileName}
        </div>
      </div>
    </div>
  );
};


