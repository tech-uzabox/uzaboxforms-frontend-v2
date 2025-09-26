import { lazy } from "react";
import type { RouteConfig } from "../types";
import { ComponentSuspense } from "@/components/ui/suspense-wrapper";

// Settings pages
const UsersSettings = lazy(() => import("@/pages/app/admin/settings/users"));
const ManagementSettings = lazy(
  () => import("@/pages/app/admin/settings/management")
);
const OrganizationChartSettings = lazy(
  () => import("@/pages/app/admin/settings/organization-chart")
);

// Dashboard management pages
const DashboardsManagement = lazy(
  () => import("@/pages/app/admin/settings/dashboards/dashboards-management")
);
const DashboardEdit = lazy(
  () => import("@/pages/app/admin/settings/dashboards/dashboard-edit")
);
const DashboardCreate = lazy(
  () => import("@/pages/app/admin/settings/dashboards/dashboard-create")
);
const WidgetCreate = lazy(
  () => import("@/pages/app/admin/settings/dashboards/widgets/widget-create")
);
const WidgetEdit = lazy(
  () => import("@/pages/app/admin/settings/dashboards/widgets/widget-edit")
);

export const adminSettingsRoutes: RouteConfig[] = [
  // Settings routes
  {
    path: "admin/settings/users",
    element: (
      <ComponentSuspense>
        <UsersSettings />
      </ComponentSuspense>
    ),
    meta: {
      title: "Users Settings | UzaForm",
      description: "Manage users, roles, and user-role assignments",
    },
  },
  {
    path: "admin/settings/management",
    element: (
      <ComponentSuspense>
        <ManagementSettings />
      </ComponentSuspense>
    ),
    meta: {
      title: "Management Settings | UzaForm",
      description: "Manage system settings and configurations",
    },
  },
  {
    path: "admin/settings/organization-chart",
    element: (
      <ComponentSuspense>
        <OrganizationChartSettings />
      </ComponentSuspense>
    ),
    meta: {
      title: "Organization Chart | UzaForm",
      description: "Manage organization structure and hierarchy",
    },
  },
  // Dashboard management routes
  {
    path: "admin/settings/dashboard-management",
    element: (
      <ComponentSuspense>
        <DashboardsManagement />
      </ComponentSuspense>
    ),
    meta: {
      title: "Dashboards Management | UzaForm",
      description: "Manage dashboards and widgets",
    },
  },
  {
    path: "admin/settings/dashboard-management/:dashboardId/edit",
    element: (
      <ComponentSuspense>
        <DashboardEdit />
      </ComponentSuspense>
    ),
    meta: {
      title: "Dashboard Edit | UzaForm",
      description: "Edit dashboard and widgets",
    },
  },
  {
    path: "admin/settings/dashboard-management/new",
    element: (
      <ComponentSuspense>
        <DashboardCreate />
      </ComponentSuspense>
    ),
    meta: {
      title: "Dashboard Create | UzaForm",
      description: "Create new dashboard",
    },
  },
  {
    path: "admin/settings/dashboard-management/:dashboardId/widgets/new",
    element: (
      <ComponentSuspense>
        <WidgetCreate />
      </ComponentSuspense>
    ),
    meta: {
      title: "Widget Create | UzaForm",
      description: "Create new widget",
    },
  },
  {
    path: "admin/settings/dashboard-management/:dashboardId/widgets/:widgetId/edit",
    element: (
      <ComponentSuspense>
        <WidgetEdit />
      </ComponentSuspense>
    ),
    meta: {
      title: "Widget Edit | UzaForm",
      description: "Edit widget",
    },
  },
];
