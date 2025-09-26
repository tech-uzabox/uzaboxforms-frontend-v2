import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useUpdateFolder } from '@/hooks/folder';
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';

const editFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(100, 'Folder name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type EditFolderFormData = z.infer<typeof editFolderSchema>;

interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

export const EditFolderModal: React.FC<EditFolderModalProps> = ({ isOpen, onClose, folder }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateFolderMutation = useUpdateFolder();

  const form = useForm<EditFolderFormData>({
    resolver: zodResolver(editFolderSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (folder) {
      form.reset({
        name: folder.name,
        description: folder.description || '',
      });
    }
  }, [folder, form]);

  const onSubmit = async (data: EditFolderFormData) => {
    if (!folder) return;

    try {
      setIsSubmitting(true);
      await updateFolderMutation.mutateAsync({
        id: folder.id,
        data,
      });
      toast.success(t('folders.folderUpdatedSuccessfully'));
      onClose();
    } catch (error) {
      console.error('Error updating folder:', error);
      toast.error(t('folders.failedToUpdateFolder'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon="material-symbols:edit-folder" className="text-xl" />
            {t('folders.editFolder')}
          </DialogTitle>
          <DialogDescription>
            {t('folders.editFolderDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter folder name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter folder description (optional)"
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icon icon="eos-icons:loading" className="mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Icon icon="material-symbols:save" className="mr-2" />
                    Update Folder
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
