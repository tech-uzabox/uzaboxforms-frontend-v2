import { lazy } from "react";
import type { RouteConfig } from "../types";
import { ComponentSuspense } from "@/components/ui/suspense-wrapper";

// Form pages
const FormNames = lazy(() => import("@/pages/app/admin/form/form-names"));
const FormDetail = lazy(() => import("@/pages/app/admin/form/form-preview"));
const FormDesign = lazy(() => import("@/pages/app/admin/form/form-design"));
const FormsInFolder = lazy(() => import("@/pages/app/admin/form/forms-in-folder"));
const UploadTrack = lazy(() => import("@/pages/app/admin/form/upload-track"));
const AddToDatabase = lazy(
  () => import("@/pages/app/admin/form/add-to-database")
);
const AddToDatabaseDetail = lazy(
  () => import("@/pages/app/admin/form/add-to-database-detail")
);

export const adminFormRoutes: RouteConfig[] = [
  // Form routes
  {
    path: "admin/form",
    element: (
      <ComponentSuspense>
        <FormNames />
      </ComponentSuspense>
    ),
    meta: {
      title: "Form Names | UzaForm",
      description: "Manage form names and configurations",
    },
  },
  {
    path: "admin/form/:formId",
    element: (
      <ComponentSuspense>
        <FormDetail />
      </ComponentSuspense>
    ),
    meta: {
      title: "Form Detail | UzaForm",
      description: "View form details and configurations",
    },
  },
  {
    path: "admin/form/design/:formId",
    element: (
      <ComponentSuspense>
        <FormDesign />
      </ComponentSuspense>
    ),
    meta: {
      title: "Form Design | UzaForm",
      description: "Design and manage forms",
    },
  },
  {
    path: "admin/form/design",
    element: (
      <ComponentSuspense>
        <FormDesign />
      </ComponentSuspense>
    ),
    meta: {
      title: "Form Design | UzaForm",
      description: "Design and manage forms",
    },
  },
  {
    path: "admin/form/folder/:folderId",
    element: (
      <ComponentSuspense>
        <FormsInFolder />
      </ComponentSuspense>
    ),
    meta: {
      title: "Forms in Folder | UzaForm",
      description: "View and manage forms in a specific folder",
    },
  },
  {
    path: "admin/form/upload-track",
    element: (
      <ComponentSuspense>
        <UploadTrack />
      </ComponentSuspense>
    ),
    meta: {
      title: "Upload and Track | UzaForm",
      description: "Upload and track form submissions",
    },
  },
  {
    path: "admin/form/add-to-database",
    element: (
      <ComponentSuspense>
        <AddToDatabase />
      </ComponentSuspense>
    ),
    meta: {
      title: "Add to Database | UzaForm",
      description: "Add forms to database",
    },
  },
  {
    path: "admin/form/add-to-database/:id",
    element: (
      <ComponentSuspense>
        <AddToDatabaseDetail />
      </ComponentSuspense>
    ),
    meta: {
      title: "Add to Database Detail | UzaForm",
      description: "Add specific form to database",
    },
  },
];
