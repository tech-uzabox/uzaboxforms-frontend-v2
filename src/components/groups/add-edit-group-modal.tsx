import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { RoleSelector } from '@/components/ui';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AddButton from '@/components/button/add-button';
import { useCreateGroup, useUpdateGroup } from '@/hooks';
import { GroupWithRoles, CreateGroupData, UpdateGroupData } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Zod schema for validation
const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  status: z.enum(['ENABLED', 'DISABLED'], {
    required_error: 'Status is required',
  }),
  creatorId: z.string().optional(),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface GroupModalProps {
  mode: 'add' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  groupData?: GroupWithRoles;
  onSuccess?: () => void;
}

const GroupModal: React.FC<GroupModalProps> = ({ 
  mode, 
  isOpen, 
  onClose, 
  groupData,
  onSuccess 
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const createGroupMutation = useCreateGroup(() => {
    onClose();
    reset();
    onSuccess?.();
  });
  
  const updateGroupMutation = useUpdateGroup(() => {
    onClose();
    onSuccess?.();
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      status: undefined,
      creatorId: user ? user.id : '',
      roles: [],
    },
    mode: 'onChange',
  });


  // Initialize form data when modal opens or groupData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && groupData) {
        reset({
          name: groupData.name || '',
          status: (groupData.status as 'ENABLED' | 'DISABLED') || undefined,
          creatorId: groupData.creator?.id || user?.id || '',
          roles: groupData.roles ? groupData.roles.map((role: any) => role.roleId) : [],
        });
      } else {
        reset({
          name: '',
          status: undefined,
          creatorId: user ? user.id : '',
          roles: [],
        });
      }
    }
  }, [isOpen, mode, groupData, user, reset]);


  const onSubmit = async (data: GroupFormData) => {
    if (mode === 'add') {
      // Create group with roles
      const formData: CreateGroupData = {
        name: data.name,
        status: data.status,
        creatorId: data.creatorId || user?.id || '',
        roles: data.roles,
      };
      
      await createGroupMutation.mutateAsync(formData);
    } else {
      // Update group with roles
      const updateData: UpdateGroupData = {
        name: data.name,
        status: data.status,
        createdBy: data.creatorId || user?.id || '',
        roles: data.roles,
      };
      
      await updateGroupMutation.mutateAsync({
        id: groupData!.id,
        formData: updateData
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:rounded">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? t('groupManagement.addGroupNameTitle') : t('groupManagement.editGroupNameTitle')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' ? t('groupManagement.addGroupNameDescription') : t('groupManagement.editGroupNameDescription')}
          </DialogDescription>
        </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="main-label">
                {t('groupManagement.groupName')} <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder={t('groupManagement.groupName')}
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
                {t('groupManagement.status')} <span className="text-red-500">*</span>
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
                    <option value="">{t('groupManagement.selectStatus')}</option>
                    <option value="ENABLED">{t('groupManagement.enabled')}</option>
                    <option value="DISABLED">{t('groupManagement.disabled')}</option>
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
            <div className="mb-4">
              <Controller
                name="roles"
                control={control}
                render={({ field, fieldState }) => (
                  <RoleSelector
                    selectedRoles={field.value}
                    onRolesChange={field.onChange}
                    label={t('groupManagement.roles')}
                    placeholder={t('groupManagement.selectRoles')}
                    error={fieldState.error?.message}
                    required
                  />
                )}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={!isValid || createGroupMutation.isPending || updateGroupMutation.isPending}
                className={cn(
                  "main-dark-button",
                  (!isValid || createGroupMutation.isPending || updateGroupMutation.isPending) && "opacity-50 cursor-not-allowed"
                )}
              >
                {mode === 'add' 
                  ? (createGroupMutation.isPending ? t('groupManagement.creating') : t('groupManagement.add'))
                  : (updateGroupMutation.isPending ? t('groupManagement.updating') : t('common.save'))
                }
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
};

// Wrapper component for add functionality
export const AddGroupModal: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <AddButton 
        handleClick={() => setIsOpen(true)} 
        hoverText={t('groupManagement.addGroupName')} 
      />
      <GroupModal
        mode="add"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => setIsOpen(false)}
      />
    </div>
  );
};

// Export the main component for direct use
export { GroupModal };