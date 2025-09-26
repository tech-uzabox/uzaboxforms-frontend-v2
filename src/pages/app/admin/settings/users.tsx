"use client"
import { roleStore } from '@/store';
import { useGetAllRoles } from '@/hooks';
import { userStore } from '@/store/user';
import React, { useEffect } from 'react';
import { useGetAllUsers } from '@/hooks/user';
import { useTranslation } from 'react-i18next';
import UsersTable from '@/components/settings/users-table';

const UsersPage: React.FC = () => {
    const { setUsers } = userStore();
    const { setRoles } = roleStore()
    const { t } = useTranslation()
    
    const { data: userData, isPending } = useGetAllUsers();
    const { data: roleData } = useGetAllRoles();

    useEffect(() => {
        if (userData) setUsers(userData);
        if (roleData) setRoles(roleData)
    }, [userData, roleData, setUsers, setRoles]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">{t('processManagement.users')}</h1>
            
            {isPending ? (
                <p className="h-full flex justify-center items-center">{t('processManagement.fetchingUsers')}</p>
            ) : (
                <UsersTable />
            )}
        </div>
    );
};

export default UsersPage;