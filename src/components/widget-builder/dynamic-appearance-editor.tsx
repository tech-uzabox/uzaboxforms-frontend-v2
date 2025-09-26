import { useCallback, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { CHART_APPEARANCE_DEFAULTS } from "@/constants/widget-types";
import { Palette, Grid, BarChart3, LineChart, Eye } from "lucide-react";
import { IWidgetAppearance, VisualizationType } from "@/types/dashboard.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DynamicAppearanceEditorProps {
  appearance: IWidgetAppearance;
  onChange: (appearance: IWidgetAppearance) => void;
  visualizationType: VisualizationType;
}

interface VisibilityRules {
  [key: string]: VisualizationType[];
}

const VISIBILITY_RULES: VisibilityRules = {
  // Color Palettes - based on actual WidgetRenderer usage
  presetCategoricalPaletteId: ['bar', 'line', 'histogram', 'scatter'], // Pie uses auto colors
  presetSequentialPaletteId: ['calendar-heatmap'], // Actually used for heatmap intensity
  legend: ['bar', 'line', 'pie', 'histogram', 'scatter'],

  // Bar Chart Specific
  barOrientation: ['bar'],
  barCombinationMode: ['bar'],

  // Line Chart Specific
  lineStyle: ['line'],
  showPoints: ['line'],
  pointSize: ['line'],

  // Axes (for charts with coordinate systems)
  showXAxisLabels: ['bar', 'line', 'histogram', 'scatter'],
  showYAxisLabels: ['bar', 'line', 'histogram', 'scatter'],
  xAxisLabelRotation: ['bar', 'histogram'],

  // Grid (for charts with grid backgrounds)
  showGrid: ['bar', 'line', 'histogram', 'scatter'],
  gridStyle: ['bar', 'line', 'histogram', 'scatter'],
  gridColor: ['bar', 'line', 'histogram', 'scatter'],
};

const PRESET_PALETTES = [
  { id: 'default', name: 'Default', colors: ['#8884d8', '#82ca9d', '#ffc658'] },
  { id: 'blues', name: 'Blues', colors: ['#1f77b4', '#aec7e8', '#c5dbf7'] },
  { id: 'greens', name: 'Greens', colors: ['#2ca02c', '#98df8a', '#c9f2c9'] },
  { id: 'reds', name: 'Reds', colors: ['#d62728', '#ff9896', '#ffcccb'] },
  { id: 'purples', name: 'Purples', colors: ['#9467bd', '#c5b0d5', '#e7d4f0'] },
  { id: 'oranges', name: 'Oranges', colors: ['#ff7f0e', '#ffbb78', '#ffd6b8'] },
  { id: 'teals', name: 'Teals', colors: ['#17becf', '#9edae5', '#c7f0f5'] },
  { id: 'earth', name: 'Earth Tones', colors: ['#8c564b', '#c49c94', '#e5d3ca'] },
];

