import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { roleStore } from '@/store/user/role-store';
import { useGetAllRoles } from '@/hooks/user/use-role';
import { groupStore } from '@/store/group/group-store';
import { useGetAllGroups } from '@/hooks/user/use-group';
import ProcessTable from '@/components/process/process-table';
import { useGetAllProcesses } from '@/hooks/process/use-process';

const Process = () => {
    const { data, isLoading } = useGetAllProcesses();
    const { t } = useTranslation();
    const { data: groups } = useGetAllGroups();
    const { data: roles } = useGetAllRoles();
    const { setGroups } = groupStore();
    const { setRoles } = roleStore();

    useEffect(() => {
        if (groups) setGroups(groups);
        if (roles) setRoles(roles);
    }, [groups, roles, setGroups, setRoles]);

    return (
        <main className=''>
            <div className='text-2xl font-semibold text-center py-8'>
                <p>{t('processManagement.processes')}</p>
            </div>
            <div className="space-y-6">
                {isLoading ? (
                    <p className="h-full flex justify-center items-center">{t('processManagement.fetching')}</p>
                ) : (
                    <ProcessTable processes={data.data} />
                )}
            </div>
        </main>
    );
};

export default Process;
