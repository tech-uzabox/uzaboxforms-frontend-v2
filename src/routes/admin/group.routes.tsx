import { lazy } from "react";
import type { RouteConfig } from "../types";
import { ComponentSuspense } from "@/components/ui/suspense-wrapper";

// Group pages
const Group = lazy(() => import("@/pages/app/admin/group/group"));

export const adminGroupRoutes: RouteConfig[] = [
  // Group routes
  {
    path: "admin/group",
    element: (
      <ComponentSuspense>
        <Group />
      </ComponentSuspense>
    ),
  },
];
