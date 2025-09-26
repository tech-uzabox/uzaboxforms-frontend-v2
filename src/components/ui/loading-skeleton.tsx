import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: 'grid' | 'list' | 'header' | 'custom';
  itemCount?: number;
  className?: string;
}

export function LoadingSkeleton({ 
  type = 'grid', 
  itemCount = 6,
  className = ""
}: LoadingSkeletonProps) {
  if (type === 'header') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(itemCount)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default grid layout
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {[...Array(itemCount)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      ))}
    </div>
  );
}
