import {
  BarChart3,
  PieChart,
  LineChart,
  CalendarDays,
  Edit,
  Trash2,
  GripVertical,
  ScatterChart,
  BarChart2,
  Map as MapIcon,
} from "lucide-react";
import { useGetWidgetData } from "@/hooks";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Widget } from "@/types/dashboard.types";
import { WidgetRenderer } from "@/components/dashboard/widget-renderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WIDGET_TYPE_ICONS = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  calendar: CalendarDays,
  "calendar-heatmap": CalendarDays,
  histogram: BarChart2,
  scatter: ScatterChart,
  card: BarChart3,
  map: MapIcon,
};

interface DraggableWidgetProps {
  widget: Widget;
  onEdit: (widgetId: string) => void;
  onDelete: (widgetId: string) => void;
  isInteractive?: boolean;
}

export default function DraggableWidget({
  widget,
  onEdit,
  onDelete,
  isInteractive = true,
}: DraggableWidgetProps) {
  const { t } = useTranslation();
  const IconComponent =
    WIDGET_TYPE_ICONS[
      widget.visualizationType as keyof typeof WIDGET_TYPE_ICONS
    ] || BarChart3;

  const {
    data: widgetDataR,
    isLoading: dataLoading,
    error: dataError,
  } = useGetWidgetData(widget.id);
  const widgetData = widgetDataR?.data;

  const shouldShowPreview = !widgetData && !dataLoading && !dataError;

  return (
    <Card className="flex w-full h-full flex-col transition-shadow duration-200 group hover:shadow-md">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {/* Drag handle */}
            {isInteractive && (
              <div
                className="drag-handle cursor-grab rounded p-1 active:cursor-grabbing hover:bg-muted"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <IconComponent className="h-5 w-5 flex-shrink-0 text-primary" />
            <CardTitle className="min-w-0 flex-1 truncate text-base">
              {widget.title || t('processManagement.untitledWidget')}
            </CardTitle>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              onClick={() => onEdit(widget.id)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onDelete(widget.id)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow flex-col pt-0">
        <div className="relative flex-grow rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100">
          <WidgetRenderer
            widget={widget}
            data={widgetData}
            loading={dataLoading}
            error={dataError?.message}
            isPreview={shouldShowPreview}
          />
        </div>

        {/* Meta Info */}
        {/* <div className="mt-3 flex flex-shrink-0 items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="rounded bg-muted px-2 py-1">
              {widget.visualizationType}
            </span>
            {widget.metrics?.length > 0 && (
              <span>
                {widget.metrics.length} metric
                {widget.metrics.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          {widgetData && (
            <div className="flex items-center gap-1.5 text-green-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              Live
            </div>
          )}
        </div> */}
      </CardContent>
    </Card>
  );
}
