import { useEffect, useRef, useMemo } from 'react';
import { useBreadcrumbStore } from '@/store/ui';

interface BreadcrumbItem {
  name: string;
  href: string;
}

/**
 * Hook to set custom breadcrumbs for a specific page
 * Automatically clears custom breadcrumbs when component unmounts
 * 
 * @param breadcrumbs - Array of breadcrumb items to display
 * @param dependencies - Optional dependencies array to re-set breadcrumbs when they change
 */
export const useCustomBreadcrumbs = (
  breadcrumbs: BreadcrumbItem[] | null,
  dependencies: any[] = []
) => {
  const { setCustomBreadcrumbItems, clearCustomBreadcrumbItems } = useBreadcrumbStore();
  const prevBreadcrumbsRef = useRef<BreadcrumbItem[] | null>(null);

  // Memoize the breadcrumbs to prevent unnecessary re-renders
  const memoizedBreadcrumbs = useMemo(() => breadcrumbs, [JSON.stringify(breadcrumbs)]);

  useEffect(() => {
    // Set custom breadcrumbs immediately when they change
    setCustomBreadcrumbItems(memoizedBreadcrumbs);
    prevBreadcrumbsRef.current = memoizedBreadcrumbs;

    // Cleanup function to clear custom breadcrumbs when component unmounts
    return () => {
      clearCustomBreadcrumbItems();
    };
  }, [memoizedBreadcrumbs, ...dependencies]);

  return {
    setCustomBreadcrumbItems,
    clearCustomBreadcrumbItems,
  };
};
