import {
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IDashboard } from "@/types/dashboard.types";
import { useDeleteDashboard, useGetAllDashboards } from "@/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function DashboardCard({ dashboard, onEdit, onDelete, onView }: {
  dashboard: IDashboard;
  onEdit: (dashboard: IDashboard) => void;
  onDelete: (dashboard: IDashboard) => void;
  onView: (dashboard: IDashboard) => void;
}) {
  const { t } = useTranslation();

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-[#3F4247] truncate">
              {dashboard.name}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-500">
              {t('processManagement.created')} {new Date(dashboard.createdAt || '').toLocaleDateString()}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView(dashboard)}>
                  <Eye className="w-4 h-4 mr-2" />
                  {t('processManagement.viewDashboard')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(dashboard)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {t('processManagement.editDashboard')}
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(dashboard)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('processManagement.deleteDashboard')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-end text-sm text-gray-600">
          <div className="text-xs text-gray-500">
            {t('processManagement.updated')} {new Date(dashboard.updatedAt || dashboard.createdAt || '').toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ searchQuery, onCreateNew }: {
  searchQuery: string;
  onCreateNew: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Settings className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {searchQuery ? t('processManagement.noDashboardsFound') : t('processManagement.noDashboardsCreatedYet')}
      </h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">
        {searchQuery
          ? `${t('processManagement.noDashboardsMatch')} "${searchQuery}". ${t('processManagement.tryAdjustingYourSearchTerms')}`
          : t('processManagement.getStartedByCreatingYourFirstDashboard')
        }
      </p>
      {!searchQuery && (
        <Button onClick={onCreateNew} className="main-dark-button">
          <Plus className="w-4 h-4 mr-2" />
          {t('processManagement.createFirstDashboard')}
        </Button>
      )}
    </div>
  );
}

export default function DashboardsManagement() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, _setSearchQuery] = useState("");
  const [dashboardToDelete, setDashboardToDelete] = useState<IDashboard | null>(null);

  const {
    data: dashboardsResponse,
    isLoading,
    error,
    refetch
  } = useGetAllDashboards({
    search: searchQuery || undefined
  });
  const deleteDashboardMutation = useDeleteDashboard();
  console.log(dashboardsResponse);
  const dashboards = dashboardsResponse || [];
  const totalCount = dashboardsResponse?.length || 0;

  const handleCreateNew = () => {
    navigate('/admin/settings/dashboard-management/new');
  };

  const handleEdit = (dashboard: IDashboard) => {
    navigate(`/admin/settings/dashboard-management/${dashboard.id}/edit`);
  };

  const handleView = (dashboard: IDashboard) => {
    navigate(`/dashboards/${dashboard.id}`);
  };

  const handleDelete = (dashboard: IDashboard) => {
    setDashboardToDelete(dashboard);
  };

  const handleConfirmDelete = async () => {
    if (!dashboardToDelete) return;

    try {
      await deleteDashboardMutation.mutateAsync(dashboardToDelete.id);
      toast.success(t('processManagement.dashboardDeletedSuccessfully'));
      setDashboardToDelete(null);
    } catch (err) {
      toast.error(t('processManagement.failedToDeleteDashboard'));
      console.error('Delete error:', err);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#3F4247] mb-2">{t('processManagement.dashboardManagement')}</h1>
              <p className="text-gray-600">
                {t('processManagement.createAndManageDataVisualizationDashboards')}
              </p>
            </div>
            <Button onClick={handleCreateNew} className="main-dark-button">
              <Plus className="w-4 h-4 mr-2" />
              {t('processManagement.newDashboard')}
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        {/* <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search dashboards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{totalCount} {totalCount === 1 ? 'dashboard' : 'dashboards'}</span>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="text-[#012473] hover:text-[#012473]/80"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div> */}

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              {t('processManagement.failedToLoadDashboards')} {(error as Error).message}
            </div>
            <Button onClick={() => refetch()} variant="outline">
              {t('processManagement.tryAgain')}
            </Button>
          </div>
        ) : dashboards.length === 0 ? (
          <EmptyState searchQuery={searchQuery} onCreateNew={handleCreateNew} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard: any) => (
              <DashboardCard
                key={dashboard.id}
                dashboard={dashboard}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        )}

        {/* Results Info */}
        {dashboards.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            {t('processManagement.showing')} {dashboards.length} {t('processManagement.of')} {totalCount} {totalCount === 1 ? t('processManagement.dashboard') : t('processManagement.dashboards')}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!dashboardToDelete} onOpenChange={() => setDashboardToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('processManagement.deleteDashboard')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('processManagement.areYouSureYouWantToDelete')} "{dashboardToDelete?.name}"? {t('processManagement.thisActionCannotBeUndone')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('processManagement.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteDashboardMutation.isPending}
            >
              {deleteDashboardMutation.isPending ? t('processManagement.deleting') : t('processManagement.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
