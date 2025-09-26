import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  message?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  className = "border-red-200 bg-red-50",
}) => {
  const { t } = useTranslation();

  return (
    <Alert className={className}>
      <Icon icon="material-symbols:error" className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        {message || t("processManagement.errorFetchingImages")}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorState;
