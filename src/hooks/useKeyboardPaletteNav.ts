import { useEffect } from 'react';
import type { PaletteKey } from '../types';
import { paletteKeys } from '../data';

export function useKeyboardPaletteNav(
  currentKey: PaletteKey,
  onChange: (key: PaletteKey) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      const idx = paletteKeys.indexOf(currentKey);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        onChange(paletteKeys[(idx + 1) % paletteKeys.length]);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        onChange(paletteKeys[(idx - 1 + paletteKeys.length) % paletteKeys.length]);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentKey, onChange, enabled]);
}