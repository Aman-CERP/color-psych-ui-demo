import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Columns2, Star, Trash2, X } from 'lucide-react';

import type { PaletteDefinition, PaletteKey } from '../types';
import { palettes } from '../data';
import { MAX_SHORTLIST } from '../hooks/useShortlist';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface FloatingShortlistStackProps {
  shortlist: PaletteKey[];
  currentKey: PaletteKey;
  palette: PaletteDefinition;
  isDark: boolean;
  onSelectPalette: (key: PaletteKey, silent?: boolean) => void;
  onToggleShortlist: (key: PaletteKey) => void;
  onCompare: () => void;
  onClear: () => void;
}

export function FloatingShortlistStack({
  shortlist,
  currentKey,
  palette,
  isDark,
  onSelectPalette,
  onToggleShortlist,
  onCompare,
  onClear,
}: FloatingShortlistStackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => setIsOpen(false), []);

  useEscapeKey(close, isOpen);
  useFocusTrap(panelRef, isOpen);

  if (shortlist.length === 0) return null;

  const accent = isDark ? palette.dark['--accent'] : palette.light['--accent'];
  const accentLight = isDark ? palette.dark['--accent-light'] : palette.light['--accent-light'];

  const cssVars = {
    '--stack-accent': accent,
    '--stack-accent-light': accentLight,
  } as CSSProperties;

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.88 };

  return (
    <div className="shortlist-stack-root" data-open={isOpen || undefined} style={cssVars}>
      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            className="shortlist-stack-scrim"
            aria-label="Close shortlist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="panel"
            ref={panelRef}
            className="shortlist-stack-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Shortlisted palettes"
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={spring}
          >
            <header className="shortlist-stack-header">
              <div className="shortlist-stack-brand">
                <Star className="w-4 h-4 accent-text fill-current" aria-hidden />
                <span className="shortlist-stack-eyebrow">Shortlist</span>
              </div>
              <span className="shortlist-stack-count" aria-live="polite">
                {shortlist.length}/{MAX_SHORTLIST}
              </span>
              <button type="button" className="shortlist-stack-close" onClick={close} aria-label="Close">
                <X className="w-4 h-4" strokeWidth={2.25} />
              </button>
            </header>

            <ul className="shortlist-stack-list">
              {shortlist.map((key, index) => {
                const pal = palettes[key];
                const active = key === currentKey;
                return (
                  <motion.li
                    key={key}
                    layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                    transition={{ ...spring, delay: reduceMotion ? 0 : index * 0.04 }}
                  >
                    <div className={`shortlist-stack-item ${active ? 'active' : ''}`}>
                      <button
                        type="button"
                        className="shortlist-stack-item-main"
                        onClick={() => {
                          onSelectPalette(key);
                          close();
                        }}
                      >
                        <span className="shortlist-stack-chip-colors" aria-hidden>
                          <span className="color-swatch" style={{ backgroundColor: pal.light['--accent'] }} />
                          <span className="color-swatch" style={{ backgroundColor: pal.dark['--accent'] }} />
                        </span>
                        <span className="shortlist-stack-item-copy">
                          <span className="shortlist-stack-item-name">{pal.name}</span>
                          <span className="shortlist-stack-item-meta">
                            {active ? 'Active preview' : 'Tap to preview'}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        className="shortlist-stack-remove"
                        onClick={() => onToggleShortlist(key)}
                        aria-label={`Remove ${pal.name} from shortlist`}
                        title="Remove from shortlist"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            <div className="shortlist-stack-actions">
              {shortlist.length >= 2 && (
                <button type="button" className="shortlist-stack-action" onClick={() => { onCompare(); close(); }}>
                  <Columns2 className="w-3.5 h-3.5" />
                  Compare
                </button>
              )}
              <button type="button" className="shortlist-stack-action shortlist-stack-action--ghost" onClick={onClear}>
                <Trash2 className="w-3.5 h-3.5" />
                Clear all
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            type="button"
            className="shortlist-stack-trigger"
            aria-haspopup="dialog"
            aria-expanded={false}
            aria-label={`Open shortlist, ${shortlist.length} of ${MAX_SHORTLIST} palettes`}
            onClick={() => setIsOpen(true)}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={spring}
          >
            <span className="shortlist-stack-deck">
              {shortlist.map((key, index) => {
                const pal = palettes[key];
                const active = key === currentKey;
                return (
                  <motion.span
                    key={key}
                    className={`shortlist-stack-chip ${active ? 'active' : ''}`}
                    layout={!reduceMotion}
                    initial={reduceMotion ? false : { opacity: 0, x: -10, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ ...spring, delay: reduceMotion ? 0 : index * 0.05 }}
                    style={{ '--stack-index': index } as CSSProperties}
                  >
                    <span className="shortlist-stack-chip-colors" aria-hidden>
                      <span className="color-swatch" style={{ backgroundColor: pal.light['--accent'] }} />
                      <span className="color-swatch" style={{ backgroundColor: pal.dark['--accent'] }} />
                    </span>
                    <span className="shortlist-stack-chip-name">{pal.name}</span>
                  </motion.span>
                );
              })}
            </span>
            <span className="shortlist-stack-badge">
              <Star className="w-3 h-3 fill-current" aria-hidden />
              <span>
                {shortlist.length}/{MAX_SHORTLIST}
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}