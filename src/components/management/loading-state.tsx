import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  className = "flex items-center justify-center min-h-[400px]",
}) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className="text-center">
        <Icon
          icon="eos-icons:loading"
          className="text-4xl text-primary mb-4"
        />
        <p className="text-lg text-gray-600">
          {message || t("processManagement.loading")}
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
