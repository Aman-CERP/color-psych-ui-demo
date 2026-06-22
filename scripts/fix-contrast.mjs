#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const palettesPath = join(__dirname, '../src/data/palettes.ts');

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function adjustTowardContrast(fg, bg, target) {
  let [r, g, b] = hexToRgb(fg);
  const bgLum = relativeLuminance(bg);
  const step = bgLum > 0.5 ? -3 : 3;

  for (let i = 0; i < 100; i++) {
    const current = rgbToHex([r, g, b]);
    if (contrastRatio(current, bg) >= target) return current;
    r = Math.max(0, Math.min(255, r + step));
    g = Math.max(0, Math.min(255, g + step));
    b = Math.max(0, Math.min(255, b + step));
  }
  return rgbToHex([r, g, b]);
}

const TOKEN_PAIRS = [
  { fg: '--text-muted', bg: '--bg', minRatio: 4.5 },
  { fg: '--text-muted', bg: '--surface', minRatio: 4.5 },
  { fg: '--accent', bg: '--surface', minRatio: 3 },
  { fg: '--accent-foreground', bg: '--accent', minRatio: 4.5, adjustAccent: true },
];

const src = readFileSync(palettesPath, 'utf8');
const match = src.match(/export const palettes[^=]*=\s*(\{[\s\S]*\});?\s*$/);
const palettes = Function(`"use strict"; return (${match[1]});`)();

let fixCount = 0;

for (const palette of Object.values(palettes)) {
  for (const mode of ['light', 'dark']) {
    const vars = palette[mode];
    for (const { fg, bg, minRatio, adjustAccent } of TOKEN_PAIRS) {
      const foreground = vars[fg];
      const background = vars[bg];
      if (!foreground || !background) continue;
      if (contrastRatio(foreground, background) < minRatio) {
        if (fg === '--accent-foreground') {
          const candidates = [
            '#ffffff', '#f8fafc', '#f0fdfa',
            '#0f172a', '#1c1917', '#052e16', '#431407', '#2a2000', '#0a1628',
          ];
          let fixed = false;
          for (const candidate of candidates) {
            if (contrastRatio(candidate, background) >= minRatio) {
              vars[fg] = candidate;
              fixCount++;
              fixed = true;
              break;
            }
          }
          if (!fixed && adjustAccent) {
            vars[bg] = adjustTowardContrast(background, foreground, minRatio + 0.02);
            fixCount++;
            for (const candidate of candidates) {
              if (contrastRatio(candidate, vars[bg]) >= minRatio) {
                vars[fg] = candidate;
                break;
              }
            }
          } else if (!fixed) {
            vars[fg] = adjustTowardContrast(foreground, background, minRatio + 0.02);
            fixCount++;
          }
        } else {
          vars[fg] = adjustTowardContrast(foreground, background, minRatio + 0.02);
          fixCount++;
        }
      }
    }
  }
}

function quoteKey(key) {
  return key.startsWith('--') ? `'${key}'` : key;
}

function toTsValue(value) {
  return JSON.stringify(value);
}

function toTs(obj, indent = 1) {
  const pad = '  '.repeat(indent);
  const entries = Object.entries(obj)
    .map(([k, v]) => {
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        return `${pad}${quoteKey(k)}: ${toTs(v, indent + 1)}`;
      }
      return `${pad}${quoteKey(k)}: ${toTsValue(v)}`;
    })
    .join(',\n');
  return `{\n${entries}\n${'  '.repeat(indent - 1)}}`;
}

writeFileSync(
  palettesPath,
  `import type { PaletteDefinition, PaletteKey } from '../types';

export const palettes: Record<PaletteKey, PaletteDefinition> = ${toTs(palettes)};
`,
);

console.log(`Fixed ${fixCount} token(s).`);