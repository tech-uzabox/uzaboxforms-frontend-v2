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
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useCreateFolder } from '@/hooks/folder';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/use-auth-store';

const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(100, 'Folder name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type CreateFolderFormData = z.infer<typeof createFolderSchema>;

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createFolderMutation = useCreateFolder();

  const form = useForm<CreateFolderFormData>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateFolderFormData) => {
    try {
      setIsSubmitting(true);
      const submitData = {
        ...data,
        creatorId: user?.id || '',
      };
      await createFolderMutation.mutateAsync(submitData);
      toast.success(t('folders.folderCreatedSuccessfully'));
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error(t('folders.failedToCreateFolder'));
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
            <Icon icon="material-symbols:folder-plus" className="text-xl" />
            {t('folders.createNewFolder')}
          </DialogTitle>
          <DialogDescription>
            {t('folders.createFolderDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('folders.folderName')} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('folders.enterFolderName')}
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
                  <FormLabel>{t('folders.folderDescription')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('folders.enterFolderDescription')}
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
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icon icon="eos-icons:loading" className="mr-2" />
                    {t('common.saving')}
                  </>
                ) : (
                  <>
                    <Icon icon="material-symbols:add" className="mr-2" />
                    {t('folders.createFolder')}
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
