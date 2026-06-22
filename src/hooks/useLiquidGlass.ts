import { useCallback, useEffect, useState } from 'react';
import { readString, writeString } from '../utils/storage';

const STORAGE_KEY = 'liquid-glass';

export function useLiquidGlass() {
  const [isLiquidGlass, setIsLiquidGlass] = useState<boolean>(() => {
    const saved = readString(STORAGE_KEY);
    if (saved === 'on') return true;
    if (saved === 'off') return false;
    return window.matchMedia('(prefers-reduced-transparency: reduce)').matches ? false : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('liquid-glass', isLiquidGlass);
    writeString(STORAGE_KEY, isLiquidGlass ? 'on' : 'off');
  }, [isLiquidGlass]);

  const toggleLiquidGlass = useCallback(() => setIsLiquidGlass((v) => !v), []);

  return { isLiquidGlass, setIsLiquidGlass, toggleLiquidGlass };
}