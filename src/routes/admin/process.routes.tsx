import { lazy } from "react";
import type { RouteConfig } from "../types";
import { ComponentSuspense } from "@/components/ui/suspense-wrapper";

// Process pages
const Process = lazy(
  () => import("@/pages/app/admin/process/process")
);
const ProcessDisabled = lazy(
  () => import("@/pages/app/admin/process/process-disabled")
);
const ProcessDesign = lazy(
  () => import("@/pages/app/admin/process/process-design")
);

export const adminProcessRoutes: RouteConfig[] = [
  // Process routes
  {
    path: "admin/processes",
    element: (
      <ComponentSuspense>
        <Process />
      </ComponentSuspense>
    ),
    meta: {
      title: "Process Names | UzaForm",
      description: "Manage process names and configurations",
    },
  },
  {
    path: "admin/process/process-disabled",
    element: (
      <ComponentSuspense>
        <ProcessDisabled />
      </ComponentSuspense>
    ),
    meta: {
      title: "Disabled Processes | UzaForm",
      description: "View and manage disabled processes",
    },
  },
  {
    path: "admin/process/process-design/:processId",
    element: (
      <ComponentSuspense>
        <ProcessDesign />
      </ComponentSuspense>
    ),
    meta: {
      title: "Process Design | UzaForm",
      description: "Design and configure processes",
    },
  },
];
