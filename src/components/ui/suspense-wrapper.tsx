import { useTranslation } from 'react-i18next';
import { Suspense, type ReactNode } from 'react';
import { FullScreenLoader, Loader } from './loader';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
}

export const SuspenseWrapper = ({ 
  children, 
  fallback,
  size = 'md',
  label
}: SuspenseWrapperProps) => {
  const { t } = useTranslation();
  const defaultLabel = label || t('processManagement.loading');
  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <Loader size={size} label={defaultLabel} />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

// Page-level Suspense wrapper
export const PageSuspense = ({ 
  children, 
  fallback,
  label
}: Omit<SuspenseWrapperProps, 'size'>) => {
  const { t } = useTranslation();
  const defaultLabel = label || t('processManagement.loadingPage');
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-screen">
      <Loader size="lg" label={defaultLabel} />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

// Component-level Suspense wrapper
export const ComponentSuspense = ({ 
  children, 
  fallback,
  label
}: Omit<SuspenseWrapperProps, 'size'>) => {
  const { t } = useTranslation();
  const defaultLabel = label || t('processManagement.loading');
  const defaultFallback = (
    <div className="flex items-center justify-center p-4">
      <FullScreenLoader size="xl" label={defaultLabel} />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};
