import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  canonicalizeCountryName,
  getFeatureCommonName,
} from "@/utils/countries/africa";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import africaGeo from "@/constants/africa.geo.json";
import worldGeo from "@/constants/world.geo.json";

interface MapWidgetProps {
  data: {
    type: "map";
    title: string;
    countries: Record<
      string,
      { values: Record<string, unknown>; colorValue?: string }
    >;
    meta: any;
    empty: boolean;
  };
  widget: any;
}

export default function MapWidget({ data }: MapWidgetProps) {
  const { t } = useTranslation();
  const [selectedCountryKey, setSelectedCountryKey] = useState<string | null>(
    null
  );
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(
    null
  );
  // const contentRef = React.useRef<HTMLDivElement | null>(null);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const [_footerPx, setFooterPx] = useState<number>(0);
  const [_containerPx, setContainerPx] = useState<number>(0);

  const recalcSizes = React.useCallback(() => {
    const d = dialogRef.current;
    if (!d) return;
    const h = d.clientHeight;
    if (h > 0) {
      setContainerPx(h);
      setFooterPx(Math.max(48, Math.floor(h * 0.15)));
    }
  }, []);

  React.useEffect(() => {
    recalcSizes();
    const d = dialogRef.current;
    if (!d) return;
    const ro = new ResizeObserver(() => recalcSizes());
    ro.observe(d);
    const onResize = () => recalcSizes();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [recalcSizes]);
  const formatNumber = (n: number) => Math.round(n).toLocaleString();
  const isNumericString = (s: string) => {
    if (typeof s !== "string") return false;
    if (s.trim() === "") return false;
    const n = Number(s);
    return Number.isFinite(n);
  };
  const isValidDateString = (s: string) => {
    if (typeof s !== "string") return false;
    const t = Date.parse(s);
    return !isNaN(t);
  };
  const formatDateHuman = (input: string | Date) => {
    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return String(input);
    const hasTime = typeof input === "string" && /T|\d{1,2}:\d{2}/.test(input);
    return hasTime
      ? d.toLocaleString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : d.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  };
  const formatValue = (v: any): string => {
    if (v === null || v === undefined) return "-";
    if (typeof v === "number") return formatNumber(v);
    if (typeof v === "boolean") return v ? t('processManagement.yes') : t('processManagement.no');
    if (v instanceof Date) return formatDateHuman(v);
    if (Array.isArray(v)) return v.map((x) => formatValue(x)).join(", ");
    if (typeof v === "object") return JSON.stringify(v);
    const s = String(v);
    if (isNumericString(s)) return formatNumber(Number(s));
    if (isValidDateString(s)) return formatDateHuman(s);
    return s;
  };

  const mapOptions = data?.meta?.options?.map || {};
  const region = mapOptions?.region || "africa";
  const appearance = mapOptions?.appearance || {};
  const coloringMode = appearance?.coloringMode || "solid";
  const solidColor = appearance?.solidColor || "#012473";
  const disabledColor = "#909090";
  const borderEnabled = appearance?.border?.enabled || false;
  const borderColor = appearance?.border?.color || "#ffffff";
  const showCountryName = !!appearance?.showCountryName;
  const showCountryFlag = !!appearance?.showCountryFlag;
  const footerImage = appearance?.footerImage as string | undefined;
  const geoData = region === "world" ? worldGeo : africaGeo;

  const countryAliases: Record<string, string> = {
    "Guinea Bissau": "Guinea-Bissau",
    "Republic of Congo": "Congo",
    Somaliland: "Somalia",
  };

  const [flags, setFlags] = useState<
    Record<string, { svg?: string; png?: string } | null>
  >({});

  const getFlag = async (canonicalName: string) => {
    if (canonicalName in flags) return;

    try {
      const apiName = countryAliases[canonicalName] || canonicalName.replace(/\b\w/g, l => l.toUpperCase());
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(apiName)}`
      );
      if (!response.ok) {
        setFlags((prev) => ({ ...prev, [canonicalName]: null }));
        return;
      }
      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        const countryFlags = data[0].flags;
        setFlags((prev) => ({ ...prev, [canonicalName]: countryFlags }));
      } else {
        setFlags((prev) => ({ ...prev, [canonicalName]: null }));
      }
    } catch (error) {
      console.error("Failed to fetch flag for", canonicalName, error);
      setFlags((prev) => ({ ...prev, [canonicalName]: null }));
    }
  };

  React.useEffect(() => {
    if (selectedCountryKey && showCountryFlag) {
      const flag = flags[selectedCountryKey];
      if (flag === undefined) {
        getFlag(selectedCountryKey);
      }
    }
  }, [selectedCountryKey, showCountryFlag]);

  const handleCountryClick = (key: string, displayName: string) => {
    setSelectedCountryKey(key);
    setSelectedCountryName(displayName);
  };

  const closeModal = () => {
    setSelectedCountryKey(null);
    setSelectedCountryName(null);
  };

  return (
    <div className="relative h-full w-full">
      <ComposableMap
        projectionConfig={{ scale: region === "world" ? 100 : 600, center: region === "world" ? [0, 0] : [20, 0] }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[0, 0]} maxZoom={40} zoom={1}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const featureNameRaw = getFeatureCommonName(geo.properties, region);
              const key = canonicalizeCountryName(featureNameRaw);
              const entry = data.countries[key];
              const hasData = !!entry;
              const hasAnyValue =
                hasData &&
                Object.values(entry?.values || {}).some(
                  (v) => v !== null && v !== undefined && String(v) !== ""
                );
              const clickable = hasAnyValue;
              const colorValue = entry?.colorValue;

              const fillColor = hasData
                ? (() => {
                    if (coloringMode === "options") {
                      const optionFieldId = appearance?.optionsSource?.fieldId;
                      const optionValue = optionFieldId ? entry?.values[optionFieldId] : undefined;
                      return appearance?.optionColors?.[String(optionValue)] || colorValue || disabledColor;
                    } else {
                      return solidColor;
                    }
                  })()
                : disabledColor;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={
                    clickable
                      ? () => handleCountryClick(key, featureNameRaw)
                      : undefined
                  }
                  style={{
                    default: {
                      fill: fillColor,
                      outline: "none",
                      stroke: borderEnabled ? borderColor : "#fff",
                      strokeWidth: borderEnabled ? 0.8 : 0.3,
                    },
                    hover: {
                      fill: clickable ? "#1E3A8A" : fillColor,
                      outline: "none",
                      cursor: clickable ? "pointer" : "default",
                    },
                    pressed: {
                      fill: clickable ? "#1D4ED8" : fillColor,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <Dialog
        open={!!selectedCountryKey}
        onOpenChange={(o) => {
          if (!o) closeModal();
        }}
      >
        <DialogContent
          ref={dialogRef as any}
          className="flex flex-col overflow-hidden w-[600px] min-h-[320px]"
        >
          {/* Header */}
          <DialogHeader className="flex-none">
            {showCountryName && (
              <DialogTitle className="flex items-center gap-2">
                {showCountryFlag &&
                  (() => {
                    const f = flags[selectedCountryKey!];
                    const src = f ? f.svg || f.png : undefined;
                    return src ? (
                      <img
                        src={src}
                        alt="flag"
                        className="h-5 w-7 object-cover rounded-sm"
                      />
                    ) : null;
                  })()}
                {selectedCountryName || selectedCountryKey || ""}
              </DialogTitle>
            )}
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-auto space-y-3 px-2">
            {selectedCountryKey &&
              Object.entries(
                data.countries[selectedCountryKey]?.values || {}
              ).map(([label, value]) => (
                <div key={label}>
                  <div className="text-sm font-semibold text-gray-800">
                    {label}:
                  </div>
                  <div className="text-sm text-gray-700 break-words">
                    {formatValue(value)}
                  </div>
                </div>
              ))}
          </div>

          {/* Footer with Image (25% of modal height) */}
          {footerImage && (
            <div className="flex-none border-t pt-2 w-full relative">
              <div className="relative w-full" style={{ height: "25%" }}>
                <img
                  src={`/api/uploads/${footerImage}`}
                  alt="footer"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
