import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string | Error;
  onRetry?: () => void;
  title?: string;
  icon?: React.ReactNode;
  showRetryButton?: boolean;
  retryButtonText?: string;
}

export function ErrorState({ 
  error, 
  onRetry, 
  title,
  icon,
  showRetryButton = true,
  retryButtonText
}: ErrorStateProps) {
  const { t } = useTranslation();
  const errorMessage = typeof error === 'string' ? error : error.message;
  const defaultIcon = <AlertCircle className="w-8 h-8 text-red-600" />;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
        {icon || defaultIcon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title || t('dashboards.somethingWentWrong')}
      </h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">{errorMessage}</p>
      {showRetryButton && onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          {retryButtonText || t('dashboards.tryAgain')}
        </Button>
      )}
    </div>
  );
}
