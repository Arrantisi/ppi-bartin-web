"use client";

import { cn } from "@/lib/utils";
import {
  Icon,
  IconCalendarWeek,
  IconNews,
  IconSmartHome,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import Image from "next/image";

type NavItem = {
  title: string;
  icon: Icon;
  url: string;
};

const navItems: NavItem[] = [
  { title: "Beranda", icon: IconSmartHome, url: "/home" },
  { title: "Kegiatan", icon: IconCalendarWeek, url: "/home/acara" },
  { title: "Berita", icon: IconNews, url: "/home/berita" },
  { title: "Profil", icon: IconUser, url: "/home/profile" },
];

const BottomNav = ({ show }: { show: boolean }) => {
  const params = usePathname();

  return (
    <div
      className={cn(
        "fixed w-full bottom-0 left-0 flex items-center justify-center z-50 h-14 bg-surface border-t border-border",
        !show && "hidden",
      )}
    >
      <div className="max-w-xl md:max-w-2xl xl:max-w-3xl flex items-stretch justify-between px-4 gap-2 w-full">
        {navItems.map((e) => {
          const isActive = e.url === params;

          return (
            <Link
              href={e.url}
              key={e.title}
              className={cn(
                "relative flex flex-1 flex-col justify-center items-center gap-1 py-2 border-t-2 border-transparent text-text-disabled transition-colors duration-100",
                isActive && "border-accent text-text-primary",
              )}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-bg"
                    className="absolute inset-0 rounded-2xl border border-border bg-surface-active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                animate={isActive ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative z-10"
              >
                <e.icon className="size-5" />
              </motion.div>

              <motion.span className="relative z-10 text-xs">{e.title}</motion.span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const DesktopSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const params = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props} className="bg-sidebar border-r border-border">
      <SidebarHeader className="my-5 border-b border-border">
        <Link href="/home" className="flex items-center gap-3 mx-2">
          <Image
            src={"/logo-ppi.png"}
            alt="logo-ppi-bartin"
            height={200}
            width={200}
            className="size-7"
          />
          <span className="title-tiga">
            PPI Bartın
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="mx-3">
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarMenu>
          {navItems.map((e) => {
            const isActive = e.url === params;

            return (
              <SidebarMenuItem key={e.title}>
                <Link href={e.url}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={e.title}
                    className={cn(
                      "my-0.5 py-0.5",
                      "data-[active=true]:bg-surface-active data-[active=true]:font-medium data-[active=true]:text-text-primary data-[active=true]:border data-[active=true]:border-border data-[active=true]:shadow-none",
                      "hover:bg-surface-hover hover:text-text-primary",
                    )}
                  >
                    <motion.div
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                      className={cn(
                        "relative z-10",
                        isActive ? "text-text-primary" : "text-text-disabled",
                      )}
                    >
                      <e.icon className="size-4.5" />
                    </motion.div>
                    <span className="relative z-10">{e.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

const NavMainEvent = ({ show = true }: { show?: boolean }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <BottomNav show={show} />;
  }

  return <DesktopSidebar variant="sidebar" />;
};

export default NavMainEvent;