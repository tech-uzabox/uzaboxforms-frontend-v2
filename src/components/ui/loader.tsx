import { cn } from '@/lib/utils';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import { LoaderSize, LoaderProps } from '@/types';

const sizeMap: Record<LoaderSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export const Loader = ({ 
  size = 'md', 
  color = '#001544', 
  label, 
  className,
  labelClassName 
}: LoaderProps) => {
  const loaderSize = sizeMap[size];

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <ClipLoader 
        size={loaderSize} 
        color={color} 
        loading={true}
      />
      {label && (
        <p className={cn('mt-2 text-sm text-gray-600', labelClassName, `${size === 'xl' ? 'text-md' : 'text-sm'}`)}>
          {label}
        </p>
      )}
    </div>
  );
};

// Full screen loader for page loading
export const FullScreenLoader = ({ 
  label,
  size = 'lg'
}: Omit<LoaderProps, 'className'>) => {
  const { t } = useTranslation();
  const defaultLabel = label || t('processManagement.loading');
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader size={size} label={defaultLabel} />
    </div>
  );
};

// Inline loader for buttons and small areas
export const InlineLoader = ({ 
  size = 'sm',
  color = '#3b82f6'
}: Omit<LoaderProps, 'label' | 'className'>) => {
  return (
    <div className="flex items-center justify-center">
      <ClipLoader 
        size={sizeMap[size]} 
        color={color} 
        loading={true}
      />
    </div>
  );
};

// Page loader with overlay
export const PageLoader = ({ 
  label,
  size = 'md'
}: Omit<LoaderProps, 'className'>) => {
  const { t } = useTranslation();
  const defaultLabel = label || t('processManagement.loadingPage');
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loader size={size} label={defaultLabel} />
    </div>
  );
};
