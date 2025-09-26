import { Icon } from '@iconify/react';
import type { Folder } from '@/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useGetAllFolders } from '@/hooks/folder';
import { CreateFolderModal, FolderCard } from '@/components/folder';

const FormNames = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: foldersData, isPending: isFoldersPending } = useGetAllFolders();
  

  const handleFolderClick = (folder: Folder) => {
    navigate(`/admin/form/folder/${folder.id}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('processManagement.forms')}</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Icon icon="material-symbols:folder-plus" className="mr-2" />
          {t('folders.createFolder')}
        </Button>
      </div>

      {isFoldersPending ? (
        <div className="h-full flex justify-center items-center">
          <div className="flex items-center gap-2">
            <Icon icon="eos-icons:loading" className="text-xl" />
            <span>{t('folders.loadingFolders')}</span>
          </div>
        </div>
      ) : foldersData && foldersData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foldersData.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onFolderClick={handleFolderClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Icon icon="material-symbols:folder-open" className="text-6xl text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{t('folders.noFoldersYet')}</h3>
              <p className="text-gray-500">{t('folders.noFoldersDescription')}</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Icon icon="material-symbols:folder-plus" className="mr-2" />
              {t('folders.createFirstFolder')}
            </Button>
          </div>
        </div>
      )}

      <CreateFolderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default FormNames;
