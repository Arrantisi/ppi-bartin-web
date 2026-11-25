"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type TAdminEmptyStateProps = {
  title: string;
  description?: string;
  href?: string;
  cta?: string;
};

export function AdminEmptyState({
  title,
  description,
  href,
  cta,
}: TAdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border py-10 text-center">
      <p className="body text-text-disabled">{title}</p>
      {description ? (
        <p className="footnote text-text-secondary">{description}</p>
      ) : null}
      {href && cta ? (
        <Button
          render={<Link href={href} />}
          variant="outline"
          size="sm"
        >
          {cta}
          <IconArrowUpRight aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}
