import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useCreateAddToDatabase } from '@/hooks';
import AddButton from '@/components/button/add-button';
import React, { useState, type FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AddToDatabaseModal = () => {
    const { t } = useTranslation();
    const [isModalOpen, setModalOpen] = useState(false);
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const [formData, setFormData] = useState({
        name: '',
        status: ''
    });

    const createAddToDatabaseMutation = useCreateAddToDatabase();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const data = await createAddToDatabaseMutation.mutateAsync(formData);
            if (data.success) {
                toast.success(t('common.databaseItemAddedSuccessfully'));
                handleCloseModal();
            } else {
                toast.error(t('common.operationFailed'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('database.failedToAdd'));
        }
    };

    return (
        <div>
            <AddButton handleClick={handleOpenModal} hoverText={t('database.addToDatabase')} />
            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:rounded">
                    <DialogHeader>
                        <DialogTitle>{t('database.addToDatabase')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="main-label">{t('formManagement.formName')}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-darkBlue focus:border-darkBlue sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="main-label">{t('database.status')}</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-darkBlue focus:border-darkBlue sm:text-sm"
                            >
                                <option value="">{t('database.selectStatus')}</option>
                                <option value="ENABLED">{t('database.enabled')}</option>
                                <option value="DISABLED">{t('database.disabled')}</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                className="bg-darkBlue text-white px-4 py-2 rounded-md"
                            >
                                {createAddToDatabaseMutation.isPending ? (
                                    <p>{t('database.creating')}</p>
                                ) : (
                                    <p>{t('database.add')}</p>
                                )}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddToDatabaseModal;