import {
  BreakpointKey,
  DashboardLayoutsByBreakpoint,
  VisualizationType,
  Widget,
} from "@/types/dashboard.types";
import { Layout, Layouts } from "react-grid-layout";
import { COLS } from "@/components/dashboard/dashboard-grid";

function findFirstAvailablePosition(
  items: Layout[],
  cols: number,
  defaultSize: { w: number; h: number }
): { x: number; y: number } {
  const grid: boolean[][] = [];

  items.forEach((item) => {
    for (let dx = 0; dx < item.w; dx++) {
      for (let dy = 0; dy < item.h; dy++) {
        const gx = item.x + dx;
        const gy = item.y + dy;
        if (!grid[gy]) grid[gy] = [];
        grid[gy][gx] = true;
      }
    }
  });

  for (let y = 0; y < 100; y++) {
    for (let x = 0; x <= cols - defaultSize.w; x++) {
      let fits = true;
      for (let dx = 0; dx < defaultSize.w; dx++) {
        for (let dy = 0; dy < defaultSize.h; dy++) {
          if (grid[y + dy]?.[x + dx]) {
            fits = false;
            break;
          }
        }
        if (!fits) break;
      }
      if (fits) return { x, y };
    }
  }

  const maxY = items.length > 0 ? Math.max(...items.map((i) => i.y + i.h)) : 0;
  return { x: 0, y: maxY };
}

export function addWidgetToLayout(
  layouts: Layouts,
  widgetId: string,
  cols: Record<BreakpointKey, number> = COLS,
  widgetType?: VisualizationType
): Layouts {
  const newLayouts: Layouts = cloneLayouts(layouts);
  const isKpiCard = widgetType === 'card';

  (Object.keys(cols) as BreakpointKey[]).forEach((bp) => {
    const colCount = cols[bp];
    const existing = newLayouts[bp] || [];
    const defaultSizes = isKpiCard ? KPI_CARD_ITEM_SIZE : DEFAULT_ITEM_SIZE;
    const { w, h } = defaultSizes[bp];

    const { x, y } = findFirstAvailablePosition(existing, colCount, { w, h });

    const newItem: Layout = {
      i: String(widgetId),
      x,
      y,
      w,
      h,
      minW: Math.max(1, Math.ceil(w / 4)),
      minH: Math.max(1, Math.ceil(h / 4)),
    };

    newLayouts[bp] = [...existing, newItem];
  });

  return newLayouts;
}

export function removeWidgetFromLayout(
  layouts: Layouts,
  widgetId: string
): Layouts {
  const newLayouts: Layouts = {};
  (Object.keys(layouts) as BreakpointKey[]).forEach((bp) => {
    newLayouts[bp] = (layouts[bp] || []).filter(
      (l) => l.i !== String(widgetId)
    );
  });
  return newLayouts;
}

export const DEFAULT_ITEM_SIZE: Record<BreakpointKey, { w: number; h: number }> = {
  lg: { w: 4, h: 4 },
  md: { w: 4, h: 4 },
  sm: { w: 3, h: 4 },
  xs: { w: 4, h: 4 }, // full width on xs
  xxs: { w: 2, h: 4 }, // full width on xxs
};

export const KPI_CARD_ITEM_SIZE: Record<BreakpointKey, { w: number; h: number }> = {
  lg: { w: 2, h: 2 },
  md: { w: 2, h: 2 },
  sm: { w: 3, h: 2 },
  xs: { w: 2, h: 2 },
  xxs: { w: 1, h: 2 },
};

export function buildDefaultLayouts(widgets: Widget[]): Layouts {
  const layouts: Layouts = {};
  (Object.keys(COLS) as BreakpointKey[]).forEach((bp) => {
    const cols = COLS[bp];
    const { w, h } = DEFAULT_ITEM_SIZE[bp];
    layouts[bp] = widgets.map((wg, i) => {
      const x = (i * w) % cols;
      const y = Math.floor((i * w) / cols) * h;
      return {
        i: wg.id.toString(),
        x,
        y,
        w,
        h,
        minW: Math.max(1, Math.ceil(w / 4)),
        minH: Math.max(1, Math.ceil(h / 4)),
      };
    });
  });
  return layouts;
}

export function toRGLLayouts(
  backendLayouts: DashboardLayoutsByBreakpoint
): Layouts {
  const result: Layouts = {};
  (Object.keys(backendLayouts) as BreakpointKey[]).forEach((bp) => {
    const arr = backendLayouts[bp];
    if (arr) {
      result[bp] = arr.map((item) => ({
        i: String(item.widgetId),
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
      }));
    }
  });
  return result;
}

export function fromRGLLayouts(layouts: Layouts): DashboardLayoutsByBreakpoint {
  const result: DashboardLayoutsByBreakpoint = {};
  (Object.keys(layouts) as BreakpointKey[]).forEach((bp) => {
    const arr = layouts[bp];
    if (arr) {
      result[bp] = arr.map((item: Layout) => ({
        widgetId: String(item.i),
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
      }));
    }
  });
  return result;
}
export function cloneLayouts(layouts: Layouts): Layouts {
  const clone: Layouts = {};
  Object.keys(layouts).forEach((bp) => {
    clone[bp] = layouts[bp]?.map((l: Layout) => ({ ...l })) || [];
  });
  return clone;
}
