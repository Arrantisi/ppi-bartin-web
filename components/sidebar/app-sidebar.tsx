"use client";

import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

import {
  IconCalendarEvent,
  IconLayoutDashboard,
  IconNews,
  IconSettings,
  IconTicket,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";
import NavUser from "./nav-user";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image
                  src="/logo-ppi-webp.webp"
                  alt="Logo PPI Bartin"
                  width={200}
                  height={200}
                  className="size-7"
                />
                <span className="text-base font-semibold">PPI Bartın</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: "Dashboard",
              url: "/dashboard",
              icon: IconLayoutDashboard,
            },
            {
              title: "Kelola Pengguna",
              url: "/dashboard/users",
              icon: IconUsers,
            },
            {
              title: "Pesan Masuk",
              url: "/dashboard/tickets",
              icon: IconTicket,
            },
            {
              title: "Kelola Acara",
              url: "/dashboard/events",
              matchPrefixes: ["/dashboard/acara"],
              icon: IconCalendarEvent,
            },
            {
              title: "Kelola Berita",
              url: "/dashboard/news",
              matchPrefixes: ["/dashboard/berita"],
              icon: IconNews,
            },
            {
              title: "Keuangan",
              url: "/dashboard/finance",
              icon: IconWallet,
            },
            {
              title: "Settings",
              url: "/dashboard/settings",
              icon: IconSettings,
            },
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
