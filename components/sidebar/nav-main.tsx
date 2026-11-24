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
}: {
  item: TNavItem;
  active: boolean;
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
            {subItems.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild>
                  <Link href={subItem.url}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ items }: { items: TNavItem[] }) {
  const pathname = usePathname();

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
            <NavCollapsibleItem key={item.title} item={item} active={active} />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
