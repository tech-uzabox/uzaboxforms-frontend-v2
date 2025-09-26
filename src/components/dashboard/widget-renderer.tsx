"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  getSequentialColor,
  resolveSeriesColor,
  SequentialPaletteId,
} from "@/lib/palettes";
import numeral from "numeral";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React, { useMemo } from "react";

import { useTranslation } from 'react-i18next';
import "react-calendar-heatmap/dist/styles.css";
import CalendarHeatmap from "react-calendar-heatmap";
import { AlertCircle, BarChart3, TrendingUp } from "lucide-react";
import { CHART_APPEARANCE_DEFAULTS } from "@/constants/widget-types";
import MapWidget from "@/components/dashboard/widgets/map/map-widget";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IWidgetAppearance, WidgetDataPayload } from "@/types/dashboard.types";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

// ------------------------------------
// Formatters
// ------------------------------------
function isValidNumber(str: any) {
        return !isNaN(Number(str)) && str !== ''; // Also check for empty string
    }
const isDateTimeString = (value: any): boolean => {
  if (typeof value !== "string") return false;

  // Try parsing
  const timestamp = Date.parse(value);

  // Valid if parseable and results in a real date
  if (isNaN(timestamp)) return false;

  // Double-check with Date object (avoids edge cases like "0000-00-00")
  const d = new Date(timestamp);
  return d.toString() !== "Invalid Date";
};

export const formatXAxisTick = (tick: any): string => {
  if (isValidNumber(tick)) {
    return numeral(Number(tick)).format("0.[0]a"); // e.g., 44.7M, 1.2K
  }
  if (typeof tick === "string") {
    if (isDateTimeString(tick)) {
      const date = new Date(tick);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
    }
    if (tick.length > 6) {
      return tick.substring(0, 6);
    }
    return tick;
  }
  return String(tick);
};

export const formatTooltipLabel = (label: any): string => {
  if (isValidNumber(label)) {
    return numeral(Number(label)).format("0.[0]a"); // e.g., 44.7M, 1.2K
  }
  if (typeof label === "string" && isDateTimeString(label)) {
    const date = new Date(label);
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "UTC",
    });
  }
  return String(label);
};

// ------------------------------------

// Color palette integration helper
const getChartColors = (
  series: any[],
  appearance: IWidgetAppearance
): string[] => {
  return series.map((s, index) => {
    // Check for individual metric color override
    if (s.metricId && appearance.customColors?.[s.metricId]) {
      return appearance.customColors[s.metricId];
    }

    // Use palette system
    return resolveSeriesColor(
      index,
      appearance.paletteMode,
      appearance.presetCategoricalPaletteId,
      appearance.customColors
    );
  });
};

// @ts-ignore
const formatValue = (v: any) =>
  v === null || v === undefined
    ? "-"
    : typeof v === "number"
    ? v.toLocaleString()
    : String(v);

// @ts-ignore
const formatDate = (d: any) => new Date(d).toLocaleDateString();

const EmptyState = ({ msg }: { msg: string }) => (
  <div className="flex h-full flex-col items-center justify-center p-4 text-sm text-muted-foreground">
    <BarChart3 className="mb-2 h-12 w-12 text-gray-300" />
    <p className="text-center">{msg}</p>
  </div>
);

const ErrorState = ({ errs }: { errs: string[] }) => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('processManagement.error')}</AlertTitle>
        <AlertDescription>{errs.join(", ")}</AlertDescription>
      </Alert>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="h-full w-full p-4">
    <div className="h-full min-h-[140px] w-full animate-pulse rounded bg-muted" />
  </div>
);

