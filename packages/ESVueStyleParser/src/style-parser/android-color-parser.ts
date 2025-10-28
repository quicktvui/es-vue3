/**
 * Parse a CSS color string or number into Android ARGB hex string (#AARRGGBB)
 * Supports: hex (#rrggbb, #aarrggbb), rgb(...), rgba(...), hsl(...), hsla(...), named colors
 *
 * No third-party dependencies used.
 */

import { namedColors } from "./named-colors"; // 替换为你实际的路径

export function convertToAndroidHexColor(color: string | number): string {
  try {
    const intColor = parseCssColorToArgbInt(color);
    return intColorToAndroidHex(intColor);
  } catch (e) {
    console.warn(`Invalid color: ${color}`, e);
    return "#FF000000"; // fallback: opaque black
  }
}

function parseCssColorToArgbInt(color: string | number): number {
  const intColor = baseColor(color);
  if (intColor == null) throw new Error(`Bad color: ${color}`);
  return intColor >>> 0;
}

function intColorToAndroidHex(intColor: number): string {
  const a = (intColor >>> 24) & 0xff;
  const r = (intColor >>> 16) & 0xff;
  const g = (intColor >>> 8) & 0xff;
  const b = intColor & 0xff;

  return (
    "#" +
    a.toString(16).padStart(2, "0") +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  ).toUpperCase();
}

function baseColor(raw: string | number): number | null {
  if (typeof raw === "number") return raw >>> 0;
  const color = raw.trim().toLowerCase();

  if (namedColors[color] != null) {
    return convertRgbaToArgb(namedColors[color]);
  }

  if (/^#([a-f0-9]{6})$/.test(color)) {
    const [r, g, b] = hex6ToRgb(color);
    return ((0xff << 24) | (r << 16) | (g << 8) | b) >>> 0;
  }

  if (/^#([a-f0-9]{8})$/.test(color)) {
    // Android-style ARGB hex, e.g., #AARRGGBB
    return parseInt(color.slice(1), 16) >>> 0;
  }

  const rgbMatch = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/.exec(color);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch.slice(1, 4).map((n) => clamp255(+n));
    return ((0xff << 24) | (r << 16) | (g << 8) | b) >>> 0;
  }

  const rgbaMatch =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([0-9.]+)\s*\)$/.exec(color);
  if (rgbaMatch) {
    const [r, g, b] = rgbaMatch.slice(1, 4).map((n) => clamp255(+n));
    const a = clamp1(+rgbaMatch[4]);
    return ((Math.round(a * 255) << 24) | (r << 16) | (g << 8) | b) >>> 0;
  }

  const hslMatch = /^hsl\(\s*([0-9.]+)\s*,\s*([0-9.]+)%\s*,\s*([0-9.]+)%\s*\)$/.exec(color);
  if (hslMatch) {
    const [r, g, b] = hslToRgb(+hslMatch[1], +hslMatch[2], +hslMatch[3]);
    return ((0xff << 24) | (r << 16) | (g << 8) | b) >>> 0;
  }

  const hslaMatch =
    /^hsla\(\s*([0-9.]+)\s*,\s*([0-9.]+)%\s*,\s*([0-9.]+)%\s*,\s*([0-9.]+)\s*\)$/.exec(color);
  if (hslaMatch) {
    const [r, g, b] = hslToRgb(+hslaMatch[1], +hslaMatch[2], +hslaMatch[3]);
    const a = clamp1(+hslaMatch[4]);
    return ((Math.round(a * 255) << 24) | (r << 16) | (g << 8) | b) >>> 0;
  }

  return null;
}

function convertRgbaToArgb(rgba: number): number {
  const r = (rgba >>> 24) & 0xff;
  const g = (rgba >>> 16) & 0xff;
  const b = (rgba >>> 8) & 0xff;
  const a = rgba & 0xff;
  return ((a << 24) | (r << 16) | (g << 8) | b) >>> 0;
}

function hex6ToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function clamp1(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [clamp255((r + m) * 255), clamp255((g + m) * 255), clamp255((b + m) * 255)];
}
