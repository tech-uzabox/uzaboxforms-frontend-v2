import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";

interface InfoPanelProps {
  title: string;
  items: string[];
  icon?: string;
  className?: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  title,
  items,
  icon = "material-symbols:info",
  className = "bg-blue-50/50 border-blue-200/50",
}) => {

  return (
    <Card className={`${className} shadow-none`}>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <Icon icon={icon} className="text-blue-800 text-xl mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-medium text-blue-900">{title}</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              {items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoPanel;
