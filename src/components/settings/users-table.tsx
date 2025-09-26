import dayjs from "dayjs";
import { User } from "@/types";
import { Icon } from "@iconify/react";
import { userStore } from "@/store/user";
import { Table } from "@/components/table";
import UserAddModal from "./user-add-modal";
import UserEditModal from "./user-edit-modal";
import { useTranslation } from "react-i18next";
import React, { useMemo, useState } from "react";

const UsersTable: React.FC = () => {
  const { t } = useTranslation();
  const { users } = userStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const formattedUsers = useMemo(() => {
    if (!users) return [];
    return users.map((user: User, index: number) => ({
      ...user,
      index: index + 1,
      createdAtDisplay: user.createdAt
        ? dayjs(user.createdAt).format("MMM D, YYYY, h:mm A")
        : "",
      updatedAtDisplay: user.updatedAt
        ? dayjs(user.updatedAt).format("MMM D, YYYY, h:mm A")
        : "",
      actions: (
        <button className="text-textIcon" onClick={() => handleEdit(user)}>
          <Icon icon="ic:baseline-edit" fontSize={18} />
        </button>
      ),
    }));
  }, [users]);

  const columns = [
    { key: "firstName", label: t("processManagement.firstName"), width: 120 },
    { key: "lastName", label: t("processManagement.lastName"), width: 120 },
    { key: "email", label: t("processManagement.email"), width: 200 },
    { key: "status", label: t("processManagement.status"), width: 100 },
    { key: "createdAtDisplay", label: t("processManagement.createdAt"), width: 150 },
    { key: "updatedAtDisplay", label: t("processManagement.updatedAt"), width: 150 },
    { key: "actions", label: t("processManagement.actions"), width: 80 },
  ];

  return (
    <div className="space-y-4">
      <Table
        paginate
        data={formattedUsers}
        columns={columns}
        title={t("processManagement.users")}
        exportable
        // additionalButton={
        //  <AddButton
        //     handleClick={() => setIsAddModalOpen(true)}
        //     hoverText={t("processManagement.addUser")}
        //   />
        // }
      />
      {selectedUser && (
        <UserEditModal
          isOpen={isEditModalOpen}
          closeModal={closeEditModal}
          user={selectedUser}
        />
      )}
      <UserAddModal isOpen={isAddModalOpen} closeModal={closeAddModal} />
    </div>
  );
};

export default UsersTable;
