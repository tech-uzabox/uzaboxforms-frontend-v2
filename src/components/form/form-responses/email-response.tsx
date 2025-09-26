import React from 'react';

interface ShortTextResponseProps {
  response: string;
}

const EmailResponse: React.FC<ShortTextResponseProps> = ({ response }) => {
  return (
    <div className="main-response-container">
      {response}
    </div>
  );
};

export default EmailResponse;
