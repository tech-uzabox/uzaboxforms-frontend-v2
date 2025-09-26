import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

interface AddURLProps {
  question: any;
}

export const AddURLAnswer: React.FC<AddURLProps> = ({ question }) => {
  return (
    <div className="flex items-center space-x-2"> 
      <div className='p-2 rounded bg-subprimary'>
        <Icon icon="mingcute:link-fill" className='text-textIcon' />
      </div>
      <Link to={question.urlName} target="_blank" rel="noopener noreferrer" className="main-label truncate max-w-[240px] overflow-hidden text-ellipsis text-sm hover:underline hover:text-darkBlue">
        {question.label}
      </Link>
  </div>
  );
};