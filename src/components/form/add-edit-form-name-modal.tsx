import { z } from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import AddButton from '../button/add-button';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateForm, useUpdateForm } from '@/hooks/form/use-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Zod schema for validation
const formSchema = z.object({
  name: z.string().min(1, 'Form name is required'),
  type: z.enum(['INTERNAL', 'EXTERNAL'], {
    required_error: 'Type is required',
  }),
  status: z.enum(['ENABLED', 'DISABLED'], {
    required_error: 'Status is required',
  }),
  creatorId: z.string().optional(),
});

type FormNameData = z.infer<typeof formSchema>;

interface FormNameModalProps {
  mode: 'add' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  formData?: any;
  onSuccess?: () => void;
  folderId?: string | null;
}

const FormNameModal: React.FC<FormNameModalProps> = ({ 
  mode, 
  isOpen, 
  onClose, 
  formData,
  onSuccess,
  folderId
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const createFormMutation = useCreateForm();
  const updateFormMutation = useUpdateForm();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<FormNameData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'INTERNAL',
      status: undefined,
      creatorId: user?.id,
    },
    mode: 'onChange',
  });

  // Initialize form data when modal opens or formData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && formData) {
        reset({
          name: formData.name || '',
          type: formData.type || 'INTERNAL',
          status: formData.settings?.status || formData.status || undefined,
          creatorId: formData.settings?.createdBy || formData.createdBy?.id || user?.id || '',
        });
      } else {
        reset({
          name: '',
          type: 'INTERNAL',
          status: undefined,
          creatorId: user?.id || '',
        });
      }
    }
  }, [isOpen, mode, formData, user, reset]);

  // Ensure creatorId is set when user becomes available
  useEffect(() => {
    if (user?.id && mode === 'add') {
      const currentValues = watch();
      if (!currentValues.creatorId) {
        reset({
          ...currentValues,
          creatorId: user.id,
        });
      }
    }
  }, [user, mode, watch, reset]);


  const onSubmit = async (data: FormNameData) => {
    try {
      let result;
      
      if (mode === 'add') {
        // Create form
        const submitData = {
          name: data.name,
          type: data.type,
          status: data.status,
          creatorId: data.creatorId || user?.id || '',
          ...(folderId && { folderId }),
        };
        result = await createFormMutation.mutateAsync(submitData);
        
        if (result) {
          onClose();
          reset();
          onSuccess?.();
        } else {
          toast.error(t('common.operationFailed'));
        }
      } else {
        // Update form
        const updateData = {
          name: data.name,
          type: data.type,
          status: data.status,
          creatorId: data.creatorId || user?.id || '',
        };
        
        result = await updateFormMutation.mutateAsync({
          id: formData.id,
          data: updateData
        });
        
        if (result) {
          onClose();
          onSuccess?.();
        } else {
          toast.error(t('common.operationFailed'));
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(mode === 'add' ? t('formManagement.failedToAddFormName') : t('formManagement.updatingFormNameFailed'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:rounded">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? t('formManagement.addFormNameTitle') : t('formManagement.editFormNameTitle')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' ? t('formManagement.addFormNameDescription') : t('formManagement.editFormNameDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="main-label">
              {t('formManagement.formName')} <span className="text-red-500">*</span>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder={t('formManagement.formName')}
                  className={cn(
                    "mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-darkBlue focus:border-darkBlue sm:text-sm",
                    errors.name ? "border-red-500" : "border-gray-300"
                  )}
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="main-label">
              {t('formManagement.type')} <span className="text-red-500">*</span>
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={cn(
                    "mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-darkBlue focus:border-darkBlue sm:text-sm",
                    errors.type ? "border-red-500" : "border-gray-300"
                  )}
                >
                  <option value="INTERNAL">{t('formManagement.internal')}</option>
                  <option value="EXTERNAL">{t('formManagement.external')}</option>
                </select>
              )}
            />
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="main-label">
              {t('formManagement.status')} <span className="text-red-500">*</span>
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={cn(
                    "mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-darkBlue focus:border-darkBlue sm:text-sm",
                    errors.status ? "border-red-500" : "border-gray-300"
                  )}
                >
                  <option value="">{t('formManagement.selectStatus')}</option>
                  <option value="ENABLED">{t('formManagement.enabled')}</option>
                  <option value="DISABLED">{t('formManagement.disabled')}</option>
                </select>
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>
          <div className="mb-4">
            <Controller
              name="creatorId"
              control={control}
              render={({ field }) => (
                <input {...field} type="hidden" />
              )}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={!isValid || createFormMutation.isPending || updateFormMutation.isPending}
              className={cn(
                "main-dark-button",
                (!isValid || createFormMutation.isPending || updateFormMutation.isPending) && "opacity-50 cursor-not-allowed"
              )}
            >
              {mode === 'add' 
                ? (createFormMutation.isPending ? t('formManagement.creating') : t('formManagement.add'))
                : (updateFormMutation.isPending ? t('formManagement.updating') : t('common.save'))
              }
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Wrapper component for add functionality
export const AddFormNameModal: React.FC<{ folderId?: string | null }> = ({ folderId }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <AddButton 
        handleClick={() => setIsOpen(true)} 
        hoverText={t('formManagement.addFormName')} 
      />
      <FormNameModal
        mode="add"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => setIsOpen(false)}
        folderId={folderId}
      />
    </div>
  );
};

// Export the main component for direct use
export { FormNameModal };
