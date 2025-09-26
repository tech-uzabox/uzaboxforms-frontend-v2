import { lazy } from "react";
import type { RouteConfig } from "../types";
import { ComponentSuspense } from "@/components/ui/suspense-wrapper";

const DashboardsPage = lazy(() => import("@/pages/app/user/dashboards"));
const DashboardViewPage = lazy(() => import("@/pages/app/user/dashboard-view"));

export const adminDashboardRoutes: RouteConfig[] = [
  {
    path: "dashboards",
    element: (
      <ComponentSuspense>
        <DashboardsPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Dashboards | UzaForm",
      description: "View and interact with your data dashboards",
    },
  },
  {
    path: "dashboards/:dashboardId",
    element: (
      <ComponentSuspense>
        <DashboardViewPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Dashboard View | UzaForm",
      description: "View and interact with your data dashboards",
    },
  },
];