export function DynamicAppearanceEditor({
  appearance,
  onChange,
  visualizationType
}: DynamicAppearanceEditorProps) {
  const { t } = useTranslation();
  const currentAppearance = useMemo(() => ({
    ...CHART_APPEARANCE_DEFAULTS,
    ...appearance,
  }), [appearance]);

  const isVisible = useCallback((setting: string): boolean => {
    const rule = VISIBILITY_RULES[setting];
    return rule ? rule.includes(visualizationType) : false;
  }, [visualizationType]);

  const updateAppearance = useCallback((updates: Partial<IWidgetAppearance>) => {
    onChange({
      ...currentAppearance,
      ...updates,
    });
  }, [currentAppearance, onChange]);

  const visibleSections = useMemo(() => {
    const sections = [];

    // Colors section: includes palettes and legend
    if (isVisible('presetCategoricalPaletteId') || isVisible('presetSequentialPaletteId') || isVisible('legend')) {
      sections.push('colors');
    }

    // Chart-specific styling section
    if (isVisible('barOrientation') || isVisible('barCombinationMode') || isVisible('lineStyle') || isVisible('showPoints')) {
      sections.push('chart');
    }

    // Axes and grid section
    if (isVisible('showGrid') || isVisible('showXAxisLabels') || isVisible('showYAxisLabels')) {
      sections.push('axes');
    }

    return sections;
  }, [isVisible]);

  if (visibleSections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {t('processManagement.appearance')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>{t('processManagement.noAppearanceSettingsAvailable', { type: visualizationType })}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          {t('processManagement.appearanceSettings')}
        </CardTitle>
        <div className="flex gap-1 flex-wrap">
          {visibleSections.map(section => (
            <Badge key={section} variant="outline" className="text-xs">
              {section}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {visibleSections.includes('background') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded border" />
              <Label className="text-sm font-medium">{t('processManagement.background')}</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor" className="text-sm">{t('processManagement.backgroundColor')}</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={currentAppearance.backgroundColor || "#ffffff"}
                  onChange={(e) => updateAppearance({ backgroundColor: e.target.value })}
                  className="w-16 h-10 p-1 rounded cursor-pointer"
                />
                <Input
                  value={currentAppearance.backgroundColor || "#ffffff"}
                  onChange={(e) => updateAppearance({ backgroundColor: e.target.value })}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}

        {visibleSections.includes('colors') && (
          <>
            {visibleSections.includes('background') && <Separator />}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <Label className="text-sm font-medium">{t('processManagement.colorsLegend')}</Label>
              </div>

              {isVisible('presetCategoricalPaletteId') && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">{t('processManagement.colorPalette')}</Label>
                    <Select
                      value={currentAppearance.presetCategoricalPaletteId || 'default'}
                      onValueChange={(value) => updateAppearance({
                        presetCategoricalPaletteId: value,
                        paletteMode: 'preset'
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRESET_PALETTES.map((palette) => (
                          <SelectItem key={palette.id} value={palette.id}>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {palette.colors.slice(0, 3).map((color, i) => (
                                  <div
                                    key={i}
                                    className="w-3 h-3 rounded-full border"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                              <span>{palette.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {isVisible('presetSequentialPaletteId') && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">{t('processManagement.heatmapColorIntensity')}</Label>
                    <Select
                      value={currentAppearance.presetSequentialPaletteId || 'blues'}
                      onValueChange={(value) => updateAppearance({
                        presetSequentialPaletteId: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blues">{t('processManagement.blues')}</SelectItem>
                        <SelectItem value="greens">{t('processManagement.greens')}</SelectItem>
                        <SelectItem value="reds">{t('processManagement.reds')}</SelectItem>
                        <SelectItem value="purples">{t('processManagement.purples')}</SelectItem>
                        <SelectItem value="oranges">{t('processManagement.oranges')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {isVisible('legend') && (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm">{t('processManagement.showLegend')}</Label>
                    <p className="text-xs text-gray-500">{t('processManagement.displayChartLegendWhenMultipleSeries')}</p>
                  </div>
                  <Switch
                    checked={currentAppearance.legend ?? true}
                    onCheckedChange={(checked) => updateAppearance({ legend: checked })}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {visibleSections.includes('chart') && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {visualizationType === 'bar' ? <BarChart3 className="w-4 h-4" /> : <LineChart className="w-4 h-4" />}
                <Label className="text-sm font-medium">{t('processManagement.chartStyle')}</Label>
              </div>

              {isVisible('barOrientation') && (
                <div className="space-y-2">
                  <Label className="text-sm">{t('processManagement.barOrientation')}</Label>
                  <Select
                    value={currentAppearance.barOrientation || 'vertical'}
                    onValueChange={(value: 'vertical' | 'horizontal') =>
                      updateAppearance({ barOrientation: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vertical">{t('processManagement.vertical')}</SelectItem>
                      <SelectItem value="horizontal">{t('processManagement.horizontal')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isVisible('barCombinationMode') && (
                <div className="space-y-2">
                  <Label className="text-sm">{t('processManagement.barCombination')}</Label>
                  <Select
                    value={currentAppearance.barCombinationMode || 'grouped'}
                    onValueChange={(value: 'grouped' | 'stacked') =>
                      updateAppearance({ barCombinationMode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grouped">{t('processManagement.groupedSideBySide')}</SelectItem>
                      <SelectItem value="stacked">{t('processManagement.stacked')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isVisible('lineStyle') && (
                <div className="space-y-2">
                  <Label className="text-sm">{t('processManagement.lineStyle')}</Label>
                  <Select
                    value={currentAppearance.lineStyle || 'solid'}
                    onValueChange={(value: 'solid' | 'dashed' | 'dotted') =>
                      updateAppearance({ lineStyle: value })
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
              )}

              {isVisible('showPoints') && (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm">{t('processManagement.showDataPoints')}</Label>
                    <p className="text-xs text-gray-500">{t('processManagement.displayDotsOnLineChart')}</p>
                  </div>
                  <Switch
                    checked={currentAppearance.showPoints ?? true}
                    onCheckedChange={(checked) => updateAppearance({ showPoints: checked })}
                  />
                </div>
              )}

              {isVisible('pointSize') && currentAppearance.showPoints && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('processManagement.pointSize')}</Label>
                    <span className="text-xs text-gray-500">{currentAppearance.pointSize || 3}px</span>
                  </div>
                  <Slider
                    value={[currentAppearance.pointSize || 3]}
                    onValueChange={([value]) => updateAppearance({ pointSize: value })}
                    max={8}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {visibleSections.includes('axes') && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                <Label className="text-sm font-medium">{t('processManagement.axesGrid')}</Label>
              </div>

              {isVisible('showGrid') && (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm">{t('processManagement.showGridLines')}</Label>
                    <p className="text-xs text-gray-500">{t('processManagement.displayBackgroundGridLines')}</p>
                  </div>
                  <Switch
                    checked={currentAppearance.showGrid ?? true}
                    onCheckedChange={(checked) => updateAppearance({ showGrid: checked })}
                  />
                </div>
              )}

              {/* {isVisible('gridStyle') && currentAppearance.showGrid && (
                <div className="space-y-2">
                  <Label className="text-sm">Grid Style</Label>
                  <Select
                    value={currentAppearance.gridStyle || 'solid'}
                    onValueChange={(value: 'solid' | 'dashed' | 'dotted') =>
                      updateAppearance({ gridStyle: value })
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
              )} */}

              {isVisible('showXAxisLabels') && (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm">{t('processManagement.showXAxisLabels')}</Label>
                    <p className="text-xs text-gray-500">{t('processManagement.displayLabelsOnHorizontalAxis')}</p>
                  </div>
                  <Switch
                    checked={currentAppearance.showXAxisLabels ?? true}
                    onCheckedChange={(checked) => updateAppearance({ showXAxisLabels: checked })}
                  />
                </div>
              )}

              {isVisible('xAxisLabelRotation') && currentAppearance.showXAxisLabels && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('processManagement.xAxisLabelRotation')}</Label>
                    <span className="text-xs text-gray-500">{currentAppearance.xAxisLabelRotation || 0}°</span>
                  </div>
                  <Slider
                    value={[currentAppearance.xAxisLabelRotation || 0]}
                    onValueChange={([value]) => updateAppearance({ xAxisLabelRotation: value })}
                    max={90}
                    min={0}
                    step={15}
                    className="w-full"
                  />
                </div>
              )}

              {isVisible('showYAxisLabels') && (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm">{t('processManagement.showYAxisLabels')}</Label>
                    <p className="text-xs text-gray-500">{t('processManagement.displayLabelsOnVerticalAxis')}</p>
                  </div>
                  <Switch
                    checked={currentAppearance.showYAxisLabels ?? true}
                    onCheckedChange={(checked) => updateAppearance({ showYAxisLabels: checked })}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
