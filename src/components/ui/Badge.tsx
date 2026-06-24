import type { ReactNode } from 'react';
import type { Tone } from './tone';

export interface BadgeProps {
  tone?: Tone;
  variant?: 'soft' | 'outline';
  /** Leading status dot — useful for live/system status without an icon. */
  dot?: boolean;
  children: ReactNode;
}

/**
 * Status pill. Both variants keep tone-coloured text on a quiet ground, which
 * holds WCAG AA across every palette × mode (a solid fill with white text would
 * fail in dark mode, where the tones are light).
 */
export function Badge({ tone = 'neutral', variant = 'soft', dot = false, children }: BadgeProps) {
  return (
    <span className={`badge badge--${variant} tone-${tone}`}>
      {dot && <span className="badge-dot" aria-hidden />}
      {children}
    </span>
  );
}
