import React from 'react';
import { Icon } from '@iconify/react';

interface AudioPreviewProps {
  fileUrl: string;
  fileName: string;
}

export const AudioPreview: React.FC<AudioPreviewProps> = ({ fileUrl, fileName }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/70">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Icon icon="mdi:file-music" className="text-4xl text-purple-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate" title={fileName}>
            {fileName}
          </p>
          <p className="text-xs text-gray-500">Audio File</p>
        </div>
        <div className="flex-shrink-0">
          <audio controls className="h-8">
            <source src={fileUrl} type="audio/mpeg" />
            <source src={fileUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
};


