import type { ReactNode } from "react";

type TFinanceReportSectionProps = {
  /** Anchor untuk submenu sidebar, mis. #wajib-kas. */
  id: string;
  number: string;
  title: string;
  description?: string;
  children: ReactNode;
};

/** Pembagi blok laporan bernomor A/B/C/D mengikuti konvensi sheet bendahara. */
export function FinanceReportSection({
  id,
  number,
  title,
  description,
  children,
}: TFinanceReportSectionProps) {
  return (
    <section id={id} aria-label={title} className="scroll-mt-24 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2 border-b border-border pb-2">
        <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span aria-hidden className="font-mono text-text-disabled">
            {number}.
          </span>
          <span className="title-tiga text-text-primary">{title}</span>
          {description ? (
            <span className="footnote text-text-secondary">{description}</span>
          ) : null}
        </h2>
      </div>
      {children}
    </section>
  );
}
