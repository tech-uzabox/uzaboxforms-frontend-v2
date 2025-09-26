// Color palette system for dashboard visualizations
// Integrated with the existing app theme colors

// Categorical palettes for charts (bars, lines, pie slices)
export type CategoricalPaletteId =
  | "default"
  | "ocean"
  | "forest"
  | "sunset"
  | "purple"
  | "corporate"
  | "vibrant"
  | "pastel";

// Sequential palettes for heatmaps
export type SequentialPaletteId = "blue" | "green" | "red" | "purple" | "teal";

// Categorical color palettes
const CATEGORICAL_PALETTES: Record<CategoricalPaletteId, string[]> = {
  // Primary: Based on existing app colors
  default: [
    "#012473", // Primary blue (darkBlue)
    "#3B82F6", // Blue-500
    "#60A5FA", // Blue-400
    "#93C5FD", // Blue-300
    "#DBEAFE", // Blue-200
    "#1E40AF", // Blue-700
    "#1D4ED8", // Blue-600
    "#2563EB", // Blue-500 variant
  ],

  // Ocean theme
  ocean: [
    "#0EA5E9", // Sky-500
    "#0284C7", // Sky-600
    "#0369A1", // Sky-700
    "#075985", // Sky-800
    "#06B6D4", // Cyan-500
    "#0891B2", // Cyan-600
    "#0E7490", // Cyan-700
    "#155E75", // Cyan-800
  ],

  // Forest theme
  forest: [
    "#22C55E", // Green-500
    "#16A34A", // Green-600
    "#15803D", // Green-700
    "#166534", // Green-800
    "#84CC16", // Lime-500
    "#65A30D", // Lime-600
    "#4D7C0F", // Lime-700
    "#365314", // Lime-800
  ],

  // Sunset theme
  sunset: [
    "#F59E0B", // Amber-500
    "#D97706", // Amber-600
    "#B45309", // Amber-700
    "#92400E", // Amber-800
    "#F97316", // Orange-500
    "#EA580C", // Orange-600
    "#C2410C", // Orange-700
    "#9A3412", // Orange-800
  ],

  // Purple theme
  purple: [
    "#A855F7", // Purple-500
    "#9333EA", // Purple-600
    "#7C3AED", // Purple-700
    "#6D28D9", // Purple-800
    "#C084FC", // Purple-400
    "#DDD6FE", // Purple-200
    "#8B5CF6", // Violet-500
    "#7C3AED", // Violet-700
  ],

  // Corporate theme
  corporate: [
    "#374151", // Gray-700
    "#4B5563", // Gray-600
    "#6B7280", // Gray-500
    "#9CA3AF", // Gray-400
    "#1F2937", // Gray-800
    "#111827", // Gray-900
    "#F3F4F6", // Gray-100
    "#E5E7EB", // Gray-200
  ],

  // Vibrant theme
  vibrant: [
    "#EF4444", // Red-500
    "#F59E0B", // Amber-500
    "#22C55E", // Green-500
    "#3B82F6", // Blue-500
    "#A855F7", // Purple-500
    "#EC4899", // Pink-500
    "#06B6D4", // Cyan-500
    "#84CC16", // Lime-500
  ],

  // Pastel theme
  pastel: [
    "#FED7D7", // Red-200
    "#FED7AA", // Orange-200
    "#FDE68A", // Yellow-200
    "#D9F99D", // Lime-200
    "#BBF7D0", // Green-200
    "#A7F3D0", // Emerald-200
    "#B2F5EA", // Teal-200
    "#BFDBFE", // Blue-200
  ],
};

// Sequential color palettes for heatmaps
const SEQUENTIAL_PALETTES: Record<
  SequentialPaletteId,
  { low: string; mid: string; high: string }
> = {
  blue: {
    low: "#EFF6FF", // Blue-50
    mid: "#3B82F6", // Blue-500
    high: "#1E3A8A", // Blue-900
  },
  green: {
    low: "#F0FDF4", // Green-50
    mid: "#22C55E", // Green-500
    high: "#14532D", // Green-900
  },
  red: {
    low: "#FEF2F2", // Red-50
    mid: "#EF4444", // Red-500
    high: "#7F1D1D", // Red-900
  },
  purple: {
    low: "#FAF5FF", // Purple-50
    mid: "#A855F7", // Purple-500
    high: "#581C87", // Purple-900
  },
  teal: {
    low: "#F0FDFA", // Teal-50
    mid: "#14B8A6", // Teal-500
    high: "#134E4A", // Teal-900
  },
};

// Palette metadata for UI display
export interface PaletteInfo {
  id: string;
  name: string;
  description: string;
  colors: string[];
}

export const CATEGORICAL_PALETTE_INFO: PaletteInfo[] = [
  {
    id: "default",
    name: "Default",
    description: "Based on your app's primary colors",
    colors: CATEGORICAL_PALETTES.default,
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool blues and cyans",
    colors: CATEGORICAL_PALETTES.ocean,
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural greens and earth tones",
    colors: CATEGORICAL_PALETTES.forest,
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm oranges and ambers",
    colors: CATEGORICAL_PALETTES.sunset,
  },
  {
    id: "purple",
    name: "Purple",
    description: "Rich purples and violets",
    colors: CATEGORICAL_PALETTES.purple,
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional grays and neutrals",
    colors: CATEGORICAL_PALETTES.corporate,
  },
  {
    id: "vibrant",
    name: "Vibrant",
    description: "Bold and energetic colors",
    colors: CATEGORICAL_PALETTES.vibrant,
  },
  {
    id: "pastel",
    name: "Pastel",
    description: "Soft and gentle colors",
    colors: CATEGORICAL_PALETTES.pastel,
  },
];

export const SEQUENTIAL_PALETTE_INFO: PaletteInfo[] = [
  {
    id: "blue",
    name: "Blue",
    description: "Light to dark blue gradient",
    colors: [
      SEQUENTIAL_PALETTES.blue.low,
      SEQUENTIAL_PALETTES.blue.mid,
      SEQUENTIAL_PALETTES.blue.high,
    ],
  },
  {
    id: "green",
    name: "Green",
    description: "Light to dark green gradient",
    colors: [
      SEQUENTIAL_PALETTES.green.low,
      SEQUENTIAL_PALETTES.green.mid,
      SEQUENTIAL_PALETTES.green.high,
    ],
  },
  {
    id: "red",
    name: "Red",
    description: "Light to dark red gradient",
    colors: [
      SEQUENTIAL_PALETTES.red.low,
      SEQUENTIAL_PALETTES.red.mid,
      SEQUENTIAL_PALETTES.red.high,
    ],
  },
  {
    id: "purple",
    name: "Purple",
    description: "Light to dark purple gradient",
    colors: [
      SEQUENTIAL_PALETTES.purple.low,
      SEQUENTIAL_PALETTES.purple.mid,
      SEQUENTIAL_PALETTES.purple.high,
    ],
  },
  {
    id: "teal",
    name: "Teal",
    description: "Light to dark teal gradient",
    colors: [
      SEQUENTIAL_PALETTES.teal.low,
      SEQUENTIAL_PALETTES.teal.mid,
      SEQUENTIAL_PALETTES.teal.high,
    ],
  },
];

// Utility functions
export function getCategoricalColor(
  index: number,
  paletteId: CategoricalPaletteId
): string {
  const palette = CATEGORICAL_PALETTES[paletteId];
  return palette[index % palette?.length];
}

export function getSequentialColor(
  value: number,
  maxValue: number,
  paletteId: SequentialPaletteId
): string {
  const palette = SEQUENTIAL_PALETTES[paletteId];
  const ratio = Math.max(0, Math.min(1, value / maxValue));

  if (ratio === 0) return palette?.low;
  if (ratio === 1) return palette?.high;

  // Linear interpolation between low -> mid -> high
  if (ratio <= 0.5) {
    // Interpolate between low and mid
    return interpolateColor(palette.low, palette.mid, ratio * 2);
  } else {
    // Interpolate between mid and high
    return interpolateColor(palette.mid, palette.high, (ratio - 0.5) * 2);
  }
}

export function resolveSeriesColor(
  index: number,
  paletteMode?: "preset" | "custom",
  presetId?: string,
  customColors?: string[]
): string {
  // Custom colors take precedence
  if (paletteMode === "custom" && customColors && customColors.length > 0) {
    return customColors[index % customColors.length];
  }

  // Use preset palette
  const paletteId = (presetId as CategoricalPaletteId) || "primary";
  return getCategoricalColor(index, paletteId);
}

// Color interpolation utility
function interpolateColor(
  color1: string,
  color2: string,
  ratio: number
): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Default color for fallback
export const DEFAULT_COLOR = "#3B82F6"; // Blue-500

// Chart-specific color utilities
export function getChartColors(
  seriesCount: number,
  paletteId: CategoricalPaletteId = "default"
): string[] {
  const colors: string[] = [];
  for (let i = 0; i < seriesCount; i++) {
    colors.push(getCategoricalColor(i, paletteId));
  }
  return colors;
}
