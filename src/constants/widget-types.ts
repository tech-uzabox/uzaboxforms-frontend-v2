import type {
  AggregationType,
  GroupByKind,
  SystemField,
  VisualizationType,
  WidgetTypeConfig,
  SystemFieldConfig,
  IWidgetAppearance,
} from "@/types/dashboard.types";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Map as MapIcon
} from "lucide-react";

// Widget type configuration is now imported from types

export const WIDGET_TYPES: WidgetTypeConfig[] = [
  {
    type: "card",
    name: "KPI Card",
    description: "Display a single key metric",
    icon: TrendingUp,
    requiresGroupBy: false,
    supportsMultiMetric: false,
    requiredFields: ["metric"],
    supportedAggregations: [
      "count",
      "sum",
      "mean",
      "median",
      "mode",
      "min",
      "max",
      "std",
      "variance",
      "p10",
      "p25",
      "p50",
      "p75",
      "p90",
    ],
    maxMetrics: 1,
  },
  {
    type: "bar",
    name: "Bar Chart",
    description: "Compare values across categories",
    icon: BarChart3,
    requiresGroupBy: true,
    supportsMultiMetric: true,
    requiredFields: ["groupBy"],
    supportedAggregations: [
      "count",
      "sum",
      "mean",
      "median",
      "mode",
      "min",
      "max",
      "std",
      "variance",
      "p10",
      "p25",
      "p50",
      "p75",
      "p90",
    ],
    groupByTypes: ["categorical", "time"],
    maxMetrics: 5,
  },
  {
    type: "line",
    name: "Line Chart",
    description: "Show trends over time",
    icon: LineChart,
    requiresGroupBy: true,
    supportsMultiMetric: true,
    requiredFields: ["groupBy"],
    supportedAggregations: [
      "count",
      "sum",
      "mean",
      "median",
      "mode",
      "min",
      "max",
      "std",
      "variance",
      "p10",
      "p25",
      "p50",
      "p75",
      "p90",
    ],
    groupByTypes: ["time"], // Time only for line charts
    maxMetrics: 5,
  },
  {
    type: "pie",
    name: "Pie Chart",
    description: "Show proportions and percentages",
    icon: PieChart,
    requiresGroupBy: true,
    supportsMultiMetric: false,
    requiredFields: ["groupBy"],
    supportedAggregations: [
      "count",
      "sum",
      "mean",
      "median",
      "mode",
      "min",
      "max",
      "std",
      "variance",
      "p10",
      "p25",
      "p50",
      "p75",
      "p90",
    ],
    groupByTypes: ["categorical"], // Categorical only
    maxMetrics: 1,
  },
  {
    type: "map",
    name: "Map",
    description: "Africa map by country",
    icon: MapIcon,
    requiresGroupBy: false,
    supportsMultiMetric: true,
    requiredFields: [],
    supportedAggregations: [],
    maxMetrics: 10,
  },
  // {
  //   type: "histogram",
  //   name: "Histogram",
  //   description: "Show distribution of numeric values",
  //   icon: BarChart3,
  //   requiresGroupBy: false,
  //   supportsMultiMetric: false,
  //   requiredFields: ["numericField"],
  //   supportedAggregations: [
  //     "count",
  //     "sum",
  //     "mean",
  //     "median",
  //     "mode",
  //     "min",
  //     "max",
  //     "std",
  //     "variance",
  //     "p10",
  //     "p25",
  //     "p50",
  //     "p75",
  //     "p90",
  //   ],
  //   fieldTypes: ["number"], // Numeric fields only
  //   maxMetrics: 1,
  // },
  // {
  //   type: "scatter",
  //   name: "Scatter Plot",
  //   description: "Show correlation between two numeric values",
  //   icon: ScatterChart,
  //   requiresGroupBy: false,
  //   supportsMultiMetric: false,
  //   requiredFields: ["xField", "yField"],
  //   supportedAggregations: [],
  //   fieldTypes: ["number"], // Both fields must be numeric
  //   maxMetrics: 2, // X and Y fields
  // },
  // {
  //   type: "calendar-heatmap",
  //   name: "Calendar Heatmap",
  //   description: "Visualize data over calendar periods",
  //   icon: CalendarDays,
  //   requiresGroupBy: false,
  //   supportsMultiMetric: false,
  //   requiredFields: ["dateField"],
  //   supportedAggregations: [],
  //   fieldTypes: ["date"], // Date field required
  //   systemFields: ["$submissionDate$"], // Uses system date field
  //   maxMetrics: 1,
  // },
];

// System fields configuration is now imported from types

export const SYSTEM_FIELDS: SystemFieldConfig[] = [
  {
    id: "$responseId$",
    label: "Response ID",
    type: "categorical",
    description: "Unique identifier for each form response",
    supportedAggregations: ["count"],
    availableFor: ["groupBy", "metric"],
  },
  {
    id: "$submissionDate$",
    label: "Submission Date",
    type: "datetime",
    description: "Date and time when form was submitted",
    supportedAggregations: ["count", "min", "max"],
    availableFor: ["groupBy", "metric", "filter"],
    timeBuckets: [
      "year",
      "quarter",
      "month",
      "week",
      "day",
      "hour",
      "minute",
      "whole",
    ],
  },
];

// Helper functions
export function getWidgetTypeConfig(
  type: VisualizationType
): WidgetTypeConfig | undefined {
  return WIDGET_TYPES.find((w) => w.type === type);
}

export function supportsMultiMetric(type: VisualizationType): boolean {
  const config = getWidgetTypeConfig(type);
  return config?.supportsMultiMetric || false;
}

export function requiresGroupBy(type: VisualizationType): boolean {
  const config = getWidgetTypeConfig(type);
  return config?.requiresGroupBy || false;
}

export function getSupportedAggregations(
  type: VisualizationType
): AggregationType[] {
  const config = getWidgetTypeConfig(type);
  return config?.supportedAggregations || [];
}

export function getMaxMetrics(type: VisualizationType): number {
  const config = getWidgetTypeConfig(type);
  return config?.maxMetrics || 1;
}

export function getSupportedGroupByTypes(
  type: VisualizationType
): GroupByKind[] {
  const config = getWidgetTypeConfig(type);
  return config?.groupByTypes || ["categorical", "time"];
}

export function getSystemField(
  fieldId: SystemField
): SystemFieldConfig | undefined {
  return SYSTEM_FIELDS.find((f) => f.id === fieldId);
}

// Date granularity options for UI
export const DATE_GRANULARITY_OPTIONS = [
  { value: "minute", label: "Minute" },
  { value: "hour", label: "Hour" },
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
  { value: "whole", label: "Exact Timestamp" },
] as const;

export const CHART_APPEARANCE_DEFAULTS: IWidgetAppearance = {
  backgroundColor: "transparent",
  paletteMode: "preset",
  presetCategoricalPaletteId: "default",
  legend: true,
  showXAxisLabels: true,
  showYAxisLabels: true,
  barOrientation: "vertical",
  barCombinationMode: "grouped",
  xAxisLabelRotation: 0,
  lineStyle: "solid",
  showPoints: true,
  pointSize: 3,
  showGrid: true,
  gridStyle: "solid",
  gridColor: "#e5e7eb", // A light gray
};
