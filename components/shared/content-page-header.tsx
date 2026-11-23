import type { ReactNode } from "react";

export function ContentPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 space-y-4 border-b border-border pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <p className="flex items-center gap-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-accent">
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
            {eyebrow}
          </p>
          <h1 className="title-satu text-text-primary">{title}</h1>
          <p className="body text-text-secondary">{description}</p>
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </div>
    </header>
  );
}
