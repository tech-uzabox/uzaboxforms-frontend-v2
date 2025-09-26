import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CHART_APPEARANCE_DEFAULTS,
  SYSTEM_FIELDS,
  WIDGET_TYPES,
  getMaxMetrics,
  getWidgetTypeConfig,
  requiresGroupBy,
} from "@/constants/widget-types";
import {
  useCreateWidget,
  useFormsWithCountries,
  useGetAllForms,
  useGetDashboard,
  useGetWidget,
  useMultipleIndividualFormFields,
  useUpdateDashboard,
  useUpdateWidget,
} from "@/hooks";
import { cn } from "@/lib/utils";
import {
  DateRangePreset,
  FormData,
  IWidget,
  IWidgetAppearance,
  IWidgetDateRange,
  IWidgetFilter,
  IWidgetGroupBy,
  IWidgetMetric,
  VisualizationType,
} from "@/types/dashboard.types";
import {
  addWidgetToLayout,
  fromRGLLayouts,
  toRGLLayouts,
} from "@/utils/layout-update";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Calendar,
  Eye,
  Filter,
  Palette,
  Save,
  Settings,
  Tags,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Layouts } from "react-grid-layout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { COLS } from "../dashboard/dashboard-grid";
import MapConfigPanel from "../dashboard/widgets/map/map-config-panel";
import { DynamicAppearanceEditor } from "./dynamic-appearance-editor";
import { FilterEditor } from "./filter-editor";
import { GroupByEditor } from "./group-by-editor";
import { MetricEditor } from "./metric-editor";

interface CreateOrEditWidgetProps {
  dashboardId: string;
  widgetId?: string;
  mode: "create" | "edit";
}

interface WidgetConfiguration {
  title: string;
  description: string;
  visualizationType: VisualizationType;

  metricMode: "aggregation" | "value";
  metrics: IWidgetMetric[];
  groupBy: IWidgetGroupBy;
  dateRange: IWidgetDateRange;
  filters: IWidgetFilter[];
  valueModeFieldId?: string;

  appearance: IWidgetAppearance;
  options?: any;
}

const defaultConfiguration: WidgetConfiguration = {
  title: "",
  description: "",
  visualizationType: "bar",
  metricMode: "aggregation",
  metrics: [],
  groupBy: { kind: "none" },
  dateRange: { preset: "last-30-days" },
  filters: [],
  appearance: CHART_APPEARANCE_DEFAULTS,
  valueModeFieldId: "",
  options: {},
};

// @ts-ignore
function getDateRangeDescription(dateRange: IWidgetDateRange): string {
  switch (dateRange.preset) {
    case "last-7-days":
      return "Last 7 days of data";
    case "last-30-days":
      return "Last 30 days of data";
    case "last-3-months":
      return "Last 3 months of data";
    case "last-6-months":
      return "Last 6 months of data";
    case "last-12-months":
      return "Last 12 months of data";
    case "custom":
      if (dateRange.from && dateRange.to) {
        return `From ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`;
      } else if (dateRange.from) {
        return `From ${dateRange.from.toLocaleDateString()} onwards`;
      } else if (dateRange.to) {
        return `Up to ${dateRange.to.toLocaleDateString()}`;
      } else {
        return "Custom range (please select dates)";
      }
    default:
      return "Unknown date range";
  }
}

export function CreateOrEditWidget({
  dashboardId,
  widgetId,
  mode,
}: CreateOrEditWidgetProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [config, setConfig] =
    useState<WidgetConfiguration>(defaultConfiguration);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewMode, _setIsPreviewMode] = useState(false);

  const { data: formsResponse, isLoading: formsLoading } = useGetAllForms();
  const { data: formsWithCountriesResponse } = useFormsWithCountries();
  const {
    data: dashboardData,
    isLoading: _dashboardLoading,
    error: _dashboardError,
  } = useGetDashboard(dashboardId);
  const dashboard = dashboardData;
  const { data: existingWidgetData, isLoading: widgetLoading } = useGetWidget(
    widgetId || "",
    { enabled: mode === "edit" && !!widgetId }
  );

  const existingWidget = existingWidgetData?.data;

  const createWidgetMutation = useCreateWidget();
  const updateWidgetMutation = useUpdateWidget();
  const updateDashboardMutation = useUpdateDashboard();

  const forms: FormData[] = formsResponse || [];
  const isSubmitting =
    createWidgetMutation.isPending || updateWidgetMutation.isPending;
  const isLoading = formsLoading || (mode === "edit" && widgetLoading);

  useEffect(() => {
    if (mode === "edit" && existingWidget) {
      const existingMetricMode =
        (existingWidget as any).config.metricMode || "aggregation";

      setConfig({
        title: existingWidget.title,
        description: existingWidget.description || "",
        visualizationType: existingWidget.visualizationType,
        metricMode: existingMetricMode,
        metrics: existingWidget.config.metrics || [],
        groupBy: existingWidget.config.groupBy || { kind: "none" },
        dateRange: existingWidget.config.dateRange || { preset: "last-30-days" },
        filters: existingWidget.config.filters || [],
        valueModeFieldId: (existingWidget as any).config.valueModeFieldId || "",
        appearance: {
          ...CHART_APPEARANCE_DEFAULTS,
          ...existingWidget.config.appearance,
        },
        // Populate options (including map config) when editing
        options: (existingWidget as any).config.options || {},
      });
    }
  }, [mode, existingWidget]);

  const supportsValueMode = ["pie", "bar", "line"].includes(
    config.visualizationType
  );

  const hasValueMode = config.metricMode === "value";

  useEffect(() => {
    if (!supportsValueMode && config.metricMode === "value") {
      setConfig((prev) => ({
        ...prev,
        metricMode: "aggregation",
      }));
    }
  }, [supportsValueMode, config.metricMode]);

  useEffect(() => {
    if (hasValueMode) {
      const shouldUpdateGroupBy =
        config.groupBy.kind !== "categorical" ||
        config.groupBy.systemField !== "$responseId$";

      if (shouldUpdateGroupBy) {
        setConfig((prev) => ({
          ...prev,
          groupBy: {
            kind: "categorical",
            systemField: "$responseId$",
            fieldId: undefined,
            includeMissing: false,
          },
        }));
      }
    }
  }, [hasValueMode]);

  // @ts-ignore
  const widgetTypeConfig = useMemo(() => {
    return getWidgetTypeConfig(config.visualizationType);
  }, [config.visualizationType]);

  const maxMetrics = useMemo(() => {
    return getMaxMetrics(config.visualizationType);
  }, [config.visualizationType]);

  const availableFormsForFilters = useMemo(() => {
    // Collect form IDs from standard metrics
    const metricFormIds = config.metrics
      .map((metric) => metric.formId)
      .filter(Boolean) as string[];

    // For map widgets, also collect form IDs from options.map.metrics
    const mapFormIds = (config.options?.map?.metrics || [])
      .map((m: any) => m.formId)
      .filter(Boolean) as string[];

    const uniqueFormIds = Array.from(
      new Set([...metricFormIds, ...mapFormIds])
    );
    return forms.filter((form) => uniqueFormIds.includes(form.id));
  }, [config.metrics, config.options?.map?.metrics, forms]);

  const metricFormIds = useMemo(() => {
    return [
      ...new Set(config.metrics.map((metric) => metric.formId).filter(Boolean)),
    ];
  }, [config.metrics]);

  const {
    formFieldsMap,
    allFields: _allFields,
    isLoading: _fieldsLoading,
  } = useMultipleIndividualFormFields(metricFormIds);
  console.log(config?.metrics);

  const availableFieldsData = useMemo(() => {
    if (metricFormIds.length === 0) {
      return {
        fields: [],
        allowCategorical: false,
        allowTime: false,
      };
    }

    const systemFieldsFormatted = SYSTEM_FIELDS.map((sf) => ({
      id: sf.id,
      label: sf.label,
      type: sf.type,
      formId: "",
      sectionId: "",
      sectionName: "",
      isSystemField: true,
    }));

    if (metricFormIds.length === 1) {
      const formId = metricFormIds[0];
      const formFields = formFieldsMap[formId] || [];
      const allAvailableFields = [...systemFieldsFormatted, ...formFields];

      return {
        fields: allAvailableFields,
        allowCategorical: true,
        allowTime: true,
      };
    }

    const sharedFormFields = [];

    const firstFormFields = formFieldsMap[metricFormIds[0]] || [];

    for (const field of firstFormFields) {
      const existsInAllForms = metricFormIds.slice(1).every((formId) => {
        const formFields = formFieldsMap[formId] || [];
        return formFields.some(
          (f) =>
            f.id === field.id &&
            f.type === field.type &&
            f.label === field.label
        );
      });

      if (existsInAllForms) {
        sharedFormFields.push(field);
      }
    }

    const allSharedFields = [...systemFieldsFormatted, ...sharedFormFields];

    return {
      fields: allSharedFields,
      allowCategorical: sharedFormFields.length > 0,
      allowTime: true,
    };
  }, [metricFormIds, formFieldsMap]);

  const updateConfig = useCallback((updates: Partial<WidgetConfiguration>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const validateConfiguration = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!config.title.trim()) {
      newErrors.title = "Widget title is required";
    } else if (config.title.trim().length > 100) {
      newErrors.title = "Widget title must be 100 characters or less";
    }

    if (config.description && config.description.length > 500) {
      newErrors.description = "Description must be 500 characters or less";
    }

    if (config.visualizationType !== "map") {
      if (config.metrics.length === 0) {
        newErrors.metrics = "At least one metric must be configured";
      } else {
        for (const metric of config.metrics) {
          if (!metric.formId) {
            newErrors.metrics = "Each metric must have a selected form";
            break;
          }
          if (!metric.fieldId && !metric.systemField) {
            newErrors.metrics =
              "Each metric must have a field or system field selected";
            break;
          }
        }
      }
    }

    if (requiresGroupBy(config.visualizationType)) {
      if (!config.groupBy?.fieldId && !config.groupBy?.systemField) {
        newErrors.groupBy = "Group By field is required for this chart type";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [config]);

  const handleSubmit = useCallback(async () => {
    if (!validateConfiguration()) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    try {
      const payload: Partial<IWidget> = {
        title: config.title,
        description: config.description,
        visualizationType: config.visualizationType,
        metricMode: config.metricMode,
        metrics: config.metrics,
        valueModeFieldId: config.valueModeFieldId,
        groupBy: config.groupBy,
        dateRange: config.dateRange,
        filters: config.filters,
        appearance: config.appearance,
        options: config.options,
        dashboardId,
      };

      if (mode === "create") {
        const newWidgetData = await createWidgetMutation.mutateAsync(
          payload as any
        );
        const newWidget = newWidgetData?.data;
        toast.success("Widget created successfully");
        if (dashboard?.layout) {
          const currentLayouts: Layouts = toRGLLayouts(
            dashboard.layout.layouts
          );

          const updatedLayouts: Layouts = addWidgetToLayout(
            currentLayouts,
            newWidget.id.toString(),
            COLS,
            newWidget.visualizationType
          );

          const updatedPayload = {
            formData: {
              layout: {
                layouts: fromRGLLayouts(updatedLayouts),
                order: [
                  ...dashboard.layout.order.map((id: any) => id.toString()),
                  newWidget.id.toString(),
                ],
              },
            },
            id: dashboardId,
          };

          await updateDashboardMutation.mutateAsync(updatedPayload);
          toast.success("Dashboard layout updated");
        }
      } else {
        await updateWidgetMutation.mutateAsync({
          id: widgetId,
          formData: payload,
        });
        toast.success("Widget updated successfully");
      }

      navigate(`/admin/settings/dashboard-management/${dashboardId}/edit`);
    } catch (error) {
      console.error("Failed to save widget:", error);
      toast.error(
        `Failed to ${mode === "create" ? "create" : "update"} widget`
      );
    }
  }, [
    config,
    validateConfiguration,
    mode,
    dashboardId,
    widgetId,
    createWidgetMutation,
    updateWidgetMutation,
    updateDashboardMutation,
    dashboard,
    navigate,
  ]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">
              {mode === "create"
                ? t("processManagement.createWidget")
                : t("processManagement.editWidget")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "create"
                ? t("processManagement.configureNewWidgetForYourDashboard")
                : t("processManagement.updateWidgetConfiguration")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewMode ? "Hide Preview" : "Show Preview"}
          </Button> */}
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting
              ? t("common.saving")
              : mode === "create"
              ? t("processManagement.createWidgetButton")
              : t("processManagement.updateWidgetButton")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div
          className={cn(
            "space-y-6",
            isPreviewMode ? "lg:col-span-2" : "lg:col-span-3"
          )}
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t("processManagement.basicInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t("processManagement.widgetTitle")}</Label>
                <Input
                  value={config.title}
                  onChange={(e) => updateConfig({ title: e.target.value })}
                  placeholder={t("processManagement.enterWidgetTitle")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label>{t("processManagement.descriptionOptional")}</Label>
                <Textarea
                  value={config.description}
                  onChange={(e) =>
                    updateConfig({ description: e.target.value })
                  }
                  placeholder={t(
                    "processManagement.briefDescriptionOfTheWidget"
                  )}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Visualization Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t("processManagement.visualizationType")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {WIDGET_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = config.visualizationType === type.type;
                  return (
                    <button
                      key={type.type}
                      onClick={() => {
                        const updates: Partial<WidgetConfiguration> = {
                          visualizationType: type.type,
                          metrics: [],
                        };

                        if (!["pie", "bar", "line"].includes(type.type)) {
                          updates.metricMode = "aggregation";
                        }
                        updateConfig(updates);
                      }}
                      className={cn(
                        "p-4 border-2 rounded-lg text-center transition-all",
                        "hover:border-blue-500 hover:shadow-md",
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-medium text-sm">{type.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {type.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Metrics Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {config.visualizationType === "map"
                  ? t("processManagement.mapConfiguration")
                  : t("processManagement.metricsConfiguration")}
                {config.visualizationType !== "map" && (
                  <Badge variant="outline" className="ml-2">
                    {t("processManagement.max")}: {maxMetrics}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.visualizationType === "map" ? (
                <MapConfigPanel
                  value={
                    config.options?.map || {
                      metrics: [],
                      filters: [],
                      appearance: {
                        coloringMode: "solid",
                        solidColor: "#012473",
                        border: { enabled: false, color: "#ffffff" },
                      },
                    }
                  }
                  onChange={(val: any) =>
                    updateConfig({
                      options: { ...(config.options || {}), map: val },
                    })
                  }
                  forms={formsWithCountriesResponse?.data || []}
                />
              ) : (
                <>
                  {supportsValueMode && (
                    <div className="max-w-sm">
                      <Label>{t("processManagement.metricMode")}</Label>
                      <Select
                        value={config.metricMode}
                        onValueChange={(mode: "aggregation" | "value") => {
                          let updatedMetrics = config.metrics;

                          if (mode === "value" && config.metrics.length > 0) {
                            const sharedFormId = config.metrics[0].formId || "";
                            updatedMetrics = config.metrics.map((metric) => ({
                              ...metric,
                              formId: sharedFormId,
                            }));
                          }

                          updateConfig({
                            metricMode: mode,
                            metrics: updatedMetrics,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aggregation">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {t("processManagement.aggregationMode")}
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="value">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {t("processManagement.valueMode")}
                              </span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {config.visualizationType && (
                    <MetricEditor
                      metrics={config.metrics}
                      onMetricsChange={(metrics) => updateConfig({ metrics })}
                      availableForms={forms}
                      widgetType={config.visualizationType}
                      maxMetrics={maxMetrics}
                      metricMode={config.metricMode}
                    />
                  )}
                  {errors.metrics && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.metrics}</AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Date Range Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t("processManagement.dateRange")}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {t("processManagement.configureTheTimePeriodForDataAnalysis")}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-w-sm">
                <Label>{t("processManagement.timePeriod")}</Label>
                <Select
                  value={config.dateRange.preset}
                  onValueChange={(preset: DateRangePreset) => {
                    updateConfig({
                      dateRange: {
                        preset,

                        ...(preset !== "custom"
                          ? { from: undefined, to: undefined }
                          : {}),
                      },
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("processManagement.last7Days")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t("processManagement.mostRecentWeekOfData")}
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="last-30-days">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("processManagement.last30Days")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t("processManagement.mostRecentMonthOfData")}
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="last-3-months">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("processManagement.last3Months")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t("processManagement.mostRecentQuarterOfData")}
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="last-6-months">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("processManagement.last6Months")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t("processManagement.mostRecentHalfYearOfData")}
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="last-12-months">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("processManagement.last12Months")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t("processManagement.mostRecentYearOfData")}
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("processManagement.customRange")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t(
                            "processManagement.selectSpecificStartAndEndDates"
                          )}
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.dateRange.preset === "custom" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t("processManagement.fromDate")}</Label>
                    <Input
                      type="date"
                      value={
                        config.dateRange.from
                          ? config.dateRange.from.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        updateConfig({
                          dateRange: {
                            ...config.dateRange,
                            from: date,
                          },
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label>{t("processManagement.toDate")}</Label>
                    <Input
                      type="date"
                      value={
                        config.dateRange.to
                          ? config.dateRange.to.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        updateConfig({
                          dateRange: {
                            ...config.dateRange,
                            to: date,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {/* <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Current Selection:</strong>{" "}
                  {getDateRangeDescription(config.dateRange)}
                </p>
              </div> */}
            </CardContent>
          </Card>

          {/* Filter Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {t("processManagement.dataFilters")}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {t("processManagement.filterDataBeforeVisualization")}
              </p>
            </CardHeader>
            <CardContent>
              <FilterEditor
                filters={config.filters}
                onChange={(filters) => updateConfig({ filters })}
                availableForms={availableFormsForFilters}
              />
            </CardContent>
          </Card>

          {/* Group By Configuration */}
          {hasValueMode ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="w-5 h-5" />
                  {t("processManagement.uniqueIdentifierForVisualization")}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {t(
                    "processManagement.selectFieldWhoseValuesWillUniquelyIdentify"
                  )}
                </p>
              </CardHeader>
              <CardContent>
                <Label>{t("processManagement.identifierField")}</Label>
                <Select
                  value={config.valueModeFieldId || ""}
                  onValueChange={(value) =>
                    updateConfig({ valueModeFieldId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFieldsData.fields
                      .filter((f) => f.id != "$responseId$")
                      .map((field) => (
                        <SelectItem key={field.id} value={field.id!}>
                          {field.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ) : (
            requiresGroupBy(config.visualizationType) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tags className="w-5 h-5" />
                    {t("processManagement.groupByConfiguration")}
                    {requiresGroupBy(config.visualizationType) && (
                      <Badge variant="destructive" className="ml-2 text-white">
                        {t("processManagement.required")}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GroupByEditor
                    groupBy={config.groupBy}
                    onChange={(groupBy) => updateConfig({ groupBy })}
                    widgetType={config.visualizationType}
                    availableFields={availableFieldsData.fields}
                    allowCategorical={availableFieldsData.allowCategorical}
                    allowTime={availableFieldsData.allowTime}
                    errors={errors}
                    hasValueMode={hasValueMode}
                  />
                  {errors.groupBy && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.groupBy}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )
          )}

          {/* Appearance Configuration */}
          {config.visualizationType !== "map" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  {t("processManagement.appearance")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DynamicAppearanceEditor
                  visualizationType={config.visualizationType}
                  appearance={config.appearance}
                  onChange={(appearance) => updateConfig({ appearance })}
                />
              </CardContent>
            </Card>
          )}
          {/* Status Information
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4" />
                <span>
                  Configuration is{" "}
                  {Object.keys(errors).length === 0 ? "valid" : "incomplete"}
                </span>
              </div>
              {Object.keys(errors).length > 0 && (
                <div className="mt-2 text-sm text-red-600">
                  <div className="font-medium">Issues to resolve:</div>
                  <ul className="list-disc list-inside mt-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card> */}
        </div>

        {/* Preview Panel */}
        {isPreviewMode && (
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>{t("processManagement.preview")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <Eye className="w-12 h-12 mx-auto mb-2" />
                    <p>{t("processManagement.widgetPreviewWillAppearHere")}</p>
                    <p className="text-sm mt-1">
                      {t("processManagement.configureMetricsToSeePreview")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
