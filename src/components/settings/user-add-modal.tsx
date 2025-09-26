import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateUser } from "@/hooks/user";
import { RoleSelector } from "@/components/ui";
import { useTranslation } from 'react-i18next';
import React, { type FormEvent, useState } from "react";

interface UserAddModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const UserAddModal: React.FC<UserAddModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const createUserMutation = useCreateUser();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const createData = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roles: selectedRoles
      };
      const data = await createUserMutation.mutateAsync(createData);
      if (data.success === true) {
        toast.success(t('processManagement.userCreatedSuccessfully'));
        closeModal();
        setUserData({
          firstName: '',
          lastName: '',
          email: '',
        });
        setSelectedRoles([]);
      }
    } catch (error) {
      toast.error(t('processManagement.creatingUserFailed'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:rounded">
        <DialogHeader>
          <DialogTitle>{t('processManagement.addUser')}</DialogTitle>
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
              placeholder={t('processManagement.enterFirstName')}
              required
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
              placeholder={t('processManagement.enterLastName')}
              required
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
              placeholder={t('processManagement.enterYourEmail')}
              required
            />
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
              createUserMutation.isPending ? (
                <p>{t('common.creating')}</p>
              ) : (
                <p>{t('common.create')}</p>
              )
            }
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddModal;
