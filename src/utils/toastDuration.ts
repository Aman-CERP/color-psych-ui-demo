/**
 * Toast auto-dismiss policy.
 *
 * Grounded in 2025 toast UX research (LogRocket, Smashing Magazine):
 *  - Reading speed is ~500 ms/word; give a ~1 s buffer on top.
 *  - Floor everything at 5 s so even a two-word toast can be read.
 *  - NEVER auto-dismiss a toast that carries an action or long-form content —
 *    the user can't act on something that has already vanished.
 *
 * This is the single knob that decides "how long does feedback linger" — tune
 * the constants here to make the whole app feel snappier or more patient.
 *
 * @param message  The toast's primary text.
 * @param hasAction Whether the toast has a button the user might click.
 * @returns Duration in ms, or `Infinity` for persistent (manual-dismiss) toasts.
 */
export function getToastDuration(message: string, hasAction = false): number {
  if (hasAction || message.length > 140) return Infinity;
  const words = message.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(5000, words * 500 + 1000);
}
