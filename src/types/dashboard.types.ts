
// Core visualization and aggregation types
export type VisualizationType =
  | "bar"
  | "line"
  | "pie"
  | "histogram"
  | "scatter"
  | "card"
  | "calendar-heatmap"
  | "map";

export interface IWidgetAppearance {
  backgroundColor: string;
  paletteMode: 'preset' | 'custom';
  presetCategoricalPaletteId: string;
  presetSequentialPaletteId?: string;
  customColors?: string[];
  legend: boolean;
  showXAxisLabels: boolean;
  showYAxisLabels: boolean;
  barOrientation: 'vertical' | 'horizontal';
  barCombinationMode: 'grouped' | 'stacked';
  xAxisLabelRotation: number;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  showPoints: boolean;
  pointSize: number;
  showGrid: boolean;
  gridStyle: 'solid' | 'dashed' | 'dotted';
  gridColor: string;
}

// Enhanced widget types for frontend builder - all supported visualizations
export type WidgetType = 'card' | 'bar' | 'line' | 'pie' | 'histogram' | 'scatter' | 'calendar';

export type AggregationType =
  | "count"
  | "sum"
  | "mean"
  | "median"
  | "mode"
  | "min"
  | "max"
  | "std"
  | "variance"
  | "p10"
  | "p25"
  | "p50"
  | "p75"
  | "p90";

export type GroupByKind = "none" | "categorical" | "time";
export type TimeBucket = "year" | "quarter" | "month" | "week" | "day" | "hour" | "minute" | "whole";
export type DateGranularity = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' | 'whole';
export type SystemField = "$responseId$" | "$submissionDate$";
export type SortOption = "alpha-asc" | "alpha-desc" | "value-asc" | "value-desc" | "time-asc" | "time-desc";
export type DateRangePreset = "last-7-days" | "last-30-days" | "last-3-months" | "last-6-months" | "last-12-months" | "custom";
// Filter types
export type NumericFilterOp = "eq" | "gt" | "lt" | "neq" | "gte" | "lte";
export type CategoryFilterOp = "eq" | "in" | "neq" | "contains" | "starts_with" | "ends_with";
export type DateFilterOp =
  | "eq" | "eq-day" | "eq-month" | "eq-year" | "eq-hour" | "eq-minute"
  | "range" | "date_before" | "date_after"
  | "last_n_days" | "last_n_months" | "last_n_years";

// Dashboard interfaces
export interface IDashboard {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  allowedUsers: string[];
  allowedRoles: string[];
  widgetOrder: string[];
  widgets?: Widget[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Widget configuration interfaces
export interface IWidgetMetric {
  id: string;
  label?: string;
  formId: string;
  fieldId?: string;
  systemField?: SystemField;
  aggregation: AggregationType;
  mode?: 'aggregation' | 'value'; // New: Metric mode
  // Enhanced: Metric-specific appearance
  appearance?: {
    color?: string;
    lineStyle?: 'solid' | 'dashed' | 'dotted'; // For line charts
    barStyle?: 'solid' | 'pattern'; // For bar charts
  };
}

export interface IWidgetSource {
  formId: string;
  fieldId?: string;
  systemField?: SystemField;
}

export interface IWidgetGroupBy {
  kind: GroupByKind;
  fieldId?: string;
  systemField?: SystemField;
  timeBucket?: TimeBucket;
  includeMissing?: boolean;
  // Enhanced: Date granularity support
  dateGranularity?: DateGranularity;
}

export interface IWidgetDateRange {
  preset: DateRangePreset;
  from?: Date;
  to?: Date;
}

export interface IWidgetFilter {
  id: string;
  formId: string;
  fieldId?: string;
  systemField?: SystemField;
  operator: string;
  value?: any;
}

export interface INumericFilter extends IWidgetFilter {
  kind: 'numeric';
  op: NumericFilterOp;
  value: number;
}

export interface ICategoryFilter extends IWidgetFilter {
  kind: 'category';
  op: CategoryFilterOp;
  value: string[];
}

export interface IDateFilter extends IWidgetFilter {
  kind: 'date';
  op: DateFilterOp;
  value?: string;
  from?: string;
  to?: string;
  // Enhanced: Date granularity for filters
  granularity?: DateGranularity;
}

export interface IWidgetRealTime {
  enabled: boolean;
  throttleSeconds: number;
}

// Simplified widget interface for frontend
export interface Widget {
  visualizationType: any;
  id: string;
  dashboardId: string;
  title: string;
  description?: string;
  type: WidgetType;
  formId: string;
  configuration?: {
    xField?: string;
    yField?: string;
    groupByField?: string;
    dateField?: string;
    valueField?: string;
    multiMetrics?: string[];
    aggregationType?: 'count' | 'sum' | 'avg' | 'min' | 'max';
    filters?: Array<{
      field: string;
      operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
      value: any;
    }>;
    colorPalette?: 'categorical' | 'sequential';
    showLegend?: boolean;
    showLabels?: boolean;
  };
  allowedUsers?: string[];
  allowedRoles?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Main widget interface for backend compatibility
export interface IWidget {
  id: string;
  dashboardId: string;
  title: string;
  description?: string;
  visualizationType: VisualizationType;

  valueModeFieldId?: string

  // Multi-metric configuration for Bar/Line charts
  metrics?: IWidgetMetric[];
  metricMode?: 'aggregation' | 'value'; // New: Widget metric mode

  // Legacy single-source config for other visualizations
  sources?: IWidgetSource[];
  aggregation?: AggregationType;

  // Shared configuration
  groupBy: IWidgetGroupBy;
  dateRange: IWidgetDateRange;
  filters: IWidgetFilter[];
  topN?: 5 | 10 | 15 | 20;
  sort?: SortOption;
  combinationMode?: string;
  appearance?: IWidgetAppearance;
  options?: any;
  realTime?: IWidgetRealTime;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Widget data payload types (what comes from the API)
export type Series = {
  name: string;
  data: number[];
  metricId?: string;
};

export type WidgetDataPayload =
  | {
      type: "card";
      title: string;
      value: number | string | null;
      statLabel: string;
      meta: any;
      errors?: string[];
      warnings?: string[];
      empty: boolean;
    }
  | {
      type: "bar";
      title: string;
      categories: string[];
      series: Series[];
      stacked: boolean;
      meta: any;
      errors?: string[];
      warnings?: string[];
      empty: boolean;
    }
  | {
      type: "line";
      title: string;
      x: (string | number | Date)[];
      series: Series[];
      meta: any;
      errors?: string[];
      warnings?: string[];
      empty: boolean;
    }
  | {
      type: "pie";
      title: string;
      slices: { label: string; value: number }[];
      meta: any;
      errors?: string[];
      warnings?: string[];
      empty: boolean;
    }
  | {
      type: "histogram";
      title: string;
      bins: { label: string }[];
      series: Series[];
      meta: any;
      errors?: string[];
      warnings?: string[];
      empty: boolean;
    }
  | {
      type: "scatter";
      title: string;
      series: {
        name: string;
        points: { x: number; y: number }[];
        correlationR?: number;
      }[];
      meta: any;
      errors?: string[];
      warnings?: string[];
      empty: boolean;
    }
  | {
      type: "calendar-heatmap";
      title: string;
      values: { date: string; value: number }[];
      startDate: string;
      endDate: string;
      meta: any;
      errors?: string[];
      warnings?: string[];
      empty: boolean;
    }
  | {
      type: "map";
      title: string;
      countries: Record<string, { values: Record<string, unknown>; colorValue?: string }>;
      meta: any;
      errors?: string[];
      warnings?: string[];
      empty: boolean;
    };

// Form data types for the builder
export interface FormField {
  id?: string;
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

export interface FormSection {
  id: string;
  name: string;
  questions: FormField[];
}

export interface FormData {
  id: string;
  title: string;
  name?: string;
  description?: string;
  sections?: FormSection[];
  status?: 'ENABLED' | 'DISABLED';
}

// User and role types for dashboard
export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  roles?: string[];
}

// Builder state types
export interface DashboardBuilderState {
  currentWidget: Partial<IWidget> | null;
  selectedStep: number;
  previewData: WidgetDataPayload | null;
  availableForms: FormData[];
  isLoading: boolean;
  errors: string[];
}

// Grid layout types
export interface WidgetGridItem {
  i: string; // widget ID
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}


// types/dashboard-layout.types.ts
// Types for persisting per-breakpoint dashboard layouts.

export type BreakpointKey = "lg" | "md" | "sm" | "xs" | "xxs";

export interface DashboardLayoutItem {
  widgetId: string; // same as widget.id
  x: number;
  y: number;
  w: number;
  h: number;
  // Optional constraints at time of save (helpful for restoring behavior)
  minW?: number;
  minH?: number;
}

export type DashboardLayoutsByBreakpoint = Partial<
  Record<BreakpointKey, DashboardLayoutItem[]>
>;

export interface SaveDashboardLayoutRequest {
  dashboardId: string;
  order: string[];
  layouts: DashboardLayoutsByBreakpoint;
}

export interface SaveDashboardLayoutResponse {
  success: boolean;
  dashboardId: string;
  order: string[];
  layouts: DashboardLayoutsByBreakpoint;
  updatedAt: string; // ISO date
}

// Widget type configuration with capabilities and requirements
export interface WidgetTypeConfig {
  type: VisualizationType;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  requiresGroupBy: boolean;
  supportsMultiMetric: boolean;
  requiredFields: string[];
  supportedAggregations: AggregationType[];
  groupByTypes?: GroupByKind[];
  fieldTypes?: string[];
  systemFields?: SystemField[];
  maxMetrics?: number;
}

// System fields available across all forms
export interface SystemFieldConfig {
  id: SystemField;
  label: string;
  type: "categorical" | "datetime";
  description: string;
  supportedAggregations: AggregationType[];
  availableFor: ("groupBy" | "metric" | "filter")[];
  timeBuckets?: DateGranularity[];
}
