import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUser } from "@/hooks/user";
import { UserEditModalProps } from "@/types";
import { RoleSelector } from "@/components/ui";
import { useTranslation } from 'react-i18next';
import { User, Role } from "@/types/user.types";
import React, { type FormEvent, useState, useEffect } from "react";

const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  closeModal,
  user,
}) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<User>(user);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user.roles ? user.roles.map((role: Role) => role.id) : []
  );
  const updateUserMutation = useUpdateUser(() => {
    closeModal();
  })

  useEffect(() => {
    setUserData(user);
    setSelectedRoles(user.roles ? user.roles.map((role: Role) => role.id) : []);
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev: User) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updateData = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      status: userData.status,
      roles: selectedRoles
    };
    await updateUserMutation.mutateAsync({ 
      userId: userData.id, 
      userData: updateData 
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:rounded">
        <DialogHeader>
          <DialogTitle>{t('processManagement.editUser')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="main-label">
              {t('processManagement.firstName')}
            </label>
            <input
              name="firstName"
              value={userData.firstName}
              onChange={handleInputChange}
              className="main-input"
            />
          </div>
          <div className="mb-4">
            <label className="main-label">
              {t('processManagement.lastName')}
            </label>
            <input
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
              className="main-input"
            />
          </div>
          <div className="mb-4">
            <label className="main-label">
              {t('processManagement.email')}
            </label>
            <input
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              type="email"
              className="main-input"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="main-label">
              {t('processManagement.status')}
            </label>
            <select
              name="status"
              value={userData.status}
              onChange={handleInputChange}
              className="main-input"
            >
              <option value="ENABLED">{t('processManagement.enabled')}</option>
              <option value="DISABLED">{t('processManagement.disabled')}</option>
            </select>
          </div>
          <div className="mb-4">
            <RoleSelector
              selectedRoles={selectedRoles}
              onRolesChange={setSelectedRoles}
              label={t('processManagement.roles')}
              placeholder={t('processManagement.selectRoles')}
            />
          </div>
          <button
            type="submit"
            className="main-dark-button float-right"
          >
            {
              updateUserMutation.isPending ? (
                <p>{t('common.saving')}</p>
              ) : (
                <p>{t('common.save')}</p>
              )
            }
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
