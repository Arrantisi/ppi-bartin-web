"use client";

import type { TgetProfileUser } from "@/server/data/users";
import {
  IconBook2,
  IconCalendar,
  IconMail,
  IconBrandWhatsapp,
  IconMapPin,
  IconBuilding,
  IconClock,
  IconPercentage,
  IconMoon,
  IconBell,
  IconLock,
  IconChevronRight,
} from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useTheme } from "next-themes";

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
    <div
      className="flex items-center justify-center size-8 rounded-lg shrink-0"
      style={{ backgroundColor: "var(--page-accent-subtle)" }}
    >
      <div className="text-(--page-accent) [&_svg]:size-4">{icon}</div>
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
    <div
      className="flex items-center justify-center size-9 rounded-lg"
      style={{ backgroundColor: "var(--page-accent-subtle)" }}
    >
      <div className="text-(--page-accent) [&_svg]:size-4.5">{icon}</div>
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
  const pastCount =
    user.participants?.filter((p) => new Date(p.event.date) <= today).length ||
    0;
  const kehadiran =
    totalKegiatan > 0 ? Math.round((pastCount / totalKegiatan) * 100) : 0;

  const { setTheme, theme } = useTheme();

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
          <InfoRow
            icon={<IconMapPin />}
            label="Asal Kota"
            value={user.alamat}
          />
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
            icon={<IconPercentage />}
            value={`${kehadiran}%`}
            label="Kehadiran"
          />
        </div>

        <InfoCard title="Riwayat Kegiatan">
          {user.participants && user.participants.length > 0 ? (
            <div className="space-y-0">
              {user.participants.map((p) => {
                const isPast = new Date(p.event.date) <= today;
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0"
                  >
                    <span
                      className={`size-2 rounded-full shrink-0 ${
                        isPast ? "bg-success" : "bg-warning"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-text-primary font-medium truncate">
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
                    <span
                      className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        isPast
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {isPast ? "Selesai" : "Akan Datang"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-text-secondary py-2">
              Belum ada kegiatan
            </p>
          )}
        </InfoCard>

        <InfoCard title="Pengaturan Cepat">
          <div className="space-y-0">
            <div className="flex items-center justify-between py-2.5 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center size-8 rounded-lg"
                  style={{ backgroundColor: "var(--page-accent-subtle)" }}
                >
                  <IconMoon className="size-4 text-(--page-accent)" />
                </div>
                <span className="text-sm text-text-primary">Mode gelap</span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                className="data-checked:bg-(--page-accent) data-checked:border-(--page-accent)"
              />
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center size-8 rounded-lg"
                  style={{ backgroundColor: "var(--page-accent-subtle)" }}
                >
                  <IconBell className="size-4 text-(--page-accent)" />
                </div>
                <span className="text-sm text-text-primary">Notifikasi</span>
              </div>
              <Switch
                defaultChecked
                className="data-checked:bg-(--page-accent) data-checked:border-(--page-accent)"
              />
            </div>
            <Link
              href="/home/profile/update"
              className="flex items-center justify-between py-2.5 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center size-8 rounded-lg"
                  style={{ backgroundColor: "var(--page-accent-subtle)" }}
                >
                  <IconLock className="size-4 text-(--page-accent)" />
                </div>
                <span className="text-sm text-text-primary group-hover:text-text-primary transition-colors">
                  Ganti password
                </span>
              </div>
              <IconChevronRight className="size-4 text-text-disabled" />
            </Link>
          </div>
        </InfoCard>
      </div>
    </div>
  );
};
