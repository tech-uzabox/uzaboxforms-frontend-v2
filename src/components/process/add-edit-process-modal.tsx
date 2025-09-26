import { z } from 'zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { AddEditProcessModalProps } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/use-auth-store';
import SearchGroup from '@/components/groups/search-group';
import { useCreateProcess, useUpdateProcess } from '@/hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, RoleSelector } from "@/components/ui";

// Zod schema for form validation
const processNameSchema = z.object({
  name: z.string().min(1, 'Process name is required').min(3, 'Process name must be at least 3 characters'),
  groupId: z.string().min(1, 'Group is required'),
  type: z.enum(['PUBLIC', 'PRIVATE'], {
    required_error: 'Please select a type',
  }),
  status: z.enum(['ENABLED', 'DISABLED'], {
    required_error: 'Please select a status',
  }),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
});

type ProcessNameFormData = z.infer<typeof processNameSchema>;

export const AddEditProcessModal: React.FC<AddEditProcessModalProps> = ({
  mode,
  isOpen,
  onClose,
  selectedProcess,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  
  const createProcessMutation = useCreateProcess(() => {
    onClose();
    form.reset();
  });
  
  const updateProcessMutation = useUpdateProcess(() => {
    onClose();
  });
  

  const form = useForm<ProcessNameFormData>({
    resolver: zodResolver(processNameSchema),
    defaultValues: {
      name: '',
      groupId: '',
      type: 'PRIVATE',
      status: 'ENABLED',
      roles: [],
    },
  });

  // Reset form when modal opens/closes or when selectedProcess changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && selectedProcess) {
        form.reset({
          name: selectedProcess.name,
          groupId: selectedProcess.group.id,
          type: selectedProcess.type,
          status: selectedProcess.status,
          roles: selectedProcess.roles ? selectedProcess.roles.map((role: any) => role.id) : [],
        });
      } else {
        form.reset({
          name: '',
          groupId: '',
          type: 'PRIVATE',
          status: 'ENABLED',
          roles: [],
        });
      }
    }
  }, [isOpen, mode, selectedProcess, form]);


  const onSubmit = async (data: ProcessNameFormData) => {
    if (mode === 'add') {
      const createData = {
        name: data.name,
        type: data.type,
        groupId: data.groupId,
        creatorId: user?.id as string,
        status: data.status,
        archived: false,
        staffViewForms: false,
        applicantViewProcessLevel: false,
        roles: data.roles
      };
      await createProcessMutation.mutateAsync(createData);
    } else {
      const updateData = {
        name: data.name,
        type: data.type,
        groupId: data.groupId,
        status: data.status,
        archived: selectedProcess?.archived || false,
        staffViewForms: selectedProcess?.staffViewForms || false,
        applicantViewProcessLevel: selectedProcess?.applicantViewProcessLevel || false,
        roles: data.roles
      };
      await updateProcessMutation.mutateAsync({
        processId: selectedProcess?.id as string,
        processData: updateData
      });
    }
  };

  const handleRolesChange = (roles: string[]) => {
    form.setValue('roles', roles);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:rounded">
          <DialogHeader>
            <DialogTitle>
              {mode === 'add' 
                ? t('processManagement.addProcessNameTitle')
                : t('processManagement.editProcessNameTitle')
              }
            </DialogTitle>
            <DialogDescription>
              {mode === 'add' 
                ? t('processManagement.addProcessNameDescription')
                : t('processManagement.editProcessNameDescription')
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Process Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('processManagement.processName')}</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        className="main-input"
                        placeholder={t('processManagement.processName')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Group Selection */}
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('processManagement.groupName')}</FormLabel>
                    <FormControl>
                      <SearchGroup
                        groupId={field.value}
                        setGroupId={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type Selection */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('processManagement.type')}</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="main-input"
                      >
                        <option value="">{t('processManagement.selectType')}</option>
                        <option value="PRIVATE">{t('processManagement.private')}</option>
                        <option value="PUBLIC">{t('processManagement.public')}</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Selection */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('processManagement.status')}</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="main-input"
                      >
                        <option value="">{t('processManagement.selectStatus')}</option>
                        <option value="ENABLED">{t('processManagement.enabled')}</option>
                        <option value="DISABLED">{t('processManagement.disabled')}</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Roles Selection */}
              <FormField
                control={form.control}
                name="roles"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <RoleSelector
                        selectedRoles={field.value}
                        onRolesChange={handleRolesChange}
                        label={t('processManagement.roles')}
                        placeholder={t('processManagement.selectRoles')}
                        error={fieldState.error?.message}
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />


              {/* Submit Button */}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={createProcessMutation.isPending || updateProcessMutation.isPending}
                  className='main-dark-button'
                >
                  {createProcessMutation.isPending || updateProcessMutation.isPending
                    ? t('common.saving')
                    : mode === 'add'
                    ? t('processManagement.add')
                    : t('processManagement.update')
                  }
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
