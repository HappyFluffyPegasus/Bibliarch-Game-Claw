// HSL to Hex conversion
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Hex to HSL conversion
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Generate palette from hue
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  background: string;
  foreground: string;
}

export function generatePalette(hue: number): ColorPalette {
  return {
    primary: hslToHex(hue, 70, 50),
    secondary: hslToHex((hue + 30) % 360, 60, 60),
    accent: hslToHex((hue + 180) % 360, 80, 55),
    muted: hslToHex(hue, 20, 40),
    background: hslToHex(hue, 30, 8),
    foreground: hslToHex(hue, 10, 95),
  };
}

// WCAG AA contrast check (simplified)
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(hex: string): number {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;

  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function isContrastValid(fg: string, bg: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(fg, bg);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}

// Derive text color from background for contrast
export function getTextColor(backgroundColor: string): string {
  const lum = getLuminance(backgroundColor);
  return lum > 0.5 ? '#0c1222' : '#ffffff';
}