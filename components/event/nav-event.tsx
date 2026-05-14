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
import { useIsMobile } from "@/hooks/use-mobile"; // shadcn sidebar exports this
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

// ─── Bottom Nav (Mobile) ──────────────────────────────────────────────────────

const BottomNav = ({ show }: { show: boolean }) => {
  const params = usePathname();

  return (
    <div
      className={cn(
        "fixed w-full bottom-0 left-0 flex items-center justify-center z-50 bg-card shadow-2xl",
        !show && "hidden",
      )}
    >
      <div className="max-w-xl md:max-w-2xl xl:max-w-3xl flex items-center justify-between px-6 pb-4 pt-0.5 gap-[16px] w-full">
        {navItems.map((e) => {
          const isActive = e.url === params;

          return (
            <Link
              href={e.url}
              key={e.title}
              className={cn(
                "relative flex flex-col justify-center items-center p-2 w-40 m-1.5 dark:text-foreground text-foreground/40 transition-colors duration-200",
                isActive && "text-primary",
              )}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-bg"
                    className="absolute inset-0 bg-primary/20 dark:bg-primary/50 rounded-2xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                animate={isActive ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <e.icon className="size-5" />
              </motion.div>

              <motion.span className="text-xs">{e.title}</motion.span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

const DesktopSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const params = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props} className="bg-sidebar">
      <SidebarHeader className="my-5 border-b">
        <Link href="/home" className="flex items-center gap-3 mx-2">
          <Image
            src={"/logo-ppi.png"}
            alt="logo-ppi-bartin"
            height={200}
            width={200}
            className="size-7"
          />
          <span className="text-xl font-semibold tracking-tighter">
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
                      "data-[active=true]:bg-linear-to-r data-[active=true]:from-primary-100 data-[active=true]:to-sidebar data-[active=true]:font-medium data-[active=true]:text-sidebar-primary",
                      "dark:data-[active=true]:bg-linear-to-r dark:data-[active=true]:from-primary-900 dark:data-[active=true]:to-sidebar dark:data-[active=true]:font-medium dark:data-[active=true]:text-primary-300 dark:hover:bg-linear-to-r dark:hover:from-base-800 dark:hover:to-sidebar",
                      "hover:bg-linear-to-r hover:from-base-200 hover:to-background",
                    )}
                  >
                    <motion.div
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <e.icon className="size-4.5" />
                    </motion.div>
                    <span>{e.title}</span>
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

// ─── Main Export ──────────────────────────────────────────────────────────────

const NavMainEvent = ({ show = true }: { show?: boolean }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <BottomNav show={show} />;
  }

  return <DesktopSidebar variant="sidebar" />;
};

export default NavMainEvent;
