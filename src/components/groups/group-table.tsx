import dayjs from 'dayjs';
import { Icon } from '@iconify/react';
import { GroupWithRoles } from '@/types';
import { Table } from '@/components/table';
import { groupStore } from '@/store/group';
import { useTranslation } from 'react-i18next';
import React, { useMemo, useState } from 'react';
import { AddGroupModal, GroupModal } from './add-edit-group-modal';

const GroupTable: React.FC = () => {
    const { t } = useTranslation();
    const { groups } = groupStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<GroupWithRoles | null>(null);

    const openModal = (group: GroupWithRoles) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGroup(null);
    };

    const formattedGroups = useMemo(() => {
        if (!groups || !Array.isArray(groups)) return [];

        return groups.map((gn: GroupWithRoles) => ({
            ...gn,
            createdByDisplay: `${gn.creator?.firstName || ''} ${gn.creator?.lastName || ''}`.trim() || 'N/A',
            createdAtDisplay: gn.createdAt ? dayjs(gn.createdAt).format('MMM D, YYYY, h:mm A') : 'N/A',
            updatedAtDisplay: gn.updatedAt ? dayjs(gn.updatedAt).format('MMM D, YYYY, h:mm A') : 'N/A',
        }));
    }, [groups]);

    const columns = [
        { key: 'name', label: t('groupManagement.groupName'), width: 200, minWidth: 150, maxWidth: 300 },
        { key: 'status', label: t('groupManagement.status'), width: 120, minWidth: 100, maxWidth: 150 },
        { key: 'createdByDisplay', label: t('groupManagement.createdBy'), width: 180, minWidth: 150, maxWidth: 250 },
        { key: 'createdAtDisplay', label: t('groupManagement.createdAt'), width: 200, minWidth: 180, maxWidth: 250 },
        { key: 'updatedAtDisplay', label: t('groupManagement.updatedAt'), width: 200, minWidth: 180, maxWidth: 250 },
        { key: 'actions', label: t('groupManagement.actions'), width: 150, minWidth: 120, maxWidth: 180, resizable: false },
    ];

    const tableData = useMemo(() => {
        if (!Array.isArray(formattedGroups)) return [];
        
        return formattedGroups.map((gn: GroupWithRoles & { createdByDisplay: string; createdAtDisplay: string; updatedAtDisplay: string }) => ({
            ...gn,
            actions: (
                <button className="text-textIcon" onClick={() => openModal(gn)}>
                    <Icon icon="ic:baseline-edit" fontSize={18} />
                </button>
            ),
        }));
    }, [formattedGroups]);

    return (
        <div className="w-full">
            <Table
                paginate
                exportable
                data={tableData}
                columns={columns}
                title={t('groupManagement.groups')}
                exportData={tableData}
                additionalButton={<AddGroupModal />}
            />
            {selectedGroup && (
                <GroupModal
                    mode="edit"
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    groupData={selectedGroup}
                    onSuccess={closeModal}
                />
            )}
        </div>
    );
};

export default GroupTable;