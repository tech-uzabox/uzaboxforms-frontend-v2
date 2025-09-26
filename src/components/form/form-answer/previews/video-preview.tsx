import React from 'react';
import { Icon } from '@iconify/react';

interface VideoPreviewProps {
  fileUrl: string;
  fileName: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ fileUrl, fileName }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/70">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Icon icon="mdi:file-video" className="text-4xl text-indigo-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate" title={fileName}>
              {fileName}
            </p>
            <p className="text-xs text-gray-500">Video File</p>
          </div>
        </div>
        <div className="w-full">
          <video controls className="w-full max-h-64 rounded-lg">
            <source src={fileUrl} type="video/mp4" />
            <source src={fileUrl} type="video/mpeg" />
            Your browser does not support the video element.
          </video>
        </div>
      </div>
    </div>
  );
};


