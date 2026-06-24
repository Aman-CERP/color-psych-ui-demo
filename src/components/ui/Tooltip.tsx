import { useId, useState, type ReactNode } from 'react';

export interface TooltipProps {
  /** Tooltip text. The trigger is linked via aria-describedby. */
  label: string;
  /** Trigger content — should be focusable (a button or link) for keyboard use. */
  children: ReactNode;
}

/**
 * Accessible tooltip: opens on hover *and* focus, closes on blur/leave/Escape,
 * and is exposed to assistive tech via role="tooltip" + aria-describedby.
 */
export function Tooltip({ label, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="tooltip-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      <span role="tooltip" id={id} className={`tooltip-bubble${open ? ' visible' : ''}`}>
        {label}
      </span>
    </span>
  );
}
