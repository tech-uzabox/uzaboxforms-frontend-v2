import React from "react";
import {
  Responsive,
  WidthProvider,
  Layouts,
  Layout,
} from "react-grid-layout";
import "react-resizable/css/styles.css";
import "react-grid-layout/css/styles.css";
import { BreakpointKey, Widget } from "@/types/dashboard.types";
import DraggableWidget from "@/components/widget-builder/draggable-widget";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  widgets: Widget[];
  layouts: Layouts; // controlled layouts
  onEdit: (widgetId: string) => void;
  onDelete: (widgetId: string) => void;
  onLayoutsChange: (
    currentLayout: Layout[],
    allLayouts: Layouts,
    activeBreakpoint: BreakpointKey
  ) => void;
  onBreakpointChange?: (bp: BreakpointKey) => void;
  isInteractive?: boolean;
  rowHeight?: number; // optional, defaults to 120
}

export const BREAKPOINTS: Record<BreakpointKey, number> = {

  lg: 900,   // was 1200
  md: 700,   // was 996
  sm: 500,   // was 768
  xs: 300,   // was 480
  xxs: 0,

};

export const COLS: Record<BreakpointKey, number> = {
  lg: 8,
  md: 8,
  sm: 6,
  xs: 4,
  xxs: 2,
};

export default function DashboardGrid({
  widgets,
  layouts,
  onEdit,
  onDelete,
  onLayoutsChange,
  onBreakpointChange,
  isInteractive = true,
  rowHeight = 120, // ✅ fixed rowHeight
}: DashboardGridProps) {
  const [activeBreakpoint, setActiveBreakpoint] =
    React.useState<BreakpointKey>("lg");

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={BREAKPOINTS}
      cols={COLS}
      rowHeight={rowHeight} // ✅ fixed
      margin={[12, 12]}
      containerPadding={[8, 8]}
      compactType="vertical"
      draggableHandle=".drag-handle"
      isDraggable={isInteractive}
      isResizable={isInteractive}
      onBreakpointChange={(bp) => {
        const key = bp as BreakpointKey;
        setActiveBreakpoint(key);
        onBreakpointChange?.(key);
      }}
      onLayoutChange={(currentLayout, allLayouts) => {
        onLayoutsChange(currentLayout, allLayouts, activeBreakpoint);
      }}
    >
      {widgets.map((widget) => (
        <div key={widget.id.toString()}>
          <DraggableWidget
            widget={widget}
            onEdit={onEdit}
            onDelete={onDelete}
            isInteractive={isInteractive}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
