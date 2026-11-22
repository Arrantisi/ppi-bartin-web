"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Icon,
  IconBell,
  IconCalendarWeek,
  IconNews,
  IconSmartHome,
  IconUser,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfileUser } from "@/hooks/use-users";
import { cn } from "@/lib/utils";

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

const isNavItemActive = (pathname: string, item: NavItem) =>
  pathname === item.url ||
  (item.url !== "/home" && pathname.startsWith(`${item.url}/`));

const BottomNav = ({ show, items }: { show: boolean; items: NavItem[] }) => {
  const pathname = usePathname();

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
        {items.map((item) => {
          const isActive = isNavItemActive(pathname, item);

          return (
            <Link
              href={item.url}
              key={item.title}
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
                <item.icon className="size-5.5 stroke-[1.75]" aria-hidden />
              </motion.div>

              <motion.span className="relative z-10 text-[10px] font-medium tracking-wide">
                {item.title}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const HomeTopbar = ({ show, items }: { show: boolean; items: NavItem[] }) => {
  const pathname = usePathname();
  const { data: profile } = useProfileUser();
  const displayName = profile?.name || profile?.username || "Pengguna";
  const initials = displayName.slice(0, 2).toUpperCase();

  if (!show) return null;

  return (
    <header className="sticky top-0 z-40 hidden w-full bg-transparent md:block">
      <div className="relative flex h-16 w-full items-center justify-between px-4 md:px-6">
        <Link
          href="/home"
          aria-label="PPI Bartın — Beranda"
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Image
            src="/logo-ppi.png"
            alt=""
            width={28}
            height={28}
            className="size-7"
          />
          <span className="title-tiga hidden whitespace-nowrap lg:inline">
            PPI Bartın
          </span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-border bg-surface/90 p-1 shadow-lg shadow-black/5 backdrop-blur-lg"
        >
          {items.map((item) => {
            const isActive = isNavItemActive(pathname, item);

            return (
              <Link
                key={item.title}
                href={item.url}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring lg:px-3.5",
                  isActive
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="home-topbar-active"
                    className="absolute inset-0 rounded-full border border-border bg-surface-active"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon
                  className="relative z-10 size-4.5 stroke-[1.75]"
                  aria-hidden
                />
                <span className="relative z-10 whitespace-nowrap">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Notifikasi"
            className="flex size-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring"
          >
            <IconBell className="size-5" aria-hidden />
          </button>
          <Link
            href="/home/profile"
            aria-label={`Profil ${displayName}`}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Avatar className="size-7">
              <AvatarImage src={profile?.image || ""} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden max-w-24 truncate text-sm font-medium text-text-primary lg:inline">
              {displayName}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

const NavMainEvent = ({ show = true }: { show?: boolean }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <BottomNav show={show} items={navItems} />;
  }

  return <HomeTopbar show={show} items={navItems} />;
};

export default NavMainEvent;
