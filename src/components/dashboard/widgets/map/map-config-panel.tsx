"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useMultipleIndividualFormFields } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MapAppearanceEditor from "@/components/dashboard/widgets/map/map-appearance-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MapMetric {
  formId: string;
  countryFieldId: string;
  valueFieldId: string;
  label?: string;
}

interface MapAppearance {
  coloringMode: "solid" | "options";
  solidColor?: string;
  optionsSource?: { formId: string; fieldId: string; countryFieldId?: string };
  optionColors?: Record<string, string>;
  border?: { enabled: boolean; color: string };
  showCountryName?: boolean;
  showCountryFlag?: boolean;
  footerImage?: string;
}

interface MapConfigValue {
  metrics: MapMetric[];
  filters: any[];
  appearance: MapAppearance;
}

interface MapConfigPanelProps {
  value: MapConfigValue;
  onChange: (val: MapConfigValue) => void;
  forms: any[];
}

export default function MapConfigPanel({ value, onChange, forms }: MapConfigPanelProps) {
  const { t } = useTranslation();
  const metricFormIds = useMemo(() => Array.from(new Set(value.metrics.map(m => m.formId).filter(Boolean))), [value.metrics]);
  const { formFieldsMap } = useMultipleIndividualFormFields(metricFormIds);

  const updateMetric = (idx: number, updates: Partial<MapMetric>) => {
    const metrics = [...value.metrics];
    metrics[idx] = { ...metrics[idx], ...updates } as MapMetric;
    onChange({ ...value, metrics });
  };

  const addMetric = () => {
    const metrics = [...value.metrics, { formId: "", countryFieldId: "", valueFieldId: "", label: "" }];
    onChange({ ...value, metrics });
  };

  const removeMetric = (idx: number) => {
    const metrics = value.metrics.filter((_, i) => i !== idx);
    onChange({ ...value, metrics });
  };

  const appearance = value.appearance || { coloringMode: "solid", solidColor: "#012473", border: { enabled: false, color: "#ffffff" } };

  // Map metrics to appearance metrics shape for MapAppearanceEditor
  const appearanceMetrics = useMemo(() => value.metrics.map(m => ({ formId: m.formId, countryFieldId: m.countryFieldId })), [value.metrics]);

  // Build formNamesById for appearance editor labels
  const formNamesById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const f of forms) map[f.id] = f.name || f.title || f.id;
    return map;
  }, [forms]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('processManagement.metrics')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {value.metrics.map((m, idx) => {
            const fields = formFieldsMap[m.formId] || [];
            const countryFields = (forms.find((f: any) => f.id === m.formId)?.countryFields) || [];
            return (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <Label>{t('processManagement.form')}</Label>
                  <Select value={m.formId} onValueChange={(formId) => updateMetric(idx, { formId, countryFieldId: "", valueFieldId: "" })}>
                    <SelectTrigger><SelectValue placeholder={t('processManagement.selectFormPlaceholder')} /></SelectTrigger>
                    <SelectContent>
                      {forms.map((f: any) => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('processManagement.countryField')}</Label>
                  <Select value={m.countryFieldId} onValueChange={(countryFieldId) => updateMetric(idx, { countryFieldId })}>
                    <SelectTrigger><SelectValue placeholder={t('processManagement.selectCountryField')} /></SelectTrigger>
                    <SelectContent>
                      {countryFields.map((f: any) => (
                        <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('processManagement.valueField')}</Label>
                  <Select value={m.valueFieldId} onValueChange={(valueFieldId) => updateMetric(idx, { valueFieldId })}>
                    <SelectTrigger><SelectValue placeholder={t('processManagement.selectValueField')} /></SelectTrigger>
                    <SelectContent>
                      {fields.map((f: any) => (
                        <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('processManagement.label')}</Label>
                  <Input value={m.label || ""} onChange={(e) => updateMetric(idx, { label: e.target.value })} placeholder={t('processManagement.optionalLabel')} />
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <Button variant="ghost" className="text-red-600" onClick={() => removeMetric(idx)}>{t('processManagement.remove')}</Button>
                </div>
              </div>
            );
          })}
          <Button onClick={addMetric}>{t('processManagement.addMetric')}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('processManagement.appearance')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MapAppearanceEditor
            appearance={appearance as any}
            metrics={appearanceMetrics as any}
            formFieldsMap={formFieldsMap as any}
            formNamesById={formNamesById}
            onChange={(app) => onChange({ ...value, appearance: app as any })}
          />
          {appearance.coloringMode === 'options' && (!appearance.optionsSource?.formId || !appearance.optionsSource?.fieldId) && (
            <p className="text-xs text-red-600">{t('processManagement.whenUsingByOptionsColoringPleaseSelectFormAndSelectTypeField')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

