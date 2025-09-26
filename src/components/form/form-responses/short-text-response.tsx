import React from 'react';

interface ShortTextResponseProps {
  response: string;
}

const ShortTextResponse: React.FC<ShortTextResponseProps> = ({ response }) => {
  return (
    <div className="main-response-container">
      {response}
    </div>
  );
};

export default ShortTextResponse;
