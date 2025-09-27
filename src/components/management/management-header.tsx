// import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";

interface ManagementHeaderProps {
  title: string;
  description: string;
}

const ManagementHeader: React.FC<ManagementHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default ManagementHeader;
