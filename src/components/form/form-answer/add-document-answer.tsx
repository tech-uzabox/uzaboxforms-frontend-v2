import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

interface AddDocumentProps {
  question: any;
}

export const AddDocumentAnswer: React.FC<AddDocumentProps> = ({ question }) => {
  return (
    <div className="flex items-center space-x-2 p-3 rounded bg-subprimary w-fit">
      <Icon icon="tabler:download" className='text-textIcon' fontSize={24} />
      <Link to={`/api/uploads/${question.document}`} target="_blank" rel="noopener noreferrer" className="main-label truncate max-w-[240px] overflow-hidden text-ellipsis text-sm">
        {/* {question.label} */}
        Download document
      </Link>
    </div>
  );
};