import React from 'react';

interface AddTitleProps {
  question: any;
}

export const AddTitleAnswer: React.FC<AddTitleProps> = ({ question }) => {
  return <h2 className="text-lg mb-4 text-[#001A55] font-medium">{question.titleName}</h2>;
};