import React from 'react';
import { Icon } from '@iconify/react';

interface CheckboxResponseProps {
  response: any;
}

const CheckboxResponse: React.FC<CheckboxResponseProps> = ({ response }) => {
  return (
    <div className="">
      {response.map(({ option, checked }: { option: any, checked: any }, index: number) => (
        <div key={index} className="flex items-center mb-2">
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            {checked ? (
              <Icon icon="mdi:check-box" className="text-primary" />
            ) : (
              <Icon icon="mdi:checkbox-blank-outline" className="text-[#F0F5FF] bg-[#F0F5FF]" />
            )}
          </div>
          <p className="text-gray-700">{option}</p>
        </div>
      ))}
    </div>
  );
};

export default CheckboxResponse;