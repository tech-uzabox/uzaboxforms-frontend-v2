import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteConfig } from '@/routes/types';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/use-auth-store';
import { FullScreenLoader } from '@/components/ui/loader';

interface RouteGuardProps {
  route: RouteConfig;
  children: ReactNode;
}

export const RouteGuard = ({ 
  route, 
  children
}: RouteGuardProps) => {
  const { isAuthenticated, isAuthLoading, roles } = useAuthStore();
  const { t } = useTranslation();

  if (isAuthLoading) {
    return <FullScreenLoader label={t('processManagement.checkingAuthentication')} />;
  }

  if (route.meta?.requiresAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (route.meta?.roles && route.meta.roles.length > 0) {
    const hasRequiredRole = route.meta.roles.some(role => 
      roles?.some(userRole => userRole === role)
    );
      
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};