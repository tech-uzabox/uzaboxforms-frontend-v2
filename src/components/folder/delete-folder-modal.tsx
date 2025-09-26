import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Icon } from '@iconify/react';
import type { Folder } from '@/types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useDeleteFolder } from '@/hooks/folder';

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

export const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({ isOpen, onClose, folder }) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteFolderMutation = useDeleteFolder();

  const handleDelete = async () => {
    if (!folder) return;

    try {
      setIsDeleting(true);
      await deleteFolderMutation.mutateAsync(folder.id);
      toast.success(t('folders.folderDeletedSuccessfully'));
      onClose();
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error(t('folders.failedToDeleteFolder'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Icon icon="material-symbols:delete-folder" className="text-xl" />
            {t('folders.deleteFolder')}
          </DialogTitle>
          <DialogDescription>
            {t('folders.deleteFolderDescription', { name: folder?.name })}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <Icon icon="material-symbols:warning" className="text-lg" />
              <span className="font-medium">{t('folders.warning')}</span>
            </div>
            <p className="text-red-700 text-sm mt-1">
              {t('folders.deleteFolderWarning')}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Icon icon="eos-icons:loading" className="mr-2" />
                {t('common.deleting')}
              </>
            ) : (
              <>
                <Icon icon="material-symbols:delete" className="mr-2" />
                {t('folders.deleteFolder')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
