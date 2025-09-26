import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AggregationType,
  FormData,
  IWidgetMetric,
  SystemField,
  VisualizationType,
} from "@/types/dashboard.types";
import {
  SYSTEM_FIELDS,
  getSupportedAggregations,
} from "@/constants/widget-types";
import { useGetFormFields } from "@/hooks";
import { Card } from "@/components/ui/card";
import { useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { BarChart3, Plus, X } from "lucide-react";
import { FormAutocomplete } from "./form-autocomplete";

// Individual field selector component that loads fields for a specific form
function MetricFieldSelector({
  metric,
  onUpdateMetric,
  isFieldNumeric,
  widgetType,
  hasValueMode,
}: {
  metric: IWidgetMetric;
  onUpdateMetric: (updates: Partial<IWidgetMetric>) => void;
  isFieldNumeric: (fieldId: string, formId: string) => boolean;
  widgetType: VisualizationType;
  hasValueMode: boolean;
}) {
  const { t } = useTranslation();
  const { data: formFieldsData, isLoading } = useGetFormFields(metric.formId);
  console.log("fields", formFieldsData, metric.fieldId);
  const availableFields = useCallback(() => {
    if (!metric.formId || !formFieldsData) return [];

    const systemFields = SYSTEM_FIELDS.map((sf) => ({
      id: sf.id,
      label: sf.label,
      type: sf.type,
    }));

    const formFields = formFieldsData?.formFields || [];
    return [...systemFields, ...formFields];
  }, [metric.formId, formFieldsData]);

  const fields = availableFields();

  if (!metric.formId) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder={t('processManagement.selectFormFirst')} />
        </SelectTrigger>
      </Select>
    );
  }

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder={t('processManagement.loadingFields')} />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={metric.fieldId || metric.systemField || ""}
      onValueChange={(value) => {
        const currentAggregation = metric.aggregation;

        if (value.startsWith("$")) {
          // For system fields
          const updates: Partial<IWidgetMetric> = {
            systemField: value as SystemField,
            fieldId: undefined,
          };

          // Only set aggregation if not in value mode
          if (!hasValueMode) {
            const systemFieldConfig = SYSTEM_FIELDS.find(
              (sf) => sf.id === value
            );
            const supportedAggs = systemFieldConfig?.supportedAggregations || [
              "count",
            ];
            const preserveAggregation =
              supportedAggs.includes(currentAggregation);
            updates.aggregation = preserveAggregation
              ? currentAggregation
              : supportedAggs[0] || "count";
          }

          onUpdateMetric(updates);
        } else {
          // For regular fields
          const updates: Partial<IWidgetMetric> = {
            fieldId: value,
            systemField: undefined,
          };

          // Only set aggregation if not in value mode
          if (!hasValueMode) {
            const isNumeric = isFieldNumeric(value, metric.formId);
            const supportedAggs = getSupportedAggregations(widgetType);
            const availableAggs = isNumeric ? supportedAggs : ["count"];
            const preserveAggregation =
              availableAggs.includes(currentAggregation);
            updates.aggregation = preserveAggregation
              ? currentAggregation
              : isNumeric
              ? "sum"
              : "count";
          }

          onUpdateMetric(updates);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={t('processManagement.selectField')} />
      </SelectTrigger>
      <SelectContent>
        {fields.map((field) => (
          <SelectItem key={field.id} value={field.id!}>
            {field.id!.startsWith("$") ? (
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📊</span>
                {field.label} ({t('processManagement.system')})
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {field.label} ({field.type})
              </div>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MetricItem({
  metric,
  availableForms,
  widgetType,
  onUpdate,
  onRemove,
  hasValueMode
}: {
  metric: IWidgetMetric;
  availableForms: FormData[];
  widgetType: VisualizationType;
  onUpdate: (metricId: string, updates: Partial<IWidgetMetric>) => void;
  onRemove: (metricId: string) => void;
  hasValueMode: boolean;
  valueFormId?: string;
  allMetrics: IWidgetMetric[];
}) {
  const { t } = useTranslation();
  const { data: formFieldsData } = useGetFormFields(metric.formId);
  const supportedAggregations = getSupportedAggregations(widgetType);

  const formFields = useMemo(
    () => formFieldsData?.formFields || [],
    [formFieldsData]
  );

  const availableFields = useMemo(() => {
    if (!metric.formId) return [];
    const systemFields = SYSTEM_FIELDS.map((sf) => ({
      id: sf.id,
      label: sf.label,
      type: sf.type,
    }));
    return [...systemFields, ...formFields];
  }, [metric.formId, formFields]);

  const isFieldNumeric = useCallback(
    (fieldId: string): boolean => {
      if (fieldId.startsWith("$")) return false;
      const field = formFields.find((f: any) => f.id === fieldId);
      return (
        field?.type === "number" ||
        field?.type === "currency" ||
        field?.type === "decimal" ||
        field?.type === "integer"
      );
    },
    [formFields]
  );

  const validAggregations = useMemo((): AggregationType[] => {
    if (metric.systemField) {
      const systemFieldConfig = SYSTEM_FIELDS.find(
        (sf) => sf.id === metric.systemField
      );
      return systemFieldConfig?.supportedAggregations || ["count"];
    }
    if (!metric.fieldId) {
      return supportedAggregations.length > 0
        ? supportedAggregations
        : ["count"];
    }
    if (isFieldNumeric(metric.fieldId)) {
      return supportedAggregations;
    }
    return ["count"];
  }, [
    metric.systemField,
    metric.fieldId,
    supportedAggregations,
    isFieldNumeric,
  ]);

  const updateMetric = (updates: Partial<IWidgetMetric>) => {
    onUpdate(metric.id, updates);
  };

  return (
    <Card key={metric.id} className="p-4">
      <div
        className="grid grid-cols-1 gap-4"
        style={{
          gridTemplateColumns: hasValueMode ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr",
        }}
      >
        <div>
          <Label>{t('processManagement.form')}</Label>
          <FormAutocomplete
            value={metric.formId}
            onValueChange={(formId) => {
              const updates: Partial<IWidgetMetric> = {
                formId: formId || "",
                fieldId: undefined,
                systemField: undefined,
              };

              // Only set aggregation if not in value mode
              if (!hasValueMode) {
                updates.aggregation = "count";
              }

              updateMetric(updates);
            }}
            forms={availableForms as any}
            placeholder={t('processManagement.searchForms')}
          />
        </div>

        <div>
          <Label>{t('processManagement.field')}</Label>
          <MetricFieldSelector
            metric={metric}
            onUpdateMetric={updateMetric}
            isFieldNumeric={(fieldId, _formId) => isFieldNumeric(fieldId)}
            widgetType={widgetType}
            hasValueMode={hasValueMode}
          />
        </div>

        {!hasValueMode && widgetType !== "histogram" && widgetType !== "scatter" && (
          <div>
            <Label>{t('processManagement.aggregationMode')}</Label>
            <Select
              value={metric.aggregation}
              onValueChange={(agg) =>
                updateMetric({ aggregation: agg as AggregationType })
              }
              disabled={
                !metric.formId || (!metric.fieldId && !metric.systemField)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {validAggregations.map((agg) => {
                  const getAggregationLabel = (aggregation: string) => {
                    switch (aggregation) {
                      case "count":
                        return t('processManagement.countNumberOfRecords');
                      case "sum":
                        return t('processManagement.sumTotalOfAllValues');
                      case "mean":
                        return t('processManagement.meanAverageValue');
                      case "median":
                        return t('processManagement.medianMiddleValue');
                      case "mode":
                        return t('processManagement.modeMostFrequentValue');
                      case "min":
                        return t('processManagement.minimumSmallestValue');
                      case "max":
                        return t('processManagement.maximumLargestValue');
                      case "std":
                        return t('processManagement.standardDeviationMeasureOfSpread');
                      case "variance":
                        return t('processManagement.varianceMeasureOfVariability');
                      case "p10":
                        return t('processManagement.p1010thPercentile');
                      case "p25":
                        return t('processManagement.p2525thPercentileQ1');
                      case "p50":
                        return t('processManagement.p5050thPercentileMedian');
                      case "p75":
                        return t('processManagement.p7575thPercentileQ3');
                      case "p90":
                        return t('processManagement.p9090thPercentile');
                      default:
                        return (
                          aggregation.charAt(0).toUpperCase() +
                          aggregation.slice(1)
                        );
                    }
                  };

                  return (
                    <SelectItem key={agg} value={agg}>
                      {getAggregationLabel(agg)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(metric.id)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <Label>{t('processManagement.labelOptional')}</Label>
        <Input
          value={metric.label || ""}
          onChange={(e) => updateMetric({ label: e.target.value })}
          placeholder={t('processManagement.customMetricLabel')}
        />
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {metric.formId && (metric.fieldId || metric.systemField) && (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded">
            ✓ {hasValueMode ? t('processManagement.valueOf') : `${metric.aggregation} of`}{' '}
            {metric.systemField ||
              availableFields.find((f) => f.id === metric.fieldId)?.label ||
              "field"}
          </span>
        )}
        {hasValueMode && (
          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded ml-2">
            ⚠️ {t('processManagement.allMetricsMustUseSameFormInValueMode')}
          </span>
        )}
      </div>
    </Card>
  );
}

interface MetricEditorProps {
  metrics: IWidgetMetric[];
  onMetricsChange: (metrics: IWidgetMetric[]) => void;
  availableForms: FormData[];
  widgetType: VisualizationType;
  maxMetrics?: number;
  metricMode: "aggregation" | "value";
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function MetricEditor({
  metrics,
  onMetricsChange,
  availableForms,
  widgetType,
  maxMetrics = 5,
  metricMode,
}: MetricEditorProps) {
  const { t } = useTranslation();
  // Check if widget is in value mode
  const hasValueMode = metricMode === "value";

  // Get the first form ID used for enforcement in value mode
  const valueFormId = useMemo(() => {
    return hasValueMode && metrics.length > 0 ? metrics[0].formId : undefined;
  }, [hasValueMode, metrics]);

  const addMetric = useCallback(() => {
    const newMetric: any = {
      id: generateId(),
      formId: hasValueMode ? valueFormId || "" : "",
      appearance: {},
    };

    // Only set aggregation if not in value mode
    if (!hasValueMode) {
      newMetric.aggregation = "count";
    }

    onMetricsChange([...metrics, newMetric]);
  }, [metrics, onMetricsChange, hasValueMode, valueFormId]);

  const removeMetric = useCallback(
    (metricId: string) => {
      onMetricsChange(metrics.filter((m) => m.id !== metricId));
    },
    [metrics, onMetricsChange]
  );

  const updateMetric = useCallback(
    (metricId: string, updates: Partial<IWidgetMetric>) => {
      // In value mode, if formId is being updated, sync all metrics to use the same form
      if (hasValueMode && updates.formId !== undefined) {
        onMetricsChange(

          metrics.map((m: any) => ({
            ...m,
            ...(m.id === metricId ? updates : {}),
            formId: updates.formId, // All metrics get the same form ID
          }))
        );
      } else {
        onMetricsChange(
          metrics.map((m) => (m.id === metricId ? { ...m, ...updates } : m))
        );
      }
    },
    [metrics, onMetricsChange, hasValueMode]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{t('processManagement.metrics')}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMetric}
          disabled={metrics.length >= maxMetrics}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('processManagement.addMetric')}
        </Button>
      </div>

      {metrics.map((metric) => (
        <MetricItem
          key={metric.id}
          metric={metric}
          availableForms={availableForms}
          widgetType={widgetType}
          onUpdate={updateMetric}
          onRemove={removeMetric}
          hasValueMode={hasValueMode}
          valueFormId={valueFormId}
          allMetrics={metrics}
        />
      ))}

      {metrics.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>{t('processManagement.noMetricsAddedYet')}</p>
          <p className="text-xs mt-1">
            {widgetType === "line" ? t('processManagement.lineChartsSupportUpTo') : t('processManagement.barChartsSupportUpTo')}{" "}
            {maxMetrics} {t('processManagement.metrics')}
          </p>
        </div>
      )}

      {/* {metrics.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{metrics.length}</strong> metric
            {metrics.length === 1 ? "" : "s"} configured.
            {hasValueMode ? (
              <> All metrics must use the same form in value mode.</>
            ) : (
              metrics.length > 1 && (
                <> Each metric can come from a different form.</>
              )
            )}
          </p>
        </div>
      )} */}
    </div>
  );
}
