import React from 'react';
import { useTranslation } from 'react-i18next';

interface AddUsersResponseProps {
  response: any;
  label: string;
}

const AddUsersResponse: React.FC<AddUsersResponseProps> = ({ response }) => {
  const { t } = useTranslation();
  const users = Array.isArray(response) ? response : [response];
  
  if (!users || users.length === 0) {
    return <p className="text-gray-500 italic">{t('formResponses.noUsersSelected')}</p>;
  }

  return (
    <div className="space-y-2">
      {users.map((user: any, index: number) => (
        <div key={user.id || index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            {user.email && (
              <p className="text-sm text-gray-500">{user.email}</p>
            )}
          </div>
        </div>
      ))}
      {users.length > 1 && (
        <p className="text-sm text-gray-500 mt-2">
{t('formResponses.usersSelected', { count: users.length })}
        </p>
      )}
    </div>
  );
};

export default AddUsersResponse;
