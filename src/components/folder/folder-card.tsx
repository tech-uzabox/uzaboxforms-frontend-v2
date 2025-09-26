import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icon } from '@iconify/react';
import type { Folder } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { EditFolderModal } from './edit-folder-modal';
import { DeleteFolderModal } from './delete-folder-modal';

interface FolderCardProps {
  folder: Folder;
  onFolderClick: (folder: Folder) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, onFolderClick }) => {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  const handleEdit = () => {
    setEditingFolder(folder);
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setEditingFolder(folder);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card 
        className="cursor-pointer group shadow-none"
        onClick={() => onFolderClick(folder)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Icon icon="material-symbols:folder" className="text-2xl text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate">
                  {folder.name}
                </CardTitle>
                {folder.description && (
                  <CardDescription className="mt-1 line-clamp-2">
                    {folder.description}
                  </CardDescription>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon icon="material-symbols:more-vert" className="text-lg" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(); }}>
                  <Icon icon="material-symbols:edit" className="mr-2" />
                  {t('folders.editFolder')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                  className="text-red-600"
                >
                  <Icon icon="material-symbols:delete" className="mr-2" />
                  {t('folders.deleteFolder')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Icon icon="material-symbols:calendar-today" className="text-sm" />
                <span>{t('folders.created')} {formatDate(folder.createdAt)}</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Icon icon="material-symbols:description" className="mr-1" />
              {t('folders.forms')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <EditFolderModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingFolder(null);
        }}
        folder={editingFolder}
      />

      <DeleteFolderModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEditingFolder(null);
        }}
        folder={editingFolder}
      />
    </>
  );
};
