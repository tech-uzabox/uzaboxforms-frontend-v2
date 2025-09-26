import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import React, { ReactNode, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowLeft, Save, Users, X } from "lucide-react";
import { useGetAllRoles, useGetAllUsers, useCreateDashboard } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardFormData {
  name: string;
  description: string;
  allowedUsers: string[];
  allowedRoles: string[];
}

export default function CreateDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<DashboardFormData>({
    name: "",
    description: "",
    allowedUsers: [],
    allowedRoles: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: usersResponse, isLoading: usersLoading } = useGetAllUsers();
  const { data: rolesResponse, isLoading: rolesLoading } = useGetAllRoles();
  const createDashboardMutation = useCreateDashboard();

  const users = usersResponse || [];
  const roles = rolesResponse || [];
  const isSubmitting = createDashboardMutation.isPending;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('processManagement.dashboardNameRequired');
    } else if (formData.name.length < 3) {
      newErrors.name = t('processManagement.dashboardNameMustBeAtLeast3Characters');
    }

    // Note: Access control is optional now since there's no visibility toggle

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        name: formData.name.trim(),
        ...(formData.description && {
          description: formData.description.trim(),
        }),
        ...(formData.allowedUsers.length > 0 && {
          allowedUsers: formData.allowedUsers,
        }),
        ...(formData.allowedRoles.length > 0 && {
          allowedRoles: formData.allowedRoles,
        }),
      };

      const newDashboard = await createDashboardMutation.mutateAsync(payload);
      if (newDashboard) {
        toast.success(t('processManagement.dashboardCreatedSuccessfully'));
        navigate(`/admin/settings/dashboard-management/${newDashboard?.id}/edit`);
      }
    } catch (err) {
      toast.error(t('processManagement.failedToCreateDashboard'));
      console.error("Create dashboard error:", err);
    }
  };

  const handleCancel = () => {
    navigate("/admin/settings/dashboard-management");
  };

  const handleAddUser = (userId: string) => {
    if (!formData.allowedUsers.includes(userId)) {
      setFormData((prev) => ({
        ...prev,
        allowedUsers: [...prev.allowedUsers, userId],
      }));
    }
  };

  const handleRemoveUser = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      allowedUsers: prev.allowedUsers.filter((id) => id !== userId),
    }));
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      allowedRoles: checked
        ? [...prev.allowedRoles, role]
        : prev.allowedRoles.filter((r) => r !== role),
    }));
  };

  const selectedUsers = users.filter((user: { id: string }) =>
    formData.allowedUsers.includes(user.id)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="p-1 h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-[#3F4247]">
              {t('processManagement.createNewDashboard')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('processManagement.setUpNewDashboardToVisualizeFormData')}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                {t('processManagement.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('processManagement.dashboardName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder={t('processManagement.enterDashboardName')}
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('processManagement.descriptionOptional')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder={t('processManagement.describeWhatThisDashboardWillShow')}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Access Control */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                {t('processManagement.accessControl')}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {t('processManagement.restrictAccessToSpecificUsersAndRoles')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                <div className="space-y-3">
                  <Label>{t('processManagement.allowedUsers')}</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedUsers.map(
                      (user: {
                        firstName: string;
                        lastName: string;
                        id: string;
                        name: string;
                      }) => (
                        <Badge
                          key={user.id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {user.firstName} {user.lastName}
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(user.id)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )
                    )}
                  </div>

                  {!usersLoading && users.length > 0 && (
                    <Select onValueChange={handleAddUser}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('processManagement.addAUser')} />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter(
                            (user: { id: string }) =>
                              !formData.allowedUsers.includes(user.id)
                          )
                          .map(
                            (user: {
                              firstName: ReactNode;
                              lastName: ReactNode;
                              id: string;
                              name: string;
                              email: string;
                            }) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  {user.firstName} {user.lastName} ({user.email}
                                  )
                                </div>
                              </SelectItem>
                            )
                          )}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>{t('processManagement.allowedRoles')}</Label>
                  {rolesLoading ? (
                    <div className="text-sm text-gray-500">
                      {t('processManagement.loadingRoles')}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((role: { id: string; name: string }) => (
                        <div
                          key={role.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={role.id}
                            checked={formData.allowedRoles.includes(role.id)}
                            onCheckedChange={(checked) =>
                              handleRoleChange(role.id, !!checked)
                            }
                          />
                          <label
                            htmlFor={role.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                          >
                            {role.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {t('processManagement.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="main-dark-button"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? t('processManagement.creating') : t('processManagement.createDashboard')}
          </Button>
        </div>
      </form>
    </div>
  );
}
