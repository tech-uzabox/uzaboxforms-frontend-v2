import { lazy } from "react";
import type { RouteConfig } from "../types";
import { ComponentSuspense } from "@/components/ui/suspense-wrapper";

// Pending applications pages
const AdminPendingApplicationsPage = lazy(
  () => import("@/pages/app/admin/management/pending-applications/admin-pending-applications")
);
const AdminPendingProcesses = lazy(
  () =>
    import(
      "@/pages/app/admin/management/pending-applications/admin-pending-process"
    )
);
const AdminPendingProcessApplicationPage = lazy(
  () =>
    import(
      "@/pages/app/admin/management/pending-applications/admin-pending-applicant-process"
    )
);

// Completed applications pages
const AdminCompletedApplicationsPage = lazy(
  () =>
    import(
      "@/pages/app/admin/management/completed-applications/admin-completed-applications"
    )
);
const AdminCompletedProcesses = lazy(
  () =>
    import(
      "@/pages/app/admin/management/completed-applications/admin-completed-process"
    )
);
const AdminCompletedProcessApplicationPage = lazy(
  () =>
    import(
      "@/pages/app/admin/management/completed-applications/admin-completed-applicant-process"
    )
);

// Disabled applications pages
const AdminDisabledApplicationsPage = lazy(
  () =>
    import(
      "@/pages/app/admin/management/disabled-applications/admin-disabled-applications"
    )
);
const AdminDisabledProcesses = lazy(
  () =>
    import(
      "@/pages/app/admin/management/disabled-applications/admin-disabled-process"
    )
);
const AdminDisabledProcessApplicationPage = lazy(
  () =>
    import(
      "@/pages/app/admin/management/disabled-applications/admin-disabled-applicant-process"
    )
);

export const adminManagementRoutes: RouteConfig[] = [
  // Pending applications routes
  {
    path: "admin/management/pending-applications",
    element: (
      <ComponentSuspense>
        <AdminPendingApplicationsPage />
      </ComponentSuspense>
    ),
  },
  {
    path: "admin/management/pending-applications/:processId",
    element: (
      <ComponentSuspense>
        <AdminPendingProcesses />
      </ComponentSuspense>
    ),
  },
  {
    path: "admin/management/pending-applications/:processId/:applicantProcessId",
    element: (
      <ComponentSuspense>
        <AdminPendingProcessApplicationPage />
      </ComponentSuspense>
    ),
  },

  // Disabled applications routes
  {
    path: "admin/management/disabled-applications",
    element: (
      <ComponentSuspense>
        <AdminDisabledApplicationsPage />
      </ComponentSuspense>
    ),
  },
  {
    path: "admin/management/disabled-applications/:processId",
    element: (
      <ComponentSuspense>
        <AdminDisabledProcesses />
      </ComponentSuspense>
    ),
  },
  {
    path: "admin/management/disabled-applications/:processId/:applicantProcessId",
    element: (
      <ComponentSuspense>
        <AdminDisabledProcessApplicationPage />
      </ComponentSuspense>
    ),
  },

  // Completed applications routes
  {
    path: "admin/management/completed-applications",
    element: (
      <ComponentSuspense>
        <AdminCompletedApplicationsPage />
      </ComponentSuspense>
    ),
  },
  {
    path: "admin/management/completed-applications/:processId",
    element: (
      <ComponentSuspense>
        <AdminCompletedProcesses />
      </ComponentSuspense>
    ),
  },
  {
    path: "admin/management/completed-applications/:processId/:applicantProcessId",
    element: (
      <ComponentSuspense>
        <AdminCompletedProcessApplicationPage />
      </ComponentSuspense>
    ),
  },
];
