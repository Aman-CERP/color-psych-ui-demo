import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional single recovery action (button/link). */
  action?: ReactNode;
}

/**
 * Empty state — mirrors the dashed-border pattern already used in
 * FeedbackSection, generalised for reuse (no data, no results, first run).
 */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="py-10 px-6 text-center border border-dashed border-[var(--border)] rounded-2xl">
      {Icon && <Icon className="mx-auto w-8 h-8 mb-3 opacity-40" aria-hidden />}
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