// ------------------------------------
// Preview Data Generator
// ------------------------------------
// Provides safe, meaningful preview data so previews render inside resizable
// grid items without overflow.
function createPreviewData(widget: any): WidgetDataPayload | null {
  const type = widget?.visualizationType || "bar";

  if (type === "card") {
    return {
      type: "card",
      value: 12890,
      statLabel: "Total Sales",
    } as WidgetDataPayload;
  }

  if (type === "bar") {
    const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const seriesNames =
      widget?.metrics?.length > 0
        ? widget.metrics.map((m: any) => m.label || m.name || "Series")
        : ["Revenue", "Cost"];
    return {
      type: "bar",
      categories,
      series: seriesNames.map((name: string, idx: number) => ({
        name,
        data: categories.map((_, i) =>
          Math.round(500 + Math.sin(i + idx) * 200 + i * 50)
        ),
      })),
    } as WidgetDataPayload;
  }

  if (type === "line") {
    const x = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const seriesNames =
      widget?.metrics?.length > 0
        ? widget.metrics.map((m: any) => m.label || m.name || "Series")
        : ["Signups", "Active"];
    return {
      type: "line",
      x,
      series: seriesNames.map((name: string, idx: number) => ({
        name,
        data: x.map((_, i) => Math.round(50 + Math.cos(i + idx) * 20 + i * 5)),
      })),
    } as WidgetDataPayload;
  }

  if (type === "pie") {
    const slices = [
      { label: "A", value: 45 },
      { label: "B", value: 25 },
      { label: "C", value: 15 },
      { label: "D", value: 15 },
    ];
    return {
      type: "pie",
      slices,
    } as WidgetDataPayload;
  }

  if (type === "histogram") {
    const bins = Array.from({ length: 8 }).map((_, i) => ({
      label: `${i * 10}-${i * 10 + 10}`,
    }));
    const seriesNames =
      widget?.metrics?.length > 0
        ? widget.metrics.map((m: any) => m.label || m.name || "Series")
        : ["Values"];
    return {
      type: "histogram",
      bins,
      series: seriesNames.map((name: string) => ({
        name,
        data: bins.map(() => Math.round(Math.random() * 100)),
      })),
    } as WidgetDataPayload;
  }

  if (type === "scatter") {
    const seriesNames =
      widget?.metrics?.length > 0
        ? widget.metrics.map((m: any) => m.label || m.name || "Series")
        : ["Cluster A", "Cluster B"];
    return {
      type: "scatter",
      series: seriesNames.map((name: string, idx: number) => ({
        name,
        points: Array.from({ length: 24 }).map((_, i) => ({
          x: i + idx * 0.5 + Math.random(),
          y: Math.round(40 + Math.sin(i * 0.4 + idx) * 15 + Math.random() * 8),
        })),
      })),
    } as WidgetDataPayload;
  }

  if (type === "calendar-heatmap") {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 180);
    const values = Array.from({ length: 181 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        date: d.toISOString().slice(0, 10),
        value: Math.floor(Math.random() * 5),
      };
    });
    return {
      type: "calendar-heatmap",
      startDate: start,
      endDate: end,
      values,
    } as any;
  }

  return null;
}

// ------------------------------------
// Main Renderer
// ------------------------------------

interface WidgetRendererProps {
  data?: WidgetDataPayload | null | { data: WidgetDataPayload };
  widget?: any;
  loading?: boolean;
  error?: string;
  isPreview?: boolean;
}

export function WidgetRenderer({
  data: rawData,
  widget,
  loading,
  error,
  isPreview,
}: WidgetRendererProps) {
  const { t } = useTranslation();
  const displayData = useMemo(() => {
    let data = rawData as any;
    if (rawData && typeof rawData === "object" && "data" in rawData) {
      data = (rawData as any).data;
    }

    if (isPreview && widget) return createPreviewData(widget);
    return data as WidgetDataPayload | null | undefined;
  }, [isPreview, widget, rawData]);

  const appearance: IWidgetAppearance = useMemo(
    () => ({
      ...CHART_APPEARANCE_DEFAULTS,
      ...(widget?.appearance || {}),
    }),
    [widget?.appearance]
  );

  // Loading / Error / Empty handling
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState errs={[error]} />;
  if (!displayData)
    return (
      <EmptyState
        msg={isPreview ? t('processManagement.configureToSeePreview') : t('processManagement.noDataAvailable')}
      />
    );
  if ((displayData as any).empty)
    return <EmptyState msg={t('processManagement.noDataForSelectedCriteria')} />;
  if ((displayData as any).errors?.length)
    return <ErrorState errs={(displayData as any).errors} />;

  // Container: fills parent grid item height and prevents overflow issues.
  return (
    <div className="relative h-full w-full">
      {displayData.type === "card" && (
        <CardView data={displayData as any} appearance={appearance} />
      )}
      {displayData.type === "bar" && (
        <BarView data={displayData as any} appearance={appearance} />
      )}
      {displayData.type === "line" && (
        <LineView data={displayData as any} appearance={appearance} />
      )}
      {displayData.type === "pie" && (
        <PieView data={displayData as any} appearance={appearance} />
      )}
      {displayData.type === "histogram" && (
        <HistogramView data={displayData as any} appearance={appearance} />
      )}
      {displayData.type === "scatter" && (
        <ScatterView data={displayData as any} appearance={appearance} />
      )}
      {displayData.type === "calendar-heatmap" && (
        <CalendarHeatmapView
          data={displayData as any}
          appearance={appearance}
        />
      )}
      {displayData.type === "map" && (
        <MapView data={displayData as any} appearance={appearance} widget={widget} />
      )}
      {![
        "card",
        "bar",
        "line",
        "pie",
        "histogram",
        "scatter",
        "calendar-heatmap",
        "map",
      ].includes(displayData.type) && (
        <EmptyState
          msg={t('processManagement.unknownWidgetType', { type: displayData.type || 'undefined' })}
        />
      )}
    </div>
  );
}

