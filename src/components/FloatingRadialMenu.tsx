import { useCallback, useMemo, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Moon,
  Orbit,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';

import type { PaletteDefinition, PaletteKey } from '../types';
import { palettes, paletteKeys, TOP_RATED_PALETTES } from '../data';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface FloatingRadialMenuProps {
  currentKey: PaletteKey;
  palette: PaletteDefinition;
  isDark: boolean;
  isLiquidGlass: boolean;
  quickPaletteKeys: PaletteKey[];
  onSelectPalette: (key: PaletteKey, silent?: boolean) => void;
  onToggleTheme: () => void;
  onToggleLiquidGlass: () => void;
}

export function FloatingRadialMenu({
  currentKey,
  palette,
  isDark,
  isLiquidGlass,
  quickPaletteKeys,
  onSelectPalette,
  onToggleTheme,
  onToggleLiquidGlass,
}: FloatingRadialMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => setIsOpen(false), []);

  useEscapeKey(close, isOpen);
  useFocusTrap(panelRef, isOpen);

  const reelKeys = useMemo(() => {
    const merged = [...new Set([currentKey, ...quickPaletteKeys, ...TOP_RATED_PALETTES])];
    return merged.slice(0, 8);
  }, [currentKey, quickPaletteKeys]);

  const paletteIndex = paletteKeys.indexOf(currentKey) + 1;

  const cyclePalette = useCallback(
    (direction: -1 | 1) => {
      const idx = paletteKeys.indexOf(currentKey);
      const next = paletteKeys[(idx + direction + paletteKeys.length) % paletteKeys.length];
      onSelectPalette(next, true);
    },
    [currentKey, onSelectPalette],
  );

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 340, damping: 30, mass: 0.92 };

  const accent = isDark ? palette.dark['--accent'] : palette.light['--accent'];
  const accentLight = isDark ? palette.dark['--accent-light'] : palette.light['--accent-light'];
  const modeLabel = isDark ? 'DARK' : 'LIGHT';

  const cssVars = {
    '--nexus-accent': accent,
    '--nexus-accent-light': accentLight,
  } as CSSProperties;

  return (
    <div className="nexus-root" data-open={isOpen || undefined} style={cssVars}>
      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            className="nexus-scrim"
            aria-label="Close spectral studio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="hud"
            ref={panelRef}
            className="nexus-hud"
            role="dialog"
            aria-modal="true"
            aria-label="Spectral studio controls"
            initial={{ opacity: 0, scale: 0.88, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.92, y: 20, filter: 'blur(4px)' }}
            transition={spring}
          >
            <div className="nexus-hud-aura" aria-hidden />
            <div className="nexus-hud-grid" aria-hidden />
            <div className="nexus-orbit nexus-orbit--outer" aria-hidden />
            <div className="nexus-orbit nexus-orbit--inner" aria-hidden />

            <header className="nexus-hud-header">
              <div className="nexus-hud-brand">
                <Orbit className="w-4 h-4 accent-text" aria-hidden />
                <span className="nexus-hud-eyebrow">Spectral Studio</span>
              </div>
              <div className="nexus-hud-telemetry" aria-live="polite">
                <span className="nexus-hud-code">
                  {String(paletteIndex).padStart(2, '0')}/{paletteKeys.length}
                </span>
                <span className="nexus-hud-mode">{modeLabel}</span>
                {isLiquidGlass && <span className="nexus-hud-glass">GLASS</span>}
              </div>
              <button type="button" className="nexus-hud-close" onClick={close} aria-label="Close">
                <X className="w-5 h-5" strokeWidth={2.25} />
              </button>
            </header>

            <div className="nexus-hud-active">
              <span
                className="nexus-hud-active-orb"
                style={{
                  background: `conic-gradient(from 220deg, ${palette.light['--accent']}, ${palette.dark['--accent']}, ${accentLight}, ${palette.light['--accent']})`,
                }}
                aria-hidden
              />
              <div className="min-w-0">
                <div className="nexus-hud-active-name">{palette.name}</div>
                <div className="nexus-hud-active-meta">
                  {modeLabel} spectrum · {isLiquidGlass ? 'Liquid Glass active' : 'Solid surfaces'}
                </div>
              </div>
            </div>

            <div className="nexus-reel-wrap">
              <div className="nexus-reel-label">
                <Sparkles className="w-3.5 h-3.5 accent-text" aria-hidden />
                <span>Quick spectrum reel</span>
              </div>
              <div className="nexus-reel" role="listbox" aria-label="Quick palette selection">
                {reelKeys.map((key) => {
                  const pal = palettes[key];
                  const active = key === currentKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="option"
                      aria-selected={active}
                      title={pal.name}
                      onClick={() => onSelectPalette(key, true)}
                      className={`nexus-reel-item ${active ? 'active' : ''}`}
                    >
                      <span
                        className="nexus-reel-orb"
                        style={{
                          background: `linear-gradient(145deg, ${pal.light['--accent']} 42%, ${pal.dark['--accent']} 100%)`,
                        }}
                      />
                      <span className="nexus-reel-name">{pal.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="nexus-command-bar" role="toolbar" aria-label="Studio commands">
              <button
                type="button"
                className="nexus-command"
                onClick={() => cyclePalette(-1)}
                aria-label="Previous palette"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                className="nexus-command"
                onClick={onToggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
              <button
                type="button"
                className={`nexus-command ${isLiquidGlass ? 'active' : ''}`}
                onClick={onToggleLiquidGlass}
                aria-label={isLiquidGlass ? 'Disable Liquid Glass' : 'Enable Liquid Glass'}
                aria-pressed={isLiquidGlass}
              >
                <Droplets className="w-5 h-5" />
                <span>Glass</span>
              </button>
              <button
                type="button"
                className="nexus-command"
                onClick={() => cyclePalette(1)}
                aria-label="Next palette"
              >
                <ChevronRight className="w-5 h-5" />
                <span>Next</span>
              </button>
            </div>

            <a href="#palettes" className="nexus-hud-link" onClick={close}>
              Browse full palette archive ({paletteKeys.length}) →
            </a>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            type="button"
            className="nexus-trigger"
            aria-haspopup="dialog"
            aria-expanded={false}
            aria-label="Open spectral studio"
            onClick={() => setIsOpen(true)}
            whileTap={reduceMotion ? undefined : { scale: 0.93 }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={spring}
          >
            <span className="nexus-trigger-orbit nexus-trigger-orbit--3" aria-hidden />
            <span className="nexus-trigger-orbit nexus-trigger-orbit--2" aria-hidden />
            <span className="nexus-trigger-orbit nexus-trigger-orbit--1" aria-hidden />
            <span className="nexus-trigger-core">
              <span
                className="nexus-trigger-orb"
                style={{
                  background: `conic-gradient(from 210deg, ${palette.light['--accent']}, ${palette.dark['--accent']}, ${accentLight}, ${palette.light['--accent']})`,
                }}
              />
            </span>
            <span className="nexus-trigger-label" aria-hidden>
              Studio
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}