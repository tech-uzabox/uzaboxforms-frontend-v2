import React from 'react';

interface PhoneResponseProps {
  response: string;
}

const PhoneNumberResponse: React.FC<PhoneResponseProps> = ({ response }) => {
  return (
    <div className="main-response-container">
      {response}
    </div>
  );
};

export default PhoneNumberResponse;
