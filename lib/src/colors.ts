import type { Point } from "./types";

/**
 * Converts HSL components to RGB.
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-1)
 * @param l - Lightness (0-1)
 * @returns RGB components, each 0-255
 * @public
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number
): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
  };
  return [f(0), f(8), f(4)];
}

/**
 * Converts HSL components to a hex color string.
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-1)
 * @param l - Lightness (0-1)
 * @returns Hex color string like "#aabbcc"
 * @public
 */
export function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts a hex color string to HSL components.
 *
 * @param hex - Hex color string like "#aabbcc" (with or without "#")
 * @returns HSL components (h 0-360, s 0-1, l 0-1), or undefined for invalid input
 * @public
 */
export function hexToHsl(
  hex: string
): { h: number; s: number; l: number } | undefined {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return undefined;

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;

  return { h: h * 60, s, l };
}

/**
 * Converts HSL components to OKLCH.
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-1)
 * @param l - Lightness (0-1)
 * @returns OKLCH components (l 0-1, c chroma, h hue 0-360)
 * @public
 */
export function hslToOklch(
  h: number,
  s: number,
  l: number
): { l: number; c: number; h: number } {
  const [r255, g255, b255] = hslToRgb(h, s, l);

  // sRGB -> linear RGB
  const toLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const lr = toLinear(r255);
  const lg = toLinear(g255);
  const lb = toLinear(b255);

  // linear RGB -> OKLab
  const l_ = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  );
  const m_ = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  );
  const s_ = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
  );

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // OKLab -> OKLCH
  const c = Math.sqrt(a * a + b * b);
  let hue = Math.atan2(b, a) * (180 / Math.PI);
  if (hue < 0) hue += 360;

  return { l: L, c, h: hue };
}

/**
 * Formats a point's color as a CSS hsla() string.
 *
 * @param point - The point whose color to format
 * @param alpha - Alpha value (0-1), defaults to 1
 * @returns CSS color string like "hsla(200, 80%, 60%, 1)"
 * @public
 */
export function pointToHsla(point: Point, alpha: number = 1): string {
  return `hsla(${Math.round(point.h % 360)}, ${Math.round(point.s * 100)}%, ${Math.round(point.l * 100)}%, ${alpha.toFixed(3)})`;
}

/**
 * Formats a point's color as a hex string.
 * @public
 */
export function pointToHex(point: Point): string {
  return hslToHex(point.h, point.s, point.l);
}

/**
 * Formats a point's color as a CSS rgb() string.
 * @public
 */
export function pointToRgb(point: Point): string {
  return `rgb(${hslToRgb(point.h, point.s, point.l).join(", ")})`;
}

/**
 * Formats a point's color as a CSS hsl() string.
 * @public
 */
export function pointToHsl(point: Point): string {
  return `hsl(${Math.round(point.h % 360)} ${Math.round(point.s * 100)}% ${Math.round(point.l * 100)}%)`;
}

/**
 * Formats a point's color as a CSS oklch() string.
 * @public
 */
export function pointToOklch(point: Point): string {
  const { l, c, h } = hslToOklch(point.h, point.s, point.l);
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
}
