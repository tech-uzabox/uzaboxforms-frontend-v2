import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface RefreshButtonProps {
  onRefresh: () => void;
  refreshing?: boolean;
  disabled?: boolean;
  refreshingText?: string;
  defaultText?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "lg" | "icon" | "default";
  className?: string;
}

export function RefreshButton({
  onRefresh,
  refreshing = false,
  disabled = false,
  refreshingText,
  defaultText,
  variant = "outline",
  size = "sm",
  className = ""
}: RefreshButtonProps) {
  const { t } = useTranslation();
  return (
    <Button
      onClick={onRefresh}
      disabled={disabled || refreshing}
      variant={variant}
      size={size}
      className={cn("flex items-center gap-2", className)}
    >
      <RefreshCw
        className={cn("w-4 h-4", refreshing && "animate-spin")}
      />
      {refreshing ? (refreshingText || t('dashboards.refreshing')) : (defaultText || t('dashboards.refreshAll'))}
    </Button>
  );
}
