import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { IDashboard } from "@/types/dashboard.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  dashboard: IDashboard;
}

export function DashboardCard({ dashboard }: DashboardCardProps) {
  const { t } = useTranslation();
  return (
    <Link to={`/dashboards/${dashboard.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow duration-200 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-[#3F4247] truncate">
                {dashboard.name}
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-gray-500">
                {t('processManagement.created')}{" "}
                {new Date(dashboard.createdAt || "").toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-end text-sm text-gray-600">
            <div className="flex items-center gap-1 text-[#012473] font-medium">
              <Eye className="w-4 h-4" />
              <span>{t('processManagement.view')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
