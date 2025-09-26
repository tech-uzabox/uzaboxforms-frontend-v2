"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from 'react-i18next';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useMemo, useRef, useState } from "react";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MapAppearance {
  coloringMode: "solid" | "options";
  solidColor?: string;
  optionsSource?: { formId: string; fieldId: string; countryFieldId?: string };
  optionColors?: Record<string, string>;
  border?: { enabled: boolean; color: string };
  showCountryName?: boolean;
  showCountryFlag?: boolean;
  footerImage?: string; // filename returned by /api/upload
}

interface FormField { id: string; label: string; type: string; options?: string[] }

interface MapAppearanceEditorProps {
  appearance: MapAppearance;
  metrics: { formId: string; countryFieldId: string }[];
  formFieldsMap: Record<string, FormField[]>;
  formNamesById?: Record<string, string>;
  onChange: (val: MapAppearance) => void;
}

export default function MapAppearanceEditor({ appearance, metrics, formFieldsMap, formNamesById = {}, onChange }: MapAppearanceEditorProps) {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const metricFormIds = useMemo(() => Array.from(new Set(metrics.map(m => m.formId).filter(Boolean))), [metrics]);

  const update = (u: Partial<MapAppearance>) => onChange({ ...appearance, ...u });

  const selectedFormId = appearance.optionsSource?.formId || "";
  const selectedFieldId = appearance.optionsSource?.fieldId || "";
  const selectedFormFields = formFieldsMap[selectedFormId] || [];
  const selectableFields = selectedFormFields.filter(f => ["select", "Dropdown"].includes(f.type));
  const selectedField = selectableFields.find(f => f.id === selectedFieldId);
  const options = selectedField?.options || [];

  const countryFieldIdForSelectedForm = useMemo(() => {
    const m = metrics.find(m => m.formId === selectedFormId);
    return m?.countryFieldId;
  }, [metrics, selectedFormId]);

  const optionColor = (opt: string) => appearance.optionColors?.[opt] || "#888888";

  const setOptionColor = (opt: string, color: string) => {
    const next = { ...(appearance.optionColors || {}) };
    next[opt] = color;
    update({ optionColors: next });
  };

  const handleFooterUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFooterFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setIsUploading(true);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      update({ footerImage: data.filename });
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFooterRemove = async () => {
    if (!appearance.footerImage) return;
    try {
      setIsUploading(true);
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: appearance.footerImage }),
      });
      update({ footerImage: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('processManagement.mapAppearance')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>{t('processManagement.coloringMode')}</Label>
            <Select value={appearance.coloringMode} onValueChange={(v: any) => update({ coloringMode: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">{t('processManagement.solid')}</SelectItem>
                <SelectItem value="options">{t('processManagement.byOptions')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {appearance.coloringMode === "solid" && (
            <div>
              <Label>{t('processManagement.solidColor')}</Label>
              <Input type="color" value={appearance.solidColor || "#012473"} onChange={(e) => update({ solidColor: e.target.value })} />
            </div>
          )}
        </div>

        {appearance.coloringMode === "options" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>{t('processManagement.formFromMetrics')}</Label>
                <Select value={selectedFormId} onValueChange={(formId) => update({ optionsSource: { formId, fieldId: "", countryFieldId: metrics.find(m => m.formId === formId)?.countryFieldId } })}>
                  <SelectTrigger><SelectValue placeholder={t('processManagement.selectForm')} /></SelectTrigger>
                  <SelectContent>
{metricFormIds.map(fid => (
                      <SelectItem key={fid} value={fid}>{formNamesById[fid] || fid}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('processManagement.selectField')}</Label>
                <Select value={selectedFieldId} onValueChange={(fieldId) => update({ optionsSource: { formId: selectedFormId, fieldId, countryFieldId: countryFieldIdForSelectedForm } })}>
                  <SelectTrigger><SelectValue placeholder={t('processManagement.selectFieldPlaceholder')} /></SelectTrigger>
                  <SelectContent>
                    {selectableFields.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {options.length > 0 && (
              <div className="space-y-2">
                <Label>{t('processManagement.colorsPerOption')}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {options.map(opt => (
                    <div key={opt} className="flex items-center gap-3">
                      <div className="flex-1 text-sm">{opt}</div>
                      <Input type="color" value={optionColor(opt)} onChange={(e) => setOptionColor(opt, e.target.value)} className="w-16 p-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <Label>{t('processManagement.showCountryName')}</Label>
            <Switch checked={!!appearance.showCountryName} onCheckedChange={(v) => update({ showCountryName: !!v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t('processManagement.showCountryFlag')}</Label>
            <Switch checked={!!appearance.showCountryFlag} onCheckedChange={(v) => update({ showCountryFlag: !!v })} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex items-center justify-between">
            <Label>{t('processManagement.enableBorder')}</Label>
            <Switch checked={!!appearance.border?.enabled} onCheckedChange={(v) => update({ border: { enabled: !!v, color: appearance.border?.color || "#ffffff" } })} />
          </div>
          <div>
            <Label>{t('processManagement.borderColor')}</Label>
            <Input type="color" value={appearance.border?.color || "#ffffff"} onChange={(e) => update({ border: { enabled: appearance.border?.enabled || false, color: e.target.value } })} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{t('processManagement.footerImage')} <span className="text-xs text-gray-500 font-normal">{t('processManagement.optional')}</span></Label>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFooterFileChange}
              disabled={isUploading}
            />
            <Button type="button" variant="outline" size="sm" onClick={handleFooterUploadClick} disabled={isUploading}>
              {isUploading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('processManagement.uploading')}</>) : (<><Upload className="mr-2 h-4 w-4" />{t('processManagement.upload')}</>)}
            </Button>
            {appearance.footerImage && (
              <Button type="button" variant="outline" size="sm" onClick={handleFooterRemove} disabled={isUploading} className="text-destructive border-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {appearance.footerImage ? (
              <img src={`/api/uploads/${appearance.footerImage}`} alt="Footer" className="h-10 rounded" />
            ) : (
              <span className="text-xs text-gray-500">{t('processManagement.noImageSelected')}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
