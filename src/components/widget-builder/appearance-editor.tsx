import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IWidgetAppearance,
  IWidgetMetric,
  VisualizationType,
} from "@/types/dashboard.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { CHART_APPEARANCE_DEFAULTS } from "@/constants/widget-types";
import { Palette, Grid, Eye, BarChart, LineChart } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AppearanceEditorProps {
  appearance: IWidgetAppearance;
  widgetType: VisualizationType;
  metrics?: IWidgetMetric[];
  onChange: (appearance: IWidgetAppearance) => void;
}

export function AppearanceEditor({
  appearance,
  widgetType,
  metrics = [],
  onChange,
}: AppearanceEditorProps) {
  const { t } = useTranslation();
  const hasMultipleMetrics = metrics.length > 1;
  const supportsGrid = ['line', 'bar', 'scatter', 'histogram'].includes(widgetType);

  const updateAppearance = (updates: Partial<IWidgetAppearance>) => {
    onChange({ ...appearance, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Basic Appearance */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <Label>{t('processManagement.basicAppearance')}</Label>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label>{t('processManagement.backgroundColor')}</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={appearance.backgroundColor || '#ffffff'}
              onChange={(e) => updateAppearance({ backgroundColor: e.target.value })}
              className="w-12 h-8 p-1 border rounded"
            />
            <Input
              type="text"
              value={appearance.backgroundColor || '#ffffff'}
              onChange={(e) => updateAppearance({ backgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => updateAppearance({ backgroundColor: 'transparent' })}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {t('processManagement.transparent')}
            </button>
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-3">
          <Label>{t('processManagement.colorPalette')}</Label>
          <RadioGroup
            value={appearance.paletteMode || 'preset'}
            onValueChange={(mode: 'preset' | 'custom') =>
              updateAppearance({ paletteMode: mode })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="preset" id="preset" />
              <label htmlFor="preset">{t('processManagement.presetPalette')}</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <label htmlFor="custom">{t('processManagement.customColors')}</label>
            </div>
          </RadioGroup>

          {appearance.paletteMode === 'preset' && (
            <Select
              value={appearance.presetCategoricalPaletteId || 'default'}
              onValueChange={(paletteId) =>
                updateAppearance({ presetCategoricalPaletteId: paletteId })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{t('processManagement.defaultBlues')}</SelectItem>
                <SelectItem value="vibrant">{t('processManagement.vibrant')}</SelectItem>
                <SelectItem value="pastel">{t('processManagement.pastel')}</SelectItem>
                <SelectItem value="earth">{t('processManagement.earthTones')}</SelectItem>
                <SelectItem value="monochrome">{t('processManagement.monochrome')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Legend and Labels */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showLegend"
              checked={appearance.legend !== false}
              onCheckedChange={(checked) => updateAppearance({ legend: !!checked })}
            />
            <label htmlFor="showLegend">{t('processManagement.showLegend')}</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showXAxisLabels"
              checked={appearance.showXAxisLabels !== false}
              onCheckedChange={(checked) => updateAppearance({ showXAxisLabels: !!checked })}
            />
            <label htmlFor="showXAxisLabels">{t('processManagement.showXAxisLabels')}</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showYAxisLabels"
              checked={appearance.showYAxisLabels !== false}
              onCheckedChange={(checked) => updateAppearance({ showYAxisLabels: !!checked })}
            />
            <label htmlFor="showYAxisLabels">{t('processManagement.showYAxisLabels')}</label>
          </div>
        </div>
      </div>

      {/* Bar Chart Specific Options */}
      {widgetType === 'bar' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            <Label>{t('processManagement.barChartOptions')}</Label>
          </div>

          {/* Bar Orientation */}
          <div className="space-y-2">
            <Label>{t('processManagement.orientation')}</Label>
            <RadioGroup
              value={appearance.barOrientation || 'vertical'}
              onValueChange={(orientation: 'vertical' | 'horizontal') =>
                updateAppearance({ barOrientation: orientation })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vertical" id="vertical" />
                <label htmlFor="vertical">{t('processManagement.verticalBars')}</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="horizontal" id="horizontal" />
                <label htmlFor="horizontal">{t('processManagement.horizontalBars')}</label>
              </div>
            </RadioGroup>
          </div>

          {/* Bar Combination Mode (for multi-metric) */}
          {hasMultipleMetrics && (
            <div className="space-y-2">
              <Label>{t('processManagement.multipleMetricsDisplay')}</Label>
              <RadioGroup
                value={appearance.barCombinationMode || 'side-by-side'}
                onValueChange={(mode: any) =>
                  updateAppearance({ barCombinationMode: mode })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="side-by-side" id="side-by-side" />
                  <label htmlFor="side-by-side">{t('processManagement.sideBySide')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stacked" id="stacked" />
                  <label htmlFor="stacked">{t('processManagement.stacked')}</label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* X-Axis Label Rotation */}
          <div className="space-y-2">
            <Label>{t('processManagement.xAxisLabelRotation')}</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[appearance.xAxisLabelRotation || -45]}
                onValueChange={([value]) => updateAppearance({ xAxisLabelRotation: value })}
                min={-90}
                max={90}
                step={15}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-12">
                {appearance.xAxisLabelRotation || -45}°
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Line Chart Specific Options */}
      {widgetType === 'line' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            <Label>{t('processManagement.lineChartOptions')}</Label>
          </div>

          {/* Line Style */}
          <div className="space-y-2">
            <Label>{t('processManagement.lineStyle')}</Label>
            <Select
              value={appearance.lineStyle || 'solid'}
              onValueChange={(style: 'solid' | 'dashed' | 'dotted') =>
                updateAppearance({ lineStyle: style })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">{t('processManagement.solid')}</SelectItem>
                <SelectItem value="dashed">{t('processManagement.dashed')}</SelectItem>
                <SelectItem value="dotted">{t('processManagement.dotted')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show Points */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showPoints"
              checked={appearance.showPoints !== false}
              onCheckedChange={(checked) => updateAppearance({ showPoints: !!checked })}
            />
            <label htmlFor="showPoints">{t('processManagement.showDataPoints')}</label>
          </div>

          {/* Point Size */}
          {appearance.showPoints !== false && (
            <div className="space-y-2">
              <Label>{t('processManagement.pointSize')}</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[appearance.pointSize || 3]}
                  onValueChange={([value]) => updateAppearance({ pointSize: value })}
                  min={1}
                  max={8}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500 w-8">
                  {appearance.pointSize || 3}px
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid Options for supported chart types */}
      {supportsGrid && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4" />
            <Label>{t('processManagement.gridOptions')}</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showGrid"
              checked={appearance.showGrid !== false}
              onCheckedChange={(checked) => updateAppearance({ showGrid: !!checked })}
            />
            <label htmlFor="showGrid">{t('processManagement.showGridLines')}</label>
          </div>

          {appearance.showGrid !== false && (
            <div className="ml-6 space-y-4">
              <div className="space-y-2">
                <Label>{t('processManagement.gridStyle')}</Label>
                <Select
                  value={appearance.gridStyle || 'solid'}
                  onValueChange={(style: 'solid' | 'dashed') =>
                    updateAppearance({ gridStyle: style })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">{t('processManagement.solid')}</SelectItem>
                    <SelectItem value="dashed">{t('processManagement.dashed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('processManagement.gridColor')}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={appearance.gridColor || '#E5E7EB'}
                    onChange={(e) => updateAppearance({ gridColor: e.target.value })}
                    className="w-12 h-8 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={appearance.gridColor || '#E5E7EB'}
                    onChange={(e) => updateAppearance({ gridColor: e.target.value })}
                    placeholder="#E5E7EB"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <Label>{t('processManagement.appearancePreview')}</Label>
        </div>
        <div
          className="h-24 rounded-lg border-2 border-dashed p-4 flex items-center justify-center text-sm text-gray-500"
          style={{
            backgroundColor: appearance.backgroundColor || 'transparent',
            borderColor: appearance.gridColor || '#E5E7EB'
          }}
        >
          {t('processManagement.widgetWillAppearWithTheseSettings')}
        </div>
      </div>

      {/* Reset to Defaults */}
      <div className="pt-4 border-t">
        <button
          type="button"
          onClick={() => onChange(CHART_APPEARANCE_DEFAULTS)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t('processManagement.resetToDefaults')}
        </button>
      </div>
    </div>
  );
}
