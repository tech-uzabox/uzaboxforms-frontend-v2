import { z } from 'zod';
import { toast } from 'sonner';
import { Role } from '@/types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { SYSTEM_ROLES } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRole, useUpdateRole } from '@/hooks';
import AddButton from '@/components/button/add-button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Zod schema for role validation
const roleSchema = z.object({
  name: z.string()
    .min(1, 'Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Role name can only contain letters, numbers, spaces, hyphens, and underscores'),
  description: z.string()
    .min(1, 'Role description is required')
    .min(5, 'Role description must be at least 5 characters')
    .max(200, 'Role description must be less than 200 characters'),
  status: z.enum(['ENABLED', 'DISABLED'], {
    required_error: 'Status is required',
  }),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleModalProps {
  mode: 'create' | 'edit';
  role?: Role;
  isOpen?: boolean;
  onClose?: () => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ mode, role, isOpen, onClose }) => {
  const { t } = useTranslation();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  const isEditMode = mode === 'edit';
  const isSystemRole = isEditMode && role ? SYSTEM_ROLES.includes(role.name as typeof SYSTEM_ROLES[number]) : false;

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'ENABLED',
    },
  });

  // Reset form when role changes or modal opens/closes
  useEffect(() => {
    if (isEditMode && role) {
      form.reset({
        name: role.name || '',
        description: role.description || '',
        status: role.status || 'ENABLED',
      });
    } else if (!isEditMode) {
      form.reset({
        name: '',
        description: '',
        status: 'ENABLED',
      });
    }
  }, [role, isEditMode, form]);

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (isEditMode && role) {
        // Prevent submission for system roles
        if (isSystemRole) {
          toast.warning(t('processManagement.systemRolesCannotBeModified'));
          return;
        }

        await updateRoleMutation.mutateAsync({
          id: role.id,
          formData: data,
        });
        toast.success(t('processManagement.roleUpdatedSuccessfully'));
      } else {
        await createRoleMutation.mutateAsync(data);
        toast.success(t('processManagement.roleCreatedSuccessfully'));
      }
      
      form.reset();
      onClose?.();
    } catch (error) {
      const errorMessage = isEditMode 
        ? t('processManagement.updatingRoleFailed')
        : t('processManagement.roleCreationFailed');
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (field: keyof RoleFormData, value: string) => {
    // Prevent editing role name for system roles
    if (isSystemRole && field === 'name') {
      toast.warning(t('processManagement.systemRoleNamesCannotBeModified'));
      return;
    }
    form.setValue(field, value as any);
  };

  const isLoading = createRoleMutation.isPending || updateRoleMutation.isPending;

  // For create mode, render the button and modal
  if (!isEditMode) {
    return (
      <div>
        <AddButton 
          handleClick={() => onClose?.()} 
          hoverText={t('processManagement.addNewRole')} 
        />
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:rounded">
            <DialogHeader>
              <DialogTitle>{t('processManagement.addNewUserRole')}</DialogTitle>
              <DialogDescription>
                {t('processManagement.addNewUserRoleDescription')}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="main-label">
                        {t('processManagement.roleName')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('processManagement.enterRoleName')}
                          className="main-input"
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
                      <FormLabel className="main-label">
                        {t('processManagement.roleDescription')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('processManagement.enterRoleDescription')}
                          className="main-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="main-label">
                        {t('processManagement.status')}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="main-input">
                            <SelectValue placeholder={t('processManagement.selectStatus')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ENABLED">
                            {t('processManagement.enabled')}
                          </SelectItem>
                          <SelectItem value="DISABLED">
                            {t('processManagement.disabled')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="main-dark-button w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t('processManagement.creating') : t('processManagement.add')}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // For edit mode, render only the modal
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:rounded">
        <DialogHeader>
          <DialogTitle>{t('processManagement.editRole')}</DialogTitle>
          <DialogDescription>
            {t('processManagement.editRoleDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="main-label">
                    {t('processManagement.formName')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`main-input ${isSystemRole ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      disabled={isSystemRole}
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
                  <FormLabel className="main-label">
                    {t('processManagement.roleDescription')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className={`main-input ${isSystemRole ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      disabled={isSystemRole}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="main-label">
                    {t('processManagement.status')}
                  </FormLabel>
                  <Select 
                    onValueChange={(value) => handleInputChange('status', value)} 
                    value={field.value}
                    disabled={isSystemRole}
                  >
                    <FormControl>
                      <SelectTrigger className={`main-input ${isSystemRole ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                        <SelectValue placeholder={t('processManagement.selectStatus')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ENABLED">
                        {t('processManagement.enabled')}
                      </SelectItem>
                      <SelectItem value="DISABLED">
                        {t('processManagement.disabled')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                {t('processManagement.cancel')}
              </Button>
              <Button
                type="submit"
                className="main-dark-button"
                disabled={isSystemRole || isLoading}
              >
                {isLoading ? t('common.saving') : t('common.save')}
              </Button>
            </div>

            {isSystemRole && (
              <p className="text-sm text-yellow-600 mt-2">
                {t('processManagement.noteThisIsASystemRoleAndCannotBeModified')}
              </p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleModal;
