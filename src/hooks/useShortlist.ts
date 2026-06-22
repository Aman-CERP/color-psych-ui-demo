import { useCallback, useState } from 'react';
import type { PaletteKey } from '../types';

const STORAGE_KEY = 'paletteShortlist';

export function useShortlist() {
  const [shortlist, setShortlist] = useState<PaletteKey[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const persist = useCallback((next: PaletteKey[]) => {
    setShortlist(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggleShortlist = useCallback(
    (key: PaletteKey) => {
      persist(
        shortlist.includes(key)
          ? shortlist.filter((k) => k !== key)
          : shortlist.length < 5
            ? [...shortlist, key]
            : shortlist,
      );
    },
    [shortlist, persist],
  );

  const clearShortlist = useCallback(() => persist([]), [persist]);

  return { shortlist, toggleShortlist, clearShortlist, isShortlisted: (key: PaletteKey) => shortlist.includes(key) };
}