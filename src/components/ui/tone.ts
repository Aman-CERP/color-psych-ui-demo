/**
 * Shared semantic-tone vocabulary for the feedback/state primitives.
 *
 * Semantic tones (info/success/warning/danger) stay palette-independent so a
 * status reads at a glance regardless of which of the 34 accents is active.
 * Only `accent` follows the live palette. Every tone is paired with a distinct
 * icon in the components — colour is never the sole signal (USWDS / WCAG 1.4.1).
 */
export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

/** CSS variable used as a *fill* (progress bar, dot) for each tone. */
export const TONE_FILL: Record<Tone, string> = {
  info: 'var(--info)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  neutral: 'var(--text-muted)',
  accent: 'var(--accent)',
};
