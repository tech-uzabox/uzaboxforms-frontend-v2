import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useUpdateAddToDatabase } from '@/hooks';
import React, { type FormEvent, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EditAddToDatabaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any | null;
    setSelectedItem: React.Dispatch<React.SetStateAction<any | null>>;
}

const EditAddToDatabaseModal: React.FC<EditAddToDatabaseModalProps> = ({ isOpen, onClose, item, setSelectedItem }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        id: item?.id,
        name: item?.name || '',
        status: item?.status || ''
    });

    const updateAddToDatabaseMutation = useUpdateAddToDatabase();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const data = await updateAddToDatabaseMutation.mutateAsync({ id: formData.id!, data: formData });
            if (data.success) {
                setSelectedItem(null);
                toast.success(t('common.databaseItemUpdatedSuccessfully'));
                onClose();
            } else {
                toast.error(t('common.operationFailed'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('database.failedToUpdate'));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:rounded">
                <DialogHeader>
                    <DialogTitle>{t('database.editDatabaseEntry')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="main-label">{t('formManagement.formName')}</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="main-input"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="main-label">{t('database.status')}</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="main-input"
                        >
                            <option value="">{t('database.selectStatus')}</option>
                            <option value="ENABLED">{t('database.enabled')}</option>
                            <option value="DISABLED">{t('database.disabled')}</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="main-dark-button"
                        >
                            {updateAddToDatabaseMutation.isPending ? t('database.updating') : t('database.save')}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditAddToDatabaseModal;