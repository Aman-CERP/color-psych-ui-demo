import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { PaletteKey } from '../types';
import { palettes } from '../data';
import { readJson, writeJson } from '../utils/storage';

const STORAGE_KEY = 'paletteShortlist';
export const MAX_SHORTLIST = 5;

/** Drop unknown/duplicate keys and cap length so corrupt or legacy data can't reach the UI. */
function sanitize(raw: unknown): PaletteKey[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const clean: PaletteKey[] = [];
  for (const k of raw) {
    if (typeof k === 'string' && Object.hasOwn(palettes, k) && !seen.has(k)) {
      seen.add(k);
      clean.push(k as PaletteKey);
      if (clean.length >= MAX_SHORTLIST) break;
    }
  }
  return clean;
}

export function useShortlist() {
  const [shortlist, setShortlist] = useState<PaletteKey[]>(() =>
    sanitize(readJson<unknown>(STORAGE_KEY, [])),
  );

  // Self-heal: write the sanitized list back so any corrupt/legacy value stops lingering.
  useEffect(() => {
    writeJson(STORAGE_KEY, shortlist);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((next: PaletteKey[]) => {
    setShortlist(next);
    writeJson(STORAGE_KEY, next);
  }, []);

  const toggleShortlist = useCallback(
    (key: PaletteKey) => {
      if (shortlist.includes(key)) {
        persist(shortlist.filter((k) => k !== key));
      } else if (shortlist.length < MAX_SHORTLIST) {
        persist([...shortlist, key]);
      } else {
        toast.error(`Shortlist is full (max ${MAX_SHORTLIST})`, {
          description: 'Remove a palette before adding another.',
        });
      }
    },
    [shortlist, persist],
  );

  const clearShortlist = useCallback(() => persist([]), [persist]);

  return { shortlist, toggleShortlist, clearShortlist, isShortlisted: (key: PaletteKey) => shortlist.includes(key) };
}