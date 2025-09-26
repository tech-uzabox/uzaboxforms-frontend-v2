import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetFormFields } from "@/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Filter as FilterIcon } from "lucide-react";
import { IWidgetFilter, FormData, SystemField } from "@/types/dashboard.types";

interface FilterEditorProps {
  filters: IWidgetFilter[];
  onChange: (filters: IWidgetFilter[]) => void;
  availableForms: FormData[];
}

// Comprehensive operator definitions
const FILTER_OPERATORS = {
  // Basic equality
  equals: {
    label: "processManagement.equals",
    category: "processManagement.basic",
    valueType: "single",
  },
  not_equals: {
    label: "processManagement.notEquals",
    category: "processManagement.basic",
    valueType: "single",
  },

  // Numeric comparisons
  greater_than: {
    label: "processManagement.greaterThan",
    category: "processManagement.numeric",
    valueType: "single",
  },
  greater_than_equal: {
    label: "processManagement.greaterThanOrEqual",
    category: "processManagement.numeric",
    valueType: "single",
  },
  less_than: {
    label: "processManagement.lessThan",
    category: "processManagement.numeric",
    valueType: "single",
  },
  less_than_equal: {
    label: "processManagement.lessThanOrEqual",
    category: "processManagement.numeric",
    valueType: "single",
  },

  // String operations
  contains: {
    label: "processManagement.contains",
    category: "processManagement.text",
    valueType: "single",
  },
  starts_with: {
    label: "processManagement.startsWith",
    category: "processManagement.text",
    valueType: "single",
  },
  ends_with: {
    label: "processManagement.endsWith",
    category: "processManagement.text",
    valueType: "single",
  },

  // Membership
  in: {
    label: "processManagement.isOneOf",
    category: "processManagement.list",
    valueType: "array",
  },
  not_in: {
    label: "processManagement.isNotOneOf",
    category: "processManagement.list",
    valueType: "array",
  },

  // Null/Empty checks
  is_null: {
    label: "processManagement.isEmpty",
    category: "processManagement.null",
    valueType: "none",
  },
  is_not_null: {
    label: "processManagement.isNotEmpty",
    category: "processManagement.null",
    valueType: "none",
  },

  // Boolean
  is_true: {
    label: "processManagement.isTrue",
    category: "processManagement.boolean",
    valueType: "none",
  },
  is_false: {
    label: "processManagement.isFalse",
    category: "processManagement.boolean",
    valueType: "none",
  },

  // Date operations
  date_eq: {
    label: "processManagement.dateEquals",
    category: "processManagement.date",
    valueType: "date",
  },
  date_before: {
    label: "processManagement.dateBefore",
    category: "processManagement.date",
    valueType: "date",
  },
  date_after: {
    label: "processManagement.dateAfter",
    category: "processManagement.date",
    valueType: "date",
  },
  date_range: {
    label: "processManagement.dateRange",
    category: "processManagement.date",
    valueType: "dateRange",
  },
} as const;

const SYSTEM_FIELDS: {
  value: SystemField;
  label: string;
  description: string;
}[] = [
  {
    value: "$responseId$",
    label: "processManagement.responseId",
    description: "processManagement.uniqueIdentifierForEachResponse",
  },
  {
    value: "$submissionDate$",
    label: "processManagement.submissionDate",
    description: "processManagement.whenTheResponseWasSubmitted",
  },
];

function generateFilterId(): string {
  return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

interface FilterRowProps {
  filter: IWidgetFilter;
  availableForms: FormData[];
  onUpdate: (filter: IWidgetFilter) => void;
  onDelete: () => void;
}

function FilterRow({
  filter,
  availableForms,
  onUpdate,
  onDelete,
}: FilterRowProps) {
  const { t } = useTranslation();
  const [localFilter, setLocalFilter] = useState<IWidgetFilter>(filter);

  // Get form fields for selected form
  const { data: formFieldsResponse, isLoading: _fieldsLoading } =
    useGetFormFields(localFilter.formId || "");
  const formFields = formFieldsResponse?.data?.formFields || [];

  // Get operator config
  const operatorConfig =
    FILTER_OPERATORS[localFilter.operator as keyof typeof FILTER_OPERATORS];

  // Sync with parent when props change (but not when local state changes)
  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  const updateFilter = useCallback(
    (updates: Partial<IWidgetFilter>) => {
      const updatedFilter = { ...localFilter, ...updates };
      setLocalFilter(updatedFilter);
      onUpdate(updatedFilter); // Call parent update immediately
    },
    [localFilter, onUpdate]
  );

  const renderValueInput = () => {
    if (!operatorConfig || operatorConfig.valueType === "none") {
      return null;
    }

    switch (operatorConfig.valueType) {
      case "single":
        return (
          <div className="space-y-2">
            <Label>{t("processManagement.value")}</Label>
            <Input
              value={localFilter.value || ""}
              onChange={(e) => updateFilter({ value: e.target.value })}
              placeholder={t("processManagement.enterValue")}
            />
          </div>
        );

      case "array":
        return (
          <div className="space-y-2">
            <Label>{t("processManagement.valuesCommaSeparated")}</Label>
            <Input
              value={
                Array.isArray(localFilter.value)
                  ? localFilter.value.join(", ")
                  : localFilter.value || ""
              }
              onChange={(e) =>
                updateFilter({
                  value: e.target.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter((v) => v),
                })
              }
              placeholder={t("processManagement.value1Value2Value3")}
            />
          </div>
        );

      case "date":
        return (
          <div className="space-y-2">
            <Label>{t("processManagement.date")}</Label>
            <Input
              type="date"
              value={localFilter.value || ""}
              onChange={(e) => updateFilter({ value: e.target.value })}
            />
          </div>
        );

      case "dateRange":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("processManagement.fromDate")}</Label>
              <Input
                type="date"
                value={localFilter.value?.from || ""}
                onChange={(e) =>
                  updateFilter({
                    value: { ...localFilter.value, from: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("processManagement.toDate")}</Label>
              <Input
                type="date"
                value={localFilter.value?.to || ""}
                onChange={(e) =>
                  updateFilter({
                    value: { ...localFilter.value, to: e.target.value },
                  })
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Form Selection (only from metric forms) */}
          <div className="space-y-2">
            <Label>{t("processManagement.form")}</Label>
            {availableForms.length === 1 ? (
              <div className="px-3 py-2 border rounded-md bg-muted text-sm">
                {availableForms[0].title ||
                  availableForms[0].name ||
                  availableForms[0].id}
              </div>
            ) : (
              <Select
                value={localFilter.formId || ""}
                onValueChange={(formId) =>
                  updateFilter({
                    formId,
                    fieldId: undefined,
                    systemField: undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("processManagement.selectForm")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableForms.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.title || form.name || form.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Field Selection */}
          <div className="space-y-2">
            <Label>{t("processManagement.field")}</Label>
            <Select
              value={localFilter.systemField || localFilter.fieldId || ""}
              onValueChange={(value) => {
                if (value.startsWith("$")) {
                  // System field
                  updateFilter({
                    systemField: value as SystemField,
                    fieldId: undefined,
                  });
                } else {
                  // Regular field
                  updateFilter({ fieldId: value, systemField: undefined });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("processManagement.selectField")} />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                  {t("processManagement.systemFields")}
                </div>
                {SYSTEM_FIELDS.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    <div className="flex flex-col">
                      <span>{t(field.label)}</span>
                      <span className="text-xs text-muted-foreground">
                        {t(field.description)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
                {formFields.length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-t mt-2 pt-2">
                      {t("processManagement.formFields")}
                    </div>
                    {formFields.map((field: any) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.label || field.id}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Operator Selection */}
          <div className="space-y-2">
            <Label>{t("processManagement.operator")}</Label>
            <Select
              value={localFilter.operator || ""}
              onValueChange={(operator) =>
                updateFilter({ operator, value: undefined })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("processManagement.selectOperator")}
                />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FILTER_OPERATORS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {t(config.category)}
                      </Badge>
                      {t(config.label)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Delete Button */}
          <div className="flex items-end">
            <Button
              variant="outline"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Value Input */}
        {renderValueInput()}

        {/* Filter Preview */}
        {/* <div className="mt-3 p-2 bg-muted rounded text-sm">
          <span className="font-medium">Preview: </span>
          <span className="text-muted-foreground">
            {localFilter.systemField || localFilter.fieldId || "field"} {operatorConfig?.label || localFilter.operator} {
              operatorConfig?.valueType === "none"
                ? ""
                : operatorConfig?.valueType === "dateRange"
                  ? `${localFilter.value?.from || "..."} to ${localFilter.value?.to || "..."}`
                  : Array.isArray(localFilter.value)
                    ? `[${localFilter.value.join(", ")}]`
                    : localFilter.value || "..."
            }
          </span>
        </div> */}
      </CardContent>
    </Card>
  );
}

export function FilterEditor({
  filters,
  onChange,
  availableForms,
}: FilterEditorProps) {
  const { t } = useTranslation();
  const addFilter = useCallback(() => {
    const newFilter: IWidgetFilter = {
      id: generateFilterId(),
      formId: availableForms[0]?.id || "",
      operator: "equals",
    };
    onChange([...filters, newFilter]);
  }, [filters, onChange, availableForms]);

  const updateFilter = useCallback(
    (index: number) => (updatedFilter: IWidgetFilter) => {
      const newFilters = [...filters];
      newFilters[index] = updatedFilter;
      onChange(newFilters);
    },
    [filters, onChange]
  );

  const deleteFilter = useCallback(
    (index: number) => {
      const newFilters = filters.filter((_, i) => i !== index);
      onChange(newFilters);
    },
    [filters, onChange]
  );

  if (availableForms.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FilterIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>{t("processManagement.noFormsAvailableForFiltering")}</p>
        <p className="text-sm">
          {t("processManagement.addMetricsToEnableFiltering")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filters.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <FilterIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            {t("processManagement.noFiltersConfigured")}
          </p>
          <Button onClick={addFilter} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            {t("processManagement.addFirstFilter")}
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filters.map((filter, index) => (
              <FilterRow
                key={filter.id}
                filter={filter}
                availableForms={availableForms}
                onUpdate={updateFilter(index)}
                onDelete={() => deleteFilter(index)}
              />
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Button onClick={addFilter} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {t("processManagement.addFilter")}
            </Button>
          </div>
        </>
      )}

      {filters.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{t("processManagement.filtersApplied")}:</strong>{" "}
            {filters.length}{" "}
            {t("processManagement.filtersWillBeAppliedToAllData")}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {t("processManagement.multipleFiltersUseAndLogic")}
          </p>
        </div>
      )}
    </div>
  );
}
