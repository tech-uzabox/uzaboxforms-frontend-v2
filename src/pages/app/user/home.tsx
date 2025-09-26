import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useGetAllGroupAndProcesses } from '@/hooks/group-process/use-group-process';

const Home: React.FC = () => {
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const { data, isLoading } = useGetAllGroupAndProcesses(user?.id ?? '');
    const [searchQuery, setSearchQuery] = useState('');
    const groupsData = Array.isArray(data) ? data : [];

    const filteredGroupsData = useMemo(() => {
        if (!groupsData.length) return [];

        // Filter first
        const filtered = groupsData.filter((group) => {
            const groupNameMatch = group.group.name.toLowerCase().includes(searchQuery.toLowerCase());
            const processNameMatch = group.processes.some((process: any) =>
                process.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return groupNameMatch || processNameMatch;
        });

        // Sort groups alphabetically
        const sortedGroups = [...filtered].sort((a, b) =>
            a.group.name.localeCompare(b.group.name)
        );

        // Sort processes inside each group
        return sortedGroups.map((group) => ({
            ...group,
            processes: [...group.processes].sort((a, b) =>
                a.name.localeCompare(b.name)
            ),
        }));
    }, [groupsData, searchQuery]);

    if (!user?.id || isLoading) {
        return (
            <div className="text-center py-8 text-gray-700">
                {t('common.loading')}
            </div>
        );
    }


    return (
        <main className="py-4 max-w-screen-md mx-auto">
            <h1 className="text-2xl font-semibold mb-4 text-center text-primary">
                {t('common.services')}
            </h1>
            <div className="mb-12 flex justify-center relative items-center space-x-2 rounded-md pl-4 h-[48px] w-full bg-subprimary text-sm">
                <Icon icon={"lucide:search"} fontSize={18} className='text-textIcon' />
                <input
                    type="text"
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="outline-none flex-1 bg-inherit"
                />
            </div>
            <div className='bg-white space-y-7'>
                {filteredGroupsData.map((group, index) => (
                    <div key={index} className="px-4 py-3 rounded-lg border-l-[2.4px] border-darkBlue">
                        <h2 className="text-xl font-medium mb-3 text-black">
                            {group.group.name}
                        </h2>
                        <div className="list-disc list-inside space-y-3">
                            {group.processes.map((process: any) => {
                                return (
                                    <div key={process.id} className="text-black hover:text-[#001544] text-sm hover:underline">
                                        {process.firstFormId ? (
                                            <Link to={`/answer-application/${process.id}/${process.firstFormId}`}>
                                                {process.name}
                                            </Link>
                                        ) : null}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Home;