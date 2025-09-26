import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconClassName?: string;
  containerClassName?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon,
  iconClassName = "w-8 h-8 text-gray-400",
  containerClassName = ""
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${containerClassName}`}>
      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {Icon && <Icon className={iconClassName} />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 max-w-md">
        {description}
      </p>
    </div>
  );
}
