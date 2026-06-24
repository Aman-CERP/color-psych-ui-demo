import type { CSSProperties } from 'react';
import { TONE_FILL, type Tone } from './tone';

export interface ProgressProps {
  /** 0–100. Omit for an indeterminate bar (unknown duration). */
  value?: number;
  tone?: Tone;
  /** Accessible label (required — a bare progressbar is unlabelled). */
  label: string;
}

/**
 * Progress indicator. Determinate when `value` is given, else indeterminate.
 * Indeterminate bars reduce uncertainty ("processing, not frozen") — a 2026
 * calm-UI staple — and collapse to a static fill under reduced-motion.
 */
export function Progress({ value, tone = 'accent', label }: ProgressProps) {
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.max(0, Math.min(100, value));

  return (
    <div
      className="progress-track"
      style={{ ['--tone']: TONE_FILL[tone] } as CSSProperties}
      role="progressbar"
      aria-label={label}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : 100}
      aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
    >
      <div
        className={`progress-bar${indeterminate ? ' progress-bar--indeterminate' : ''}`}
        style={indeterminate ? undefined : { width: `${clamped}%` }}
      />
    </div>
  );
}
