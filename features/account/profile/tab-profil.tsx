"use client";

import type { TgetProfileUser } from "@/server/data/users";
import {
  IconBook2,
  IconCalendar,
  IconMail,
  IconBrandWhatsapp,
  IconBuilding,
  IconClock,
  IconMoon,
  IconChevronRight,
  IconUser,
  IconGenderBigender,
} from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useTheme } from "next-themes";
import { PushNotificationSwitch } from "@/components/push-notification-switch";
import { cn } from "@/lib/utils";

type Props = {
  user: NonNullable<TgetProfileUser>;
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0">
    <div className="flex items-center justify-center size-8 rounded-lg shrink-0 bg-surface-hover">
      <div className="text-text-primary [&_svg]:size-4">{icon}</div>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-text-disabled uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm text-text-primary font-medium truncate">
        {value || "—"}
      </p>
    </div>
  </div>
);

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <h3 className="card-title mb-2">{title}</h3>
    <div>{children}</div>
  </div>
);

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) => (
  <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-1.5 text-center">
    <div className="flex items-center justify-center size-9 rounded-lg bg-surface-hover">
      <div className="text-text-primary [&_svg]:size-4.5">{icon}</div>
    </div>
    <span className="text-xl font-bold text-text-primary">{value}</span>
    <span className="text-xs text-text-secondary">{label}</span>
  </div>
);

export const TabProfil = ({ user }: Props) => {
  const today = new Date();
  const totalKegiatan = user.participants?.length || 0;
  const tahunAktif = user.angkatan
    ? Math.max(1, today.getFullYear() - parseInt(user.angkatan) + 1)
    : 1;
  // const pastCount =
  //   user.participants?.filter((p) => new Date(p.event.date) <= today).length ||
  //   0;

  const { setTheme, theme } = useTheme();

  const gender = user.jenisKelamin === "laki-laki" ? "laki-laki" : "Wanita";

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <InfoCard title="Informasi Akademik">
          <InfoRow
            icon={<IconBuilding />}
            label="Universitas"
            value="Bartın Üniversitesi"
          />
          <InfoRow icon={<IconBook2 />} label="Jurusan" value={user.jurusan} />
          <InfoRow
            icon={<IconCalendar />}
            label="Tahun Masuk"
            value={user.angkatan}
          />
        </InfoCard>

        <InfoCard title="Kontak">
          <InfoRow icon={<IconMail />} label="Email" value={user.email} />
          <InfoRow
            icon={<IconBrandWhatsapp />}
            label="WhatsApp"
            value={user.noTelephone}
          />
        </InfoCard>
        <InfoCard title="Pengaturan Cepat">
          <div className="space-y-0">
            <Link
              href="/home/profile/update"
              className="flex items-center justify-between py-2.5 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 rounded-lg bg-surface-hover">
                  <IconUser className="size-4 text-text-primary" />
                </div>
                <span className="text-sm text-text-primary">Edit profil</span>
              </div>
              <IconChevronRight className="size-4 text-text-disabled" />
            </Link>
            <div className="flex items-center justify-between py-2.5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 rounded-lg bg-surface-hover">
                  <IconMoon className="size-4 text-text-primary" />
                </div>
                <span className="text-sm text-text-primary">Mode gelap</span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                className="data-checked:bg-text-primary data-checked:border-text-primary"
              />
            </div>
            <PushNotificationSwitch className="py-2.5" />
          </div>
        </InfoCard>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<IconBook2 />}
            value={totalKegiatan}
            label="Kegiatan diikuti"
          />
          <StatCard
            icon={<IconClock />}
            value={tahunAktif}
            label="Tahun aktif"
          />
          <StatCard
            icon={<IconGenderBigender />}
            value={gender}
            label="Jenis Kelamin"
          />
        </div>

        <InfoCard title="Riwayat Kegiatan">
          {user.participants && user.participants.length > 0 ? (
            <div className="space-y-0">
              {user.participants.map((p) => {
                const isPast = new Date(p.event.date) <= today;
                return (
                  <Link
                    href={`/home/acara/${p.event.slug}`}
                    key={p.id}
                    className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0 max-h-112.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm text-text-primary font-medium truncate",
                          isPast && "text-text-disabled",
                        )}
                      >
                        {p.event.judul}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {new Date(p.event.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-text-disabled mono">
                      {isPast ? "Selesai" : "Akan Datang"}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-text-secondary py-2">
              Belum ada kegiatan
            </p>
          )}
        </InfoCard>
      </div>
    </div>
  );
};
