import React from 'react';

interface DropdownResponseProps {
  response: string;
  label: string
}

const DropdownResponse: React.FC<DropdownResponseProps> = ({ response }) => {
  return (
    <div className="main-response-container">
      {response}
    </div>
  );
};

export default DropdownResponse;