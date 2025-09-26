import React from 'react';
import { Icon } from '@iconify/react';

interface PresentationPreviewProps {
  fileUrl: string;
  fileName: string;
}

export const PresentationPreview: React.FC<PresentationPreviewProps> = ({ fileUrl, fileName }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/70">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Icon icon="mdi:file-powerpoint" className="text-4xl text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate" title={fileName}>
            {fileName}
          </p>
          <p className="text-xs text-gray-500">Presentation</p>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-sm hover:bg-orange-200 transition-colors"
        >
          Download
        </a>
      </div>
    </div>
  );
};


