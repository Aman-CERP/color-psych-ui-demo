import { useCallback, useEffect, useState } from 'react';
import type { PaletteKey } from '../types';
import { palettes } from '../data';

export function useTheme(initialPalette: PaletteKey = 'calm') {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [currentPaletteKey, setCurrentPaletteKey] = useState<PaletteKey>(() => {
    const saved = localStorage.getItem('palette') as PaletteKey;
    return saved && palettes[saved] ? saved : initialPalette;
  });

  const applyTheme = useCallback((dark: boolean, paletteKey: PaletteKey) => {
    const root = document.documentElement;
    const palette = palettes[paletteKey];
    const vars = dark ? palette.dark : palette.light;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    localStorage.setItem('palette', paletteKey);
  }, []);

  useEffect(() => {
    applyTheme(isDark, currentPaletteKey);
  }, [isDark, currentPaletteKey, applyTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) setIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  return {
    isDark,
    setIsDark,
    currentPaletteKey,
    setCurrentPaletteKey,
    toggleTheme,
    applyTheme,
    currentPalette: palettes[currentPaletteKey],
  };
}