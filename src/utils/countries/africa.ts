export function getFeatureCommonName(props: any, region: string = 'africa'): string {
  if (region === 'world') {
    return props.name || "";
  }
  return props.geounit || "";
}

export function canonicalizeCountryName(input: string): string {
  const s = String(input || "")
    .trim()
    .toLowerCase();

  return s;
}
