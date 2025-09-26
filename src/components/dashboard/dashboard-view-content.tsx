import { IWidget } from "@/types/dashboard.types";
import { Layouts } from "react-grid-layout";
import DashboardGrid from "@/components/dashboard/dashboard-grid";
import { DashboardWidgetsEmptyState } from "@/components/dashboard/dashboard-widgets-empty-state";

interface DashboardViewContentProps {
  widgets: IWidget[];
  layouts: Layouts | null;
  orderedWidgets: IWidget[];
}

export function DashboardViewContent({
  widgets,
  layouts,
  orderedWidgets
}: DashboardViewContentProps) {
  if (widgets.length === 0) {
    return <DashboardWidgetsEmptyState />;
  }

  if (!layouts) {
    return null;
  }

  // Convert IWidget to Widget type for the DashboardGrid component
  const convertedWidgets = orderedWidgets.map(widget => ({
    ...widget,
    type: widget.visualizationType as any,
    formId: widget.sources?.[0]?.formId || ''
  }));

  return (
    <DashboardGrid
      widgets={convertedWidgets as any}
      layouts={layouts}
      onEdit={() => {}}
      onDelete={() => {}}
      onLayoutsChange={() => {}}
      isInteractive={false}
      rowHeight={120}
    />
  );
}
