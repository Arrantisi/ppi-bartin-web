import type { ReactNode } from "react";
import Link from "next/link";
import { IconArrowLeft, IconInfoCircle } from "@tabler/icons-react";

export function ContentFormShell({
  eyebrow,
  title,
  description,
  backHref,
  tips,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  backHref: string;
  tips?: string[];
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-full text-[0.8125rem] text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring"
        >
          <IconArrowLeft className="size-4" aria-hidden />
          Kembali
        </Link>

        <div className="mt-4 space-y-2">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-accent">
            {eyebrow}
          </p>
          <h1 className="title-satu text-text-primary">{title}</h1>
          <p className="body text-text-secondary">{description}</p>
        </div>

        {tips && tips.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2 text-text-primary">
              <IconInfoCircle className="size-4 text-accent" aria-hidden />
              <p className="body font-medium">Tips</p>
            </div>
            <ul className="mt-3 space-y-2">
              {tips.map((tip) => (
                <li
                  key={tip}
                  className="footnote flex gap-2 text-text-secondary"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-text-disabled"
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <div className="min-w-0 rounded-3xl border border-border bg-surface p-5 md:p-8">
        {children}
      </div>
    </div>
  );
}
