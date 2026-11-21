"use client"; // Cuma komponen ini yang client

import { usePathname } from "next/navigation";

export function DashboardTitle() {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop() || "";

  const formatTitle = (text: string) => {
    return text
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return <span>{formatTitle(lastSegment) || "Dashboard"}</span>;
}
