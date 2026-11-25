import { IconArrowLeft } from "@tabler/icons-react";
import type { ReactNode } from "react";
import Link from "next/link";

type TAdminManagementShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminManagementShell({
  title,
  description,
  children,
}: TAdminManagementShellProps) {
  return (
    <div className="flex flex-col space-y-6 pb-24 pt-2">
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <IconArrowLeft className="size-4" aria-hidden />
          Kembali ke dashboard
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-text-primary">{title}</h1>
          <p className="body text-text-secondary">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