// ------------------------------------
// Shared types for chart subcomponents
// ------------------------------------

interface ChartViewProps<T> {
  data: T;
  appearance: IWidgetAppearance;
}

// ------------------------------------
// Chart Implementations
// ------------------------------------

const formatCompactNumber = (value: any): string => {
  if (typeof value !== 'number') {
    return "-";
  }
  return numeral(value).format("0,0.[0]a").toUpperCase();
};


function CardView({
  data,
}: ChartViewProps<Extract<WidgetDataPayload, { type: "card" }>>) {
  const { t } = useTranslation();
  const value = (data as any).value;
  const fullValue = typeof value === 'number' ? value.toLocaleString() : "-";
  const compactValue = formatCompactNumber(value);

  return (
    <div className="flex h-full min-h-[120px] flex-col justify-between p-4 sm:p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-5 w-5 flex-shrink-0" />
        <p className="truncate">{(data as any).statLabel || t('processManagement.metric')}</p>
      </div>
      <div className="text-right">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-3xl font-bold leading-none tracking-tight text-primary sm:text-4xl cursor-pointer">
                {compactValue}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fullValue}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

function BarView({
  data,
  appearance,
}: ChartViewProps<Extract<WidgetDataPayload, { type: "bar" }>>) {
  const categories = (data as any).categories as string[];
  const series = (data as any).series as { name: string; data: number[] }[];

  const chartData = useMemo(
    () =>
      categories.map((cat, i) => ({
        category: String(cat),
        ...series.reduce(
          (acc, s) => ({ ...acc, [s.name]: s.data[i] ?? 0 }),
          {}
        ),
      })),
    [categories, series]
  );

  const chartColors = useMemo(
    () => getChartColors(series, appearance),
    [series, appearance]
  );

  const chartConfig = useMemo(
    () =>
      series.reduce(
        (acc, s, i) => ({
          ...acc,
          [s.name?.split(" ")?.join("")]: {
            label: s.name,
            color: chartColors[i],
          },
        }),
        {}
      ),
    [series, chartColors]
  );

  const isHorizontal = appearance.barOrientation === "horizontal";

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout={isHorizontal ? "vertical" : "horizontal"}
        // margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {appearance.showGrid && (
          <CartesianGrid vertical={!isHorizontal} horizontal={isHorizontal} />
        )}

        {isHorizontal && appearance.showXAxisLabels && (
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={formatXAxisTick}
          />
        )}
        {isHorizontal && appearance.showYAxisLabels && (
          <YAxis
            type="category"
            dataKey="category"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tickFormatter={formatXAxisTick}
            width={Math.min(120, Math.max(60, categories?.length * 4))}
          />
        )}

        {!isHorizontal && (
          <XAxis
            dataKey="category"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatXAxisTick}
            angle={appearance.xAxisLabelRotation}
            height={appearance.xAxisLabelRotation !== 0 ? 48 : 24}
          />
        )}
        {!isHorizontal && appearance.showYAxisLabels && (
          <YAxis allowDecimals tickMargin={6} tickFormatter={formatXAxisTick} />
        )}
        <ChartTooltip
          cursor={false}
          labelFormatter={formatTooltipLabel}
          content={<ChartTooltipContent />}
        />
        {appearance.legend && series.length > 1 && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {series.map((s) => (
          <Bar
            key={s.name}
            dataKey={s.name}
            fill={`var(--color-${s.name?.split(" ")?.join("")})`}
            radius={appearance.barCombinationMode === "stacked" ? 0 : 4}
            stackId={
              appearance.barCombinationMode === "stacked" ? "a" : undefined
            }
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

function LineView({
  data,
  appearance,
}: ChartViewProps<Extract<WidgetDataPayload, { type: "line" }>>) {
  const x = (data as any).x as string[];
  const series = (data as any).series as { name: string; data: number[] }[];

  const chartData = useMemo(
    () =>
      x.map((xi, i) => ({
        x: String(xi),
        ...series.reduce(
          (acc, s) => ({ ...acc, [s.name]: s.data[i] ?? null }),
          {}
        ),
      })),
    [x, series]
  );

  const chartColors = useMemo(
    () => getChartColors(series, appearance),
    [series, appearance]
  );

  const chartConfig = useMemo(
    () =>
      series.reduce(
        (acc, s, i) => ({
          ...acc,
          [s.name]: { label: s.name, color: chartColors[i] },
        }),
        {}
      ),
    [series, chartColors]
  );

  const lineStyleMap: Record<string, string | undefined> = {
    solid: undefined,
    dashed: "5 5",
    dotted: "1 5",
  };

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        // margin={}
      >
        {appearance.showGrid && <CartesianGrid vertical={false} />}

        {appearance.showXAxisLabels && (
          <XAxis
            dataKey="x"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatXAxisTick}
          />
        )}
        {appearance.showYAxisLabels && <YAxis allowDecimals tickMargin={6} />}
        <ChartTooltip
          cursor={false}
          labelFormatter={formatTooltipLabel}
          content={<ChartTooltipContent />}
        />
        {appearance.legend && series.length > 1 && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {series.map((s) => (
          <Line
            key={s.name}
            dataKey={s.name}
            type="natural"
            strokeWidth={2}
            stroke={lineStyleMap[appearance.lineStyle]}
            dot={appearance.showPoints ? { r: appearance.pointSize } : false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

function PieView({
  data,
  appearance,
}: ChartViewProps<Extract<WidgetDataPayload, { type: "pie" }>>) {
  const slices = (data as any).slices as { label: string; value: number }[];

  const sliceColors = useMemo(() => {
    return slices.map((_slice, index) => {
      return resolveSeriesColor(
        index,
        appearance.paletteMode,
        appearance.presetCategoricalPaletteId,
        appearance.customColors
      );
    });
  }, [slices, appearance]);

  const chartConfig = useMemo(
    () =>
      slices.reduce(
        (acc, slice, i) => ({
          ...acc,
          [slice.label]: {
            label: slice.label,
            color: sliceColors[i],
          },
        }),
        {}
      ),
    [slices, sliceColors]
  );

  const enhancedSlices = useMemo(
    () =>
      slices.map((slice, i) => ({
        ...slice,
        fill: sliceColors[i],
      })),
    [slices, sliceColors]
  );

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <PieChart
      // margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        <ChartTooltip
          labelFormatter={formatTooltipLabel}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={enhancedSlices}
          dataKey="value"
          nameKey="label"
          // paddingAngle={2}
        />
        {appearance.legend && (
          <ChartLegend content={<ChartLegendContent nameKey="label" />} />
        )}
      </PieChart>
    </ChartContainer>
  );
}

function HistogramView({
  data,
  appearance,
}: ChartViewProps<Extract<WidgetDataPayload, { type: "histogram" }>>) {
  const bins = (data as any).bins as { label: string }[];
  const series = (data as any).series as { name: string; data: number[] }[];

  const chartData = useMemo(
    () =>
      bins.map((bin, i) => ({
        bin: String(bin.label),
        ...series.reduce(
          (acc, s) => ({ ...acc, [s.name]: s.data[i] ?? 0 }),
          {}
        ),
      })),
    [bins, series]
  );

  const chartColors = useMemo(
    () => getChartColors(series, appearance),
    [series, appearance]
  );

  const chartConfig = useMemo(
    () =>
      series.reduce(
        (acc, s, i) => ({
          ...acc,
          [s.name?.split(" ")?.join("")]: {
            label: s.name,
            color: chartColors[i],
          },
        }),
        {}
      ),
    [series, chartColors]
  );

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {appearance.showGrid && <CartesianGrid vertical={false} />}
        {appearance.showXAxisLabels && (
          <XAxis
            dataKey="bin"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            angle={appearance.xAxisLabelRotation}
            height={appearance.xAxisLabelRotation !== 0 ? 48 : 24}
          />
        )}
        {appearance.showYAxisLabels && <YAxis allowDecimals tickMargin={6} />}
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        {appearance.legend && series.length > 1 && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {series.map((s) => (
          <Bar
            key={s.name}
            dataKey={s.name}
            radius={4}
            fill={`var(--color-${s.name?.split(" ")?.join("")})`}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

function ScatterView({
  data,
  appearance,
}: ChartViewProps<Extract<WidgetDataPayload, { type: "scatter" }>>) {
  const series = (data as any).series as {
    name: string;
    points: { x: number; y: number }[];
  }[];

  const chartColors = useMemo(
    () => getChartColors(series, appearance),
    [series, appearance]
  );

  const chartConfig = useMemo(
    () =>
      series.reduce(
        (acc, s, i) => ({
          ...acc,
          [s.name]: { label: s.name, color: chartColors[i] },
        }),
        {}
      ),
    [series, chartColors]
  );

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ScatterChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
        {appearance.showGrid && (
          <CartesianGrid
            stroke={appearance.gridColor}
            strokeDasharray={
              appearance.gridStyle === "dashed"
                ? "3 3"
                : appearance.gridStyle === "dotted"
                ? "1 3"
                : undefined
            }
          />
        )}
        {appearance.showXAxisLabels && (
          <XAxis
            type="number"
            dataKey="x"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
        )}
        {appearance.showYAxisLabels && (
          <YAxis
            type="number"
            dataKey="y"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
        )}
        <ChartTooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={<ChartTooltipContent />}
        />
        {appearance.legend && series.length > 1 && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {series.map((s, i) => (
          <Scatter
            key={s.name}
            name={s.name}
            data={s.points}
            fill={chartColors[i]}
          />
        ))}
      </ScatterChart>
    </ChartContainer>
  );
}

function CalendarHeatmapView({
  data,
  appearance,
}: ChartViewProps<Extract<WidgetDataPayload, { type: "calendar-heatmap" }>>) {
  const values = (data as any).values as { date: string; value: number }[];
  const startDate = (data as any).startDate as Date | string;
  const endDate = (data as any).endDate as Date | string;

  const maxValue = useMemo(
    () => Math.max(1, ...values.map((v) => v.value)),
    [values]
  );

  return (
    <div className="flex h-full w-full items-center overflow-auto p-2">
      <CalendarHeatmap
        startDate={startDate as any}
        endDate={endDate as any}
        values={values}
        // tooltipDataAttrs={(v: any) =>
        //   v?.date
        //     ? { "data-tip": `${formatDate(v.date)}: ${formatValue(v.value)}` }
        //     : {}
        // }
        transformDayElement={(rect: any, value: any, index: number) => {
          const fill = getSequentialColor(
            value?.value || 0,
            maxValue,
            (appearance.presetSequentialPaletteId ||
              "blue") as SequentialPaletteId
          );
          return React.cloneElement(rect, {
            key: index,
            style: { fill, rx: 2, cursor: "pointer" },
          });
        }}
      />
    </div>
  );
}

function MapView({ data, widget }: ChartViewProps<Extract<WidgetDataPayload, { type: "map" }>> & { widget: any }) {
  return (
    <div className="h-full w-full">
      <MapWidget data={data} widget={widget} />
    </div>
  );
}
