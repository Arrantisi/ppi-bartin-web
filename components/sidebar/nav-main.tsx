"use client";

import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type TNavItem = {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  matchPrefixes?: string[];
  items?: {
    title: string;
    url: string;
  }[];
};

/** Submenu collapse yang membuka sendiri saat halaman terkait aktif. */
function NavCollapsibleItem({
  item,
  active,
  activeHash,
  pathname,
}: {
  item: TNavItem;
  active: boolean;
  activeHash: string;
  pathname: string;
}) {
  const [open, setOpen] = React.useState(active);

  React.useEffect(() => {
    setOpen(active);
  }, [active]);

  const subItems = item.items ?? [];

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      asChild
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={active}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <IconChevronRight
              aria-hidden
              className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {subItems.map((subItem) => {
              // Hash hanya menentukan submenu aktif bila induknya memang aktif,
              // sehingga anchor finance tidak menyalahi halaman lain.
              const subActive =
                active &&
                (activeHash
                  ? subItem.url.endsWith(activeHash)
                  : subItem.url === item.url);

              // Router Next memakai pushState yang tidak memicu `hashchange`.
              // Anchor dalam halaman yang sama pakai <a> native supaya hash,
              // status submenu, dan scroll dashboard semuanya ikut berubah.
              const hashIndex = subItem.url.indexOf("#");
              const samePageAnchor =
                hashIndex !== -1 &&
                subItem.url.slice(0, hashIndex) === pathname;

              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild isActive={subActive}>
                    {samePageAnchor ? (
                      <a href={subItem.url}>
                        <span>{subItem.title}</span>
                      </a>
                    ) : (
                      <Link href={subItem.url}>
                        <span>{subItem.title}</span>
                      </Link>
                    )}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ items }: { items: TNavItem[] }) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = React.useState("");

  React.useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const isItemActive = (item: TNavItem) => {
    if (item.isActive !== undefined) return item.isActive;
    if (item.url === "/dashboard") return pathname === "/dashboard";

    return [item.url, ...(item.matchPrefixes ?? [])].some(
      (url) => pathname === url || pathname.startsWith(`${url}/`),
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = isItemActive(item);

          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton tooltip={item.title} isActive={active}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          }

          return (
            <NavCollapsibleItem
              key={item.title}
              item={item}
              active={active}
              activeHash={activeHash}
              pathname={pathname}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
