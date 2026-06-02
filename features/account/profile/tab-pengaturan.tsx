"use client";

import type { TgetProfileUser } from "@/server/data/users";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconUser,
  IconLock,
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

type Props = {
  user: NonNullable<TgetProfileUser>;
};

const GroupHeader = ({ title }: { title: string }) => (
  <h3 className="text-xs text-text-disabled uppercase tracking-wider font-medium px-1 mb-2">
    {title}
  </h3>
);

const SettingRow = ({
  icon,
  iconBg,
  label,
  subtitle,
  control,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  subtitle?: string;
  control: React.ReactNode;
}) => (
  <div className="flex items-center justify-between py-3 px-4 border-b border-border last:border-b-0">
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div
        className="flex items-center justify-center size-9 rounded-lg shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
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
  iconBg,
  label,
  subtitle,
  value,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  subtitle?: string;
  value?: string;
  href?: string;
  onClick?: () => void;
}) => {
  const content = (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-surface-hover transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="flex items-center justify-center size-9 rounded-lg shrink-0"
          style={{ backgroundColor: iconBg }}
        >
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
        <IconChevronRight className="size-4 text-text-disabled" />
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
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
            icon={<IconUser className="size-4 text-white" />}
            iconBg="rgba(212,69,52,0.85)"
            label="Edit profil"
            href="/home/profile/update"
          />
          <ClickRow
            icon={<IconLock className="size-4 text-white" />}
            iconBg="rgba(59,130,246,0.85)"
            label="Ganti password"
            subtitle="Terakhir diubah 3 bulan lalu"
            href="/home/profile/update"
          />
          <ClickRow
            icon={<IconMail className="size-4 text-white" />}
            iconBg="rgba(34,197,94,0.85)"
            label="Email"
            value={user.email || ""}
          />
        </div>
      </div>

      <div>
        <GroupHeader title="Preferensi" />
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <SettingRow
            icon={<IconMoon className="size-4 text-white" />}
            iconBg="rgba(212,69,52,0.85)"
            label="Mode gelap"
            control={
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                className="data-checked:bg-(--page-accent) data-checked:border-(--page-accent)"
              />
            }
          />
          <SettingRow
            icon={<IconBell className="size-4 text-white" />}
            iconBg="rgba(59,130,246,0.85)"
            label="Notifikasi push"
            control={
              <Switch
                defaultChecked
                className="data-checked:bg-(--page-accent) data-checked:border-(--page-accent)"
              />
            }
          />
          <SettingRow
            icon={<IconBellRinging className="size-4 text-white" />}
            iconBg="rgba(34,197,94,0.85)"
            label="Notifikasi email"
            control={
              <Switch
                defaultChecked
                className="data-checked:bg-(--page-accent) data-checked:border-(--page-accent)"
              />
            }
          />
          <ClickRow
            icon={<IconLanguage className="size-4 text-white" />}
            iconBg="rgba(250,204,21,0.85)"
            label="Bahasa"
            value="Indonesia"
          />
        </div>
      </div>

      <div>
        <GroupHeader title="Lainnya" />
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <ClickRow
            icon={<IconMessage className="size-4 text-white" />}
            iconBg="rgba(107,114,128,0.85)"
            label="Umpan balik"
          />
          <ClickRow
            icon={<IconInfoCircle className="size-4 text-white" />}
            iconBg="rgba(107,114,128,0.85)"
            label="Tentang aplikasi"
            value="Versi 1.2.0"
          />
          <ClickRow
            icon={<IconDownload className="size-4 text-white" />}
            iconBg="rgba(107,114,128,0.85)"
            label="Cara Install Aplikasi"
            onClick={replayTour}
          />
        </div>
      </div>

      <div>
        <GroupHeader title="Sesi" />
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <ClickRow
            icon={<IconLogout className="size-4 text-white" />}
            iconBg="rgba(212,69,52,0.9)"
            label="Logout"
            subtitle="Keluar dari akun"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};
