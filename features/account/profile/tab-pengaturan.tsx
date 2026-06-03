"use client";

import type { TgetProfileUser } from "@/server/data/users";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconUser,
  IconMail,
  IconMoon,
  IconBell,
  IconBellRinging,
  IconLanguage,
  IconChevronRight,
  IconMessage,
  IconInfoCircle,
  IconLogout,
  IconDownload,
} from "@tabler/icons-react";
import { usePWAInstallTourContext } from "@/hooks/pwa-install-tour-context";
import { cn } from "@/lib/utils";

type Props = {
  user: NonNullable<TgetProfileUser>;
};

const GroupHeader = ({ title }: { title: string }) => (
  <h3 className="text-xs text-text-disabled uppercase tracking-wider font-medium px-1 mb-2">
    {title}
  </h3>
);

const iconWrap =
  "flex items-center justify-center p-2 rounded-lg shrink-0 bg-surface-hover text-text-primary";

const destructiveIconWrap =
  "flex items-center justify-center p-2 rounded-lg shrink-0 bg-destructive-subtle text-destructive";

const SettingRow = ({
  icon,
  label,
  subtitle,
  control,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  control: React.ReactNode;
}) => (
  <div className="flex items-center justify-between py-3 px-4 border-b border-border last:border-b-0">
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className={iconWrap}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-text-primary font-medium">{label}</p>
        {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
      </div>
    </div>
    <div className="shrink-0">{control}</div>
  </div>
);

const ClickRow = ({
  icon,
  label,
  subtitle,
  value,
  href,
  onClick,
  destructive,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  value?: string;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
}) => {
  const isActionable = Boolean(href || onClick);
  const content = (
    <div
      className={cn(
        "flex items-center justify-between py-3 px-4 border-b border-border last:border-b-0 transition-colors",
        isActionable && "cursor-pointer hover:bg-surface-hover",
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={destructive ? destructiveIconWrap : iconWrap}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-text-primary font-medium">{label}</p>
          {subtitle && (
            <p className="text-xs text-text-secondary">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {value && <span className="text-xs text-text-disabled">{value}</span>}
        {isActionable && (
          <IconChevronRight className="size-4 text-text-disabled" />
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }
  return content;
};

export const TabPengaturan = ({ user }: Props) => {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { replayTour } = usePWAInstallTourContext();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.refresh(),
      },
    });
  };

  return (
    <div className="mt-4 flex flex-col gap-6">
      <div>
        <GroupHeader title="Akun" />
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <ClickRow
            icon={<IconUser className="size-4.5" />}
            label="Edit profil"
            href="/home/profile/update"
          />
          <ClickRow
            icon={<IconMail className="size-4.5" />}
            label="Email"
            value={user.email || ""}
          />
        </div>
      </div>

      <div>
        <GroupHeader title="Preferensi" />
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <SettingRow
            icon={<IconMoon className="size-4.5" />}
            label="Mode gelap"
            control={
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                className="data-checked:bg-text-primary data-checked:border-text-primary"
              />
            }
          />
          <SettingRow
            icon={<IconBell className="size-4.5" />}
            label="Notifikasi push"
            subtitle="Segera hadir"
            control={
              <Switch
                disabled
                className="data-checked:bg-text-primary data-checked:border-text-primary"
              />
            }
          />
          <SettingRow
            icon={<IconBellRinging className="size-4.5" />}
            label="Notifikasi email"
            subtitle="Segera hadir"
            control={
              <Switch
                disabled
                className="data-checked:bg-text-primary data-checked:border-text-primary"
              />
            }
          />
          <ClickRow
            icon={<IconLanguage className="size-4.5" />}
            label="Bahasa"
            value="Indonesia"
            onClick={() => toast.info("Segera hadir")}
          />
        </div>
      </div>

      <div>
        <GroupHeader title="Lainnya" />
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <ClickRow
            icon={<IconMessage className="size-4.5" />}
            label="Umpan balik"
            onClick={() => toast.info("Segera hadir")}
          />
          <ClickRow
            icon={<IconInfoCircle className="size-4.5" />}
            label="Tentang aplikasi"
            value="Versi 1.2.0"
            onClick={() => toast.info("Segera hadir")}
          />
          <ClickRow
            icon={<IconDownload className="size-4.5" />}
            label="Cara Install Aplikasi"
            onClick={replayTour}
          />
        </div>
      </div>

      <div>
        <GroupHeader title="Sesi" />
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <ClickRow
            icon={<IconLogout className="size-4.5" />}
            label="Logout"
            subtitle="Keluar dari akun"
            onClick={handleLogout}
            destructive
          />
        </div>
      </div>
    </div>
  );
};
