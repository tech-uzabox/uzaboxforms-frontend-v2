import dayjs from 'dayjs';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState, useMemo } from 'react';
import { useGetAllAddToDatabases } from '@/hooks';
import FormSearch from '@/components/button/form-search';
import ExportButton from '@/components/button/export-button';
import EditAddToDatabaseModal from './edit-add-to-database-modal';
import AddToDatabaseModal from '@/components/add-to-database/add-to-database-modal';

interface AddToDatabase {
    id: string;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const AddToDatabaseTable: React.FC = () => {
    const { t } = useTranslation();
    const { data: addToDatabases, isLoading } = useGetAllAddToDatabases();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof AddToDatabase; direction: 'ascending' | 'descending' } | null>(null);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedAddToDatabase, setSelectedAddToDatabase] = useState<AddToDatabase | null>(null);

    const handleEditOpen = (item: AddToDatabase) => {
        setSelectedAddToDatabase(item);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => setEditDialogOpen(false);

    const filteredAddToDatabases = useMemo(() => {
        if (!addToDatabases) return [];
        return addToDatabases.filter((item: AddToDatabase) => {
            return (
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dayjs(item.createdAt).format('MMM D, YYYY, h:mm A').toLowerCase().includes(searchQuery.toLowerCase()) ||
                dayjs(item.updatedAt).format('MMM D, YYYY, h:mm A').toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }, [addToDatabases, searchQuery]);

    const sortedAddToDatabases = useMemo(() => {
        let sortableAddToDatabases = [...filteredAddToDatabases];
        if (sortConfig !== null) {
            sortableAddToDatabases.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableAddToDatabases;
    }, [filteredAddToDatabases, sortConfig]);

    const requestSort = (key: keyof AddToDatabase) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof AddToDatabase) => {
        if (sortConfig?.key !== key) {
            return <Icon icon="ic:outline-unfold-more" fontSize={18} />;
        }
        if (sortConfig.direction === 'ascending') {
            return <Icon icon="ic:round-arrow-upward" fontSize={18} />;
        } else {
            return <Icon icon="ic:round-arrow-downward" fontSize={18} />;
        }
    };

    const exportToCSV = (data: AddToDatabase[], filename: string) => {
        const csvContent = [
            [t('formManagement.formName'), t('database.status'), t('database.createdAt'), t('database.updatedAt')],
            ...data.map(item => [
                item.name,
                item.status,
                dayjs(item.createdAt).format('MMM D, YYYY, h:mm A'),
                dayjs(item.updatedAt).format('MMM D, YYYY, h:mm A'),
            ])
        ]
            .map(e => e.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) return <p>{t('database.loading')}</p>;

    return (
        <div className="overflow-x-hidden w-full">
            <div className="flex justify-between items-center mb-4">
                <FormSearch value={searchQuery} handleChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} />
                <div className='flex items-center space-x-3'>
                    <ExportButton handleClick={() => exportToCSV(sortedAddToDatabases, 'add_to_database_table')} />
                    <AddToDatabaseModal />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full bg-white">
                    <thead className="bg-subprimary text-primary font-normal text-sm rounded-[4px]">
                        <tr>
                            <th className="main-th">#</th>
                            <th className="main-th whitespace-nowrap cursor-pointer" onClick={() => requestSort('name')}>
                                <div className="flex items-center">
                                    {t('formManagement.formName')}
                                    <span className="ml-2">{getSortIcon('name')}</span>
                                </div>
                            </th>
                            <th className="main-th whitespace-nowrap cursor-pointer" onClick={() => requestSort('status')}>
                                <div className="flex items-center">
                                    {t('database.status')}
                                    <span className="ml-2">{getSortIcon('status')}</span>
                                </div>
                            </th>
                            <th className="main-th whitespace-nowrap cursor-pointer" onClick={() => requestSort('createdAt')}>
                                <div className="flex items-center">
                                    {t('database.createdAt')}
                                    <span className="ml-2">{getSortIcon('createdAt')}</span>
                                </div>
                            </th>
                            <th className="main-th whitespace-nowrap cursor-pointer" onClick={() => requestSort('updatedAt')}>
                                <div className="flex items-center">
                                    {t('database.updatedAt')}
                                    <span className="ml-2">{getSortIcon('updatedAt')}</span>
                                </div>
                            </th>
                            <th className="main-th whitespace-nowrap">{t('database.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-600 text-sm font-light'>
                        {sortedAddToDatabases.map((item: AddToDatabase, index: number) => (
                            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="main-td">{index + 1}</td>
                                <td className="main-td">{item.name}</td>
                                <td className="main-td">{item.status}</td>
                                <td className="main-td">{dayjs(item.createdAt).format('MMM D, YYYY, h:mm A')}</td>
                                <td className="main-td">{dayjs(item.updatedAt).format('MMM D, YYYY, h:mm A')}</td>
                                <td className="main-td flex space-x-3">
                                    <button
                                        className="text-textIcon"
                                        onClick={() => handleEditOpen(item)}
                                    >
                                        <Icon icon="ic:baseline-edit" fontSize={18} />
                                    </button>
                                    <Link to={`/admin/form/add-to-database/${item.id}`} className="text-textIcon">
                                        <Icon icon="mdi:file-document-edit" fontSize={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedAddToDatabase && (
                <EditAddToDatabaseModal
                    isOpen={isEditDialogOpen}
                    onClose={handleEditClose}
                    item={selectedAddToDatabase}
                    setSelectedItem={setSelectedAddToDatabase}
                />
            )}
        </div>
    );
};

export default AddToDatabaseTable;