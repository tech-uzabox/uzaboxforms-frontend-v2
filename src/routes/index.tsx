import { lazy } from 'react';
import { staffRoutes } from './staff';
import { Outlet } from 'react-router-dom';
import type { RouteConfig } from './types';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { adminRoutes } from './admin/admin.routes';
import { ComponentSuspense } from '@/components/ui/suspense-wrapper';

const DashboardLayout = lazy(() => import('@/components/layout/dashboard-layout'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

const authenticatedLayoutRoute: RouteConfig = {
  path: "/",
  element: (
    <ComponentSuspense >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ComponentSuspense>
  ),
  meta: {
    requiresAuth: true
  },
  children: [
    ...userRoutes.map(route => ({
      ...route,
      meta: {
        ...route.meta,
        roles: ["User"],
        requiresAuth: true
      }
    })),
    ...adminRoutes.map(route => ({
      ...route,
      meta: {
        ...route.meta,
        roles: ["Admin"],
        requiresAuth: true
      }
    })),
    ...staffRoutes.map(route => ({
      ...route,
      meta: {
        ...route.meta,
        roles: ["Staff"],
        requiresAuth: true
      }
    }))
  ]
};

const notFoundRoute: RouteConfig = {
  path: "*",
  element: (
    <ComponentSuspense >
      <NotFoundPage />
    </ComponentSuspense>
  ),
  meta: {
    requiresAuth: false,
    title: "UzaForm | Not Found",
    description: "Page not found "
  }
};

export const allRoutes = [
  ...authRoutes.map(route => ({
    ...route,
    meta: {
      ...route.meta,
      requiresAuth: false
    }
  })),
  authenticatedLayoutRoute,
  notFoundRoute,
];