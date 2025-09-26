"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DateGranularity,
  GroupByKind,
  IWidgetGroupBy,
  SystemField,
  VisualizationType,
} from "@/types/dashboard.types";
import {
  DATE_GRANULARITY_OPTIONS,
  getSupportedGroupByTypes
} from "@/constants/widget-types";
import { FormField } from "@/services";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Calendar, Tags } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface GroupByEditorProps {
  groupBy: IWidgetGroupBy;
  onChange: (groupBy: IWidgetGroupBy) => void;
  widgetType: VisualizationType;
  availableFields: FormField[];
  allowCategorical: boolean; // Whether categorical grouping is allowed
  allowTime: boolean; // Whether time grouping is allowed
  errors?: Record<string, string>;
  hasValueMode?: boolean; // New prop to indicate if any metric is in value mode
}

export function GroupByEditor({
  groupBy,
  onChange,
  widgetType,
  availableFields,
  allowCategorical,
  allowTime,
  errors = {},
}: GroupByEditorProps) {
  const { t } = useTranslation();
  const supportedGroupByTypes = getSupportedGroupByTypes(widgetType);
  const timeOnly = widgetType === "line";
  const requiresGroupBy = ["bar", "line", "pie"].includes(widgetType);

  // Filter supported group by types based on field availability
  const effectiveSupportedTypes = supportedGroupByTypes.filter(type => {
    if (type === "categorical" && !allowCategorical) return false;
    if (type === "time" && !allowTime) return false;
    return true;
  });

  // Filter fields by type for time-based grouping
  const dateFields = availableFields?.filter(
    (f) => f.type === "date" || f.type === "datetime"
  );

  // Get appropriate fields based on groupBy kind
  const getFilteredFields = (kind: GroupByKind) => {
    if (kind === "time") {
      return dateFields;
    }
    // For categorical, include all fields except pure numeric (unless they have categories)
    return availableFields?.filter(
      (f) => !["number"].includes(f.type) || f.type === "select"
    );
  };

  const updateGroupBy = (updates: Partial<IWidgetGroupBy>) => {
    onChange({ ...groupBy, ...updates });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label>{t('processManagement.groupByConfiguration')}</Label>
          {requiresGroupBy && <span className="text-red-500">*</span>}
        </div>

        {timeOnly && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700">
                {t('processManagement.lineChartsRequireTimeBasedGrouping')}
              </p>
            </div>
          </div>
        )}

        {/* Warning for multiple metrics */}
        {!allowCategorical && allowTime && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-amber-700">
                {t('processManagement.multipleMetricsDetected')}
              </p>
            </div>
          </div>
        )}

        {/* Warning when no grouping is available */}
        {!allowCategorical && !allowTime && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">
                {t('processManagement.noSuitableGroupingFieldsAvailable')}
              </p>
            </div>
          </div>
        )}

        {/* Group By Kind */}
        <div className="space-y-3">
          <Label>{t('processManagement.groupByType')}</Label>
          <RadioGroup
            value={groupBy.kind || "categorical"}
            onValueChange={(kind: GroupByKind) => {
              updateGroupBy({
                kind,
                fieldId: undefined,
                systemField: undefined,
                dateGranularity: kind === "time" ? "day" : undefined,
              });
            }}
          >
            {effectiveSupportedTypes.includes("categorical") && !timeOnly && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="categorical"
                  id="categorical"
                  disabled={!allowCategorical}
                />
                <label
                  htmlFor="categorical"
                  className={`cursor-pointer flex items-center gap-2 ${
                    !allowCategorical ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Tags className="w-4 h-4" />
                  {t('processManagement.categoricalGroupByUniqueValues')}
                  {!allowCategorical && <span className="text-xs text-gray-500 ml-2">({t('processManagement.disabledMultipleForms')})</span>}
                </label>
              </div>
            )}
            {effectiveSupportedTypes.includes("time") && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="time"
                  id="time"
                  disabled={!allowTime}
                />
                <label
                  htmlFor="time"
                  className={`cursor-pointer flex items-center gap-2 ${
                    !allowTime ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  {t('processManagement.timeGroupByDateTimePeriods')}
                  {!allowTime && <span className="text-xs text-gray-500 ml-2">({t('processManagement.noTimeFieldsAvailable')})</span>}
                </label>
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Field Selection */}
        <div className="space-y-3">
          <Label>{t('processManagement.field')}</Label>
          <Select
            value={groupBy.fieldId || groupBy.systemField || ""}
            onValueChange={(value) => {
              if (value.startsWith("$")) {
                updateGroupBy({
                  systemField: value as SystemField,
                  fieldId: undefined,
                });
              } else {
                updateGroupBy({
                  fieldId: value,
                  systemField: undefined,
                });
              }
            }}
          >
            <SelectTrigger className={errors.groupBy ? "border-red-500" : ""}>
              <SelectValue placeholder={t('processManagement.selectField')} />
            </SelectTrigger>
            <SelectContent>
              {/* Regular Fields */}
              {getFilteredFields(groupBy.kind || "categorical")?.filter(f => f.id != "$responseId$")?.map(
                (field) => (
                  <SelectItem key={field.id} value={field.id!}>
                    <div className="flex items-center gap-2">
                      <div>
                        <div>{field.label}</div>
                      </div>
                    </div>
                  </SelectItem>
                )
              )}

              {/* Show message when no fields available - don't use SelectItem with empty value */}
              {getFilteredFields(groupBy.kind || "categorical")?.length === 0 && (
                <SelectItem value="no-fields-available" disabled>
                  {t('processManagement.addMetricsFirstToEnableFieldGrouping')}
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          {errors.groupBy && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.groupBy}
            </p>
          )}
        </div>

        {/* Date Granularity for Time-based Group By */}
        {groupBy.kind === "time" && (
          <div className="space-y-3">
            <Label>{t('processManagement.timeGranularity')}</Label>
            <Select
              value={groupBy.dateGranularity || "day"}
              onValueChange={(granularity: DateGranularity) =>
                updateGroupBy({ dateGranularity: granularity })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_GRANULARITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {t('processManagement.chooseHowToGroupTimeBasedData')}
            </p>
          </div>
        )}

        {/* Include Missing Values */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeMissing"
              checked={groupBy.includeMissing || false}
              onCheckedChange={(checked) =>
                updateGroupBy({ includeMissing: !!checked })
              }
            />
            <label htmlFor="includeMissing" className="text-sm cursor-pointer">
              {t('processManagement.includeMissingNullValuesAsUnknown')}
            </label>
          </div>
          <p className="text-xs text-gray-500 ml-6">
            {t('processManagement.whenEnabledRecordsWithMissingValues')}
          </p>
        </div>
      </div>
    </div>
  );
}
