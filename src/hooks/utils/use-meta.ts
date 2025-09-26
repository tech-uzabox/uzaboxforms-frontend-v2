import { useMemo } from 'react';
import { allRoutes } from '@/routes';
import { useLocation } from 'react-router-dom';
import type { RouteConfig } from '@/routes/types';

export const useRouteMeta = () => {
  const location = useLocation();

  const currentRouteMeta = useMemo(() => {
    const findRouteMeta = (routes: RouteConfig[], pathname: string, parentPath: string = ''): any => {
      for (const route of routes) {
        const fullPath = parentPath + (route.path.startsWith('/') ? route.path : `/${route.path}`);
        const normalizedFullPath = fullPath.replace(/\/+$/, '') || '/'; 
        const normalizedPathname = pathname.replace(/\/+$/, '') || '/';
        
        if (route.children) {
          const childMeta = findRouteMeta(route.children, pathname, normalizedFullPath);
          if (childMeta) {
            return childMeta;
          }
        }
          
        if (normalizedFullPath === normalizedPathname) {
          return route.meta;
        }
      }
      return null;
    };

    return findRouteMeta(allRoutes, location.pathname);
  }, [location.pathname]);

  return currentRouteMeta;
};
