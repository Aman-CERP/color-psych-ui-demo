import type { PaletteDefinition } from '../types';

const SECTIONS = [
  { id: 'lab', label: 'Color Lab' },
  { id: 'palettes', label: 'Palettes' },
  { id: 'insights', label: 'Scores' },
  { id: 'chart', label: 'Chart' },
  { id: 'contribute', label: 'Contribute' },
] as const;

interface SectionNavProps {
  palette: PaletteDefinition;
  isDark: boolean;
}

export function SectionNav({ palette, isDark }: SectionNavProps) {
  const modeLabel = isDark ? 'Dark' : 'Light';

  return (
    <nav aria-label="Page sections" className="border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 py-2.5">
        <ul className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 min-w-0">
          {SECTIONS.map(({ id, label }) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                className="block px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors whitespace-nowrap"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div
          className="scheme-indicator shrink-0 flex items-center gap-2.5 pl-3 border-l border-[var(--border)]"
          aria-label={`Active palette: ${palette.name}, ${modeLabel} mode`}
          title={`${palette.name} · ${modeLabel} mode`}
        >
          <div className="flex items-center -space-x-1" aria-hidden>
            <div
              className="color-swatch ring-2 ring-[var(--surface)]"
              style={{ backgroundColor: palette.light['--accent'] }}
            />
            <div
              className="color-swatch ring-2 ring-[var(--surface)]"
              style={{ backgroundColor: palette.dark['--accent'] }}
            />
          </div>
          <div className="hidden sm:block min-w-0 text-right leading-tight">
            <div className="text-xs font-medium text-[var(--text)] truncate max-w-[10rem] lg:max-w-[14rem]">
              {palette.name}
            </div>
            <div className="type-caption">{modeLabel} mode</div>
          </div>
        </div>
      </div>
    </nav>
  );
}