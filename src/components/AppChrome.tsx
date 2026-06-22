import type { ReactNode } from 'react';

interface AppChromeProps {
  children: ReactNode;
}

/** Unified sticky chrome — one continuous glass surface for header + section nav. */
export function AppChrome({ children }: AppChromeProps) {
  return (
    <div className="chrome-shell sticky top-0 z-50 glass border-b border-[var(--border)]">
      {children}
    </div>
  );
}