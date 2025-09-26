// import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";

interface ManagementHeaderProps {
  title: string;
  description: string;
  badgeText: string;
  badgeIcon?: string;
}

const ManagementHeader: React.FC<ManagementHeaderProps> = ({
  title,
  description,
  badgeText,
  badgeIcon = "material-symbols:image",
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
      <Badge variant="outline" className="text-sm">
        <Icon icon={badgeIcon} className="mr-1" />
        {badgeText}
      </Badge>
    </div>
  );
};

export default ManagementHeader;
