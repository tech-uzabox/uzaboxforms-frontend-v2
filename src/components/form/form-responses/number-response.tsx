import React from 'react';

interface NumberResponseProps {
  response: string;
}

const NumberResponse: React.FC<NumberResponseProps> = ({ response }) => {
  return (
    <div className="main-response-container">
      {response}
    </div>
  );
};

export default NumberResponse;
