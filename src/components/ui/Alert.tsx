import type { ReactNode } from 'react';
import {
  X,
  Info,
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
  Bell,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { Tone } from './tone';

const TONE_ICON: Record<Tone, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: OctagonAlert,
  neutral: Bell,
  accent: Sparkles,
};

export interface AlertProps {
  tone?: Tone;
  title: string;
  /** Short message — keep to 1–2 sentences (USWDS / Carbon guidance). */
  children?: ReactNode;
  variant?: 'soft' | 'prominent';
  /** Override the default tone icon, or pass `null` to hide it. */
  icon?: LucideIcon | null;
  /** A single action — more than one dilutes intent (USWDS). */
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
  /**
   * Announce assertively (role="alert", interrupts the screen reader). Defaults
   * to true only for `danger` — research says reserve assertive for genuinely
   * urgent messages and let everything else announce politely (role="status").
   */
  assertive?: boolean;
}

export function Alert({
  tone = 'info',
  title,
  children,
  variant = 'soft',
  icon,
  action,
  onDismiss,
  assertive,
}: AlertProps) {
  const Icon = icon === null ? null : (icon ?? TONE_ICON[tone]);
  const isAssertive = assertive ?? tone === 'danger';

  return (
    <div
      className={`alert tone-${tone}${variant === 'prominent' ? ' alert--prominent' : ''}`}
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? 'assertive' : 'polite'}
    >
      {Icon && <Icon className="alert-icon" size={18} aria-hidden />}
      <div className="alert-content">
        <p className="alert-title">{title}</p>
        {children && <div className="alert-message">{children}</div>}
        {action && (
          <div className="alert-actions">
            <button type="button" className="alert-action" onClick={action.onClick}>
              {action.label}
            </button>
          </div>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="alert-dismiss"
          onClick={onDismiss}
          aria-label={`Dismiss: ${title}`}
        >
          <X size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
