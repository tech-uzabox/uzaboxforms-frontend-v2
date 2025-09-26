import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  AlertCircle,
  LayoutIcon,
  LineChart,
  PieChart,
  Plus,
  Save,
  Settings,
  Users,
  X,
} from "lucide-react";
import {
  buildDefaultLayouts,
  cloneLayouts,
  fromRGLLayouts,
  removeWidgetFromLayout,
  toRGLLayouts,
} from "@/utils/layout-update";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  BreakpointKey,
  SaveDashboardLayoutRequest,
  Widget,
} from "@/types/dashboard.types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Layout, Layouts } from "react-grid-layout";
import { useNavigate, useParams } from "react-router-dom";
import DashboardGrid from "@/components/dashboard/dashboard-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboard, useUpdateDashboard, useGetAllRoles, useDeleteWidget, useLogDeviceDimensions, useGetAllUsers } from "@/hooks";

interface DashboardFormData {
  name: string;
  description: string;
  allowedUsers: string[];
  allowedRoles: string[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// @ts-ignore
const WIDGET_TYPE_ICONS = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  calendar: CalendarDays,
};

export default function EditDashboard() {
  const params = useParams();
  const { t } = useTranslation();
  const dashboardId = params.dashboardId as string;

  useLogDeviceDimensions();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DashboardFormData>({
    name: "",
    description: "",
    allowedUsers: [],
    allowedRoles: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"settings" | "widgets">("widgets");
  const [localWidgets, setLocalWidgets] = useState<Widget[]>([]);

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useGetDashboard(dashboardId);
  const dashboard = dashboardData;
  const { data: usersResponse, isLoading: usersLoading } = useGetAllUsers();;
  const { data: rolesResponse, isLoading: rolesLoading } = useGetAllRoles();
  const [committedLayouts, setCommittedLayouts] = useState<Layouts | null>(
    null
  );
  const [workingLayouts, setWorkingLayouts] = useState<Layouts | null>(null);
  const [_activeBreakpoint, setActiveBreakpoint] = useState<BreakpointKey>("lg");
  const [isDirty, setIsDirty] = useState(false);
  const [isSavingLayout, _setIsSavingLayout] = useState(false);
  const [_resetSignal, _setResetSignal] = useState(0);
  const updateDashboardMutation = useUpdateDashboard();
  const deleteWidgetMutation = useDeleteWidget();

  const users = usersResponse || [];
  const roles = rolesResponse || [];
  const isSubmitting = updateDashboardMutation.isPending;

  useEffect(() => {
    if (dashboard) {
      setFormData({
        name: dashboard.name,
        description: dashboard.description || "",
        allowedUsers: dashboard.allowedUsers || [],
        allowedRoles: dashboard.allowedRoles || [],
      });

      if (dashboard.widgets) {
        setLocalWidgets([...dashboard.widgets]);
      }
      if (dashboard.layout?.layouts) {
        const rglLayouts = toRGLLayouts(dashboard.layout.layouts);
        setCommittedLayouts(rglLayouts);
        setWorkingLayouts(rglLayouts);
      } else {
        const defaultLayouts = buildDefaultLayouts(dashboard.widgets || []);
        setCommittedLayouts(defaultLayouts);
        setWorkingLayouts(defaultLayouts);
      }
    }
  }, [dashboard]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('processManagement.dashboardNameRequired');
    } else if (formData.name.length < 3) {
      newErrors.name = t('processManagement.dashboardNameMustBeAtLeast3Characters');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        ...(formData.allowedUsers.length > 0 && {
          allowedUsers: formData.allowedUsers,
        }),
        ...(formData.allowedRoles.length > 0 && {
          allowedRoles: formData.allowedRoles,
        }),
      };

      await updateDashboardMutation.mutateAsync({
        id: dashboardId,
        formData: payload,
      });

      toast.success(t('processManagement.dashboardUpdatedSuccessfully'));
    } catch (err) {
      toast.error(t('processManagement.failedToUpdateDashboard'));
      console.error("Update dashboard error:", err);
    }
  };

  const handleBack = () => {
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

  const handleDeleteWidget = async (widgetId: string) => {
    if (!confirm(t('processManagement.areYouSureYouWantToDeleteThisWidget'))) return;

    try {
      await deleteWidgetMutation.mutateAsync(widgetId);

      setLocalWidgets((prev) => prev.filter((w) => w.id !== widgetId));

      setCommittedLayouts((prev) =>
        prev ? removeWidgetFromLayout(prev, widgetId) : prev
      );

      setWorkingLayouts((prev) =>
        prev ? removeWidgetFromLayout(prev, widgetId) : prev
      );

      setIsDirty(true);

      toast.success(t('processManagement.widgetDeletedSuccessfully'));
      await handleSaveLayout();
    } catch (err) {
      toast.error(t('processManagement.failedToDeleteWidget'));
      console.error(err);
    }
  };

  const handleEditWidget = (widgetId: string) => {
    navigate(
      `/admin/settings/dashboard-management/${dashboardId}/widgets/${widgetId}/edit`
    );
  };

  const handleCreateWidget = () => {
    navigate(`/admin/settings/dashboard-management/${dashboardId}/widgets/new`);
  };

  // @ts-ignore
  const handlePreviewDashboard = () => {
    window.open(`/dashboards/${dashboardId}`, "_blank");
  };

  function normalizeLayouts(l: Layouts | null) {
    if (!l) return {};
    const pick = (arr?: Layout[]) =>
      (arr || [])
        .map((x) => ({
          i: x.i,
          x: x.x,
          y: x.y,
          w: x.w,
          h: x.h,
          minW: x.minW,
          minH: x.minH,
        }))
        .sort((a, b) => (a.i > b.i ? 1 : -1));
    return {
      lg: pick(l.lg),
      md: pick(l.md),
      sm: pick(l.sm),
      xs: pick(l.xs),
      xxs: pick(l.xxs),
    };
  }

  function layoutsEqual(a: Layouts | null, b: Layouts | null) {
    return (
      JSON.stringify(normalizeLayouts(a)) ===
      JSON.stringify(normalizeLayouts(b))
    );
  }

  function deriveCanonicalOrder(layouts: Layouts): string[] {
    const priority: BreakpointKey[] = ["lg", "md", "sm", "xs", "xxs"];
    const base = priority.find((bp) => (layouts[bp] || []).length > 0);
    const arr = base ? layouts[base]! : [];

    // Sort by y first, then x
    const sorted = [...arr].sort((a, b) =>
      a.y === b.y ? a.x - b.x : a.y - b.y
    );

    return sorted.map((l) => String(l.i));
  }

  async function saveDashboardLayout(payload: SaveDashboardLayoutRequest) {
    await updateDashboardMutation.mutateAsync({
      formData: {
        layout: {
          layouts: payload.layouts,
          order: payload.order,
        },
      },
      id: payload.dashboardId,
    });
  }

  const handleLayoutsChange = (
    _currentLayout: Layout[],
    allLayouts: Layouts,
    _bp: BreakpointKey
  ) => {
    setWorkingLayouts(cloneLayouts(allLayouts));
    if (!committedLayouts) {
      setCommittedLayouts(cloneLayouts(allLayouts));
      setIsDirty(false);
    } else {
      setIsDirty(!layoutsEqual(committedLayouts, allLayouts));
    }
  };

  const handleSaveLayout = async () => {
    if (!workingLayouts) return;
    const payload = {
      dashboardId,
      order: deriveCanonicalOrder(workingLayouts),
      layouts: fromRGLLayouts(workingLayouts),
    };
    await saveDashboardLayout(payload);
    setCommittedLayouts(cloneLayouts(workingLayouts));
    setIsDirty(false);
  };

  const handleDiscardLayout = () => {
    if (!committedLayouts) return;
    setWorkingLayouts(cloneLayouts(committedLayouts));
    setIsDirty(false);
  };
  if (dashboardLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (dashboardError || !dashboard) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {t('processManagement.failedToLoadDashboard')}
              </h3>
              <p className="text-gray-600 mb-4">
                {dashboardError?.message ||
                  t('processManagement.theDashboardCouldNotBeFoundOrLoaded')}
              </p>
              <Button onClick={handleBack} variant="outline">
                {t('processManagement.backToDashboards')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedUsers = users.filter((user: User) =>
    formData.allowedUsers.includes(user.id)
  ) as User[];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-1 h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div>
              <h1 className="text-3xl font-bold text-[#3F4247]">
                {t('processManagement.editDashboard')}
              </h1>
              <p className="text-gray-600 mt-1">{dashboard.name}</p>
            </div>
          </div>
          {/*
          <div className="flex items-center gap-3">
            <Button
              onClick={handlePreviewDashboard}
              variant="outline"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div> */}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("widgets")}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm",
                activeTab === "widgets"
                  ? "border-[#012473] text-[#012473]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <LayoutIcon className="w-4 h-4 inline mr-2" />
              {t('processManagement.widgets')} ({dashboard.widgets?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm",
                activeTab === "settings"
                  ? "border-[#012473] text-[#012473]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              {t('processManagement.settings')}
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "settings" && (
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
                    placeholder={t('processManagement.describeWhatThisDashboardShows')}
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
                      {selectedUsers.map((user) => (
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
                      ))}
                    </div>

                    {!usersLoading && users.length > 0 && (
                      <Select onValueChange={handleAddUser} value="">
                        <SelectTrigger>
                          <SelectValue placeholder={t('processManagement.addAUser')} />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter(
                              (user: User) =>
                                !formData.allowedUsers.includes(user.id)
                            )
                            .map((user: any) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  {user.firstName} {user.lastName} ({user.email}
                                  )
                                </div>
                              </SelectItem>
                            ))}
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
                        {roles.map((role: any) => (
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
              onClick={handleBack}
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
              {isSubmitting ? t('common.saving') : t('common.saveChanges')}
            </Button>
          </div>
        </form>
      )}

      {activeTab === "widgets" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{t('processManagement.dashboardWidgets')}</h3>
              <p className="text-sm text-gray-600">
                {t('processManagement.dragByTheHandleToReorderDragCornerToResize')}
              </p>
            </div>
            <Button onClick={handleCreateWidget} className="main-dark-button">
              <Plus className="w-4 h-4 mr-2" />
              {t('processManagement.addWidget')}
            </Button>
          </div>

          {localWidgets.length > 0 && (
            <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {t('processManagement.changesAreNotAutoSavedClickSaveWhenDone')}
              </p>
            </div>
          )}

          {localWidgets.length > 0 ? (
            <>
              <DashboardGrid
                widgets={localWidgets}
                layouts={workingLayouts ?? {}}
                onEdit={handleEditWidget}
                onDelete={handleDeleteWidget}
                onLayoutsChange={handleLayoutsChange}
                onBreakpointChange={setActiveBreakpoint}
                isInteractive={!isSavingLayout}
                rowHeight={100}
              />
              {isDirty && (
                <div className="fixed inset-x-0 bottom-0 z-50">
                  <div className="mx-auto max-w-6xl px-4 pb-4">
                    <div className="rounded-lg border bg-white shadow-md p-3 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        {t('processManagement.youHaveUnsavedLayoutChanges')}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handleDiscardLayout}
                          disabled={isSavingLayout}
                        >
                          {t('processManagement.discard')}
                        </Button>
                        <Button
                          onClick={handleSaveLayout}
                          disabled={isSavingLayout}
                          className="main-dark-button"
                        >
                          {isSavingLayout ? t('common.saving') : t('common.saveChanges')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center flex flex-col justify-center gap-4 items-center">
                  <LayoutIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('processManagement.noWidgetsYet')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('processManagement.addYourFirstWidgetToStartVisualizingFormData')}
                  </p>
                  <Button
                    onClick={handleCreateWidget}
                    className="main-dark-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('processManagement.createFirstWidget')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
