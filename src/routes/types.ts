import { type ReactNode } from 'react';

export interface RouteConfig {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
  meta?: {
    title?: string;
    requiresAuth?: boolean;
    roles?: string[];
    description?: string;
  };
}