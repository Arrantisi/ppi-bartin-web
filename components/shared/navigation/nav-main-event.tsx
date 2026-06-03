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
        // LAYOUT & POSITIONING: Melayang (floating) dengan margin samping, bukan w-full penuh
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50",
        "bg-surface/70 backdrop-blur-lg border border-white/10 shadow-lg shadow-black/5",
        "rounded-full h-16 flex items-center justify-center",
        !show && "hidden",
      )}
    >
      <div className="flex items-stretch justify-center px-1 gap-1 w-full h-full">
        {navItems.map((e) => {
          const isActive = e.url === params;

          return (
            <Link
              href={e.url}
              key={e.title}
              className={cn(
                "relative flex flex-1 flex-col justify-center items-center gap-1 py-1 text-text-disabled transition-colors duration-200 tap-highlight-transparent",
                isActive && "text-text-primary",
              )}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-bg"
                    className="absolute inset-x-1 inset-y-1.5 rounded-full border border-border/40 bg-surface-hover/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                animate={isActive ? { y: -1, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="relative z-10"
              >
                <e.icon className="size-5.5 stroke-[1.75]" />
              </motion.div>

              <motion.span className="relative z-10 text-[10px] font-medium tracking-wide">
                {e.title}
              </motion.span>
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
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="bg-sidebar border-r border-border"
    >
      <SidebarHeader className="my-5 border-b border-border">
        <Link href="/" className="flex items-center gap-3 mx-2">
          <Image
            src={"/logo-ppi.png"}
            alt="logo-ppi-bartin"
            height={200}
            width={200}
            className="size-7"
          />
          <span className="title-tiga">PPI Bartın</span>
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
                      "my-0.5 py-0.5 transition-colors",
                      // Warna saat TIDAK aktif
                      "text-text-disabled", 
                      // Warna saat AKTIF
                      "data-[active=true]:bg-surface-hover data-[active=true]:font-medium data-[active=true]:text-text-primary data-[active=true]:border data-[active=true]:border-border data-[active=true]:shadow-none",
                      // Warna saat HOVER
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
                        "relative z-10"
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
