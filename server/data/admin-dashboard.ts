import { cache } from "react";

import { prisma } from "@/lib/db";
import type { Prisma, Role } from "@/lib/generated/prisma/client";
import { adminDetailIdSchema } from "@/schemas/admin-dashboard";
import { getCurrentUserRole } from "@/server/actions/account";
import type {
  TAdminCapacityItem,
  TAdminDashboardAccessScope,
  TAdminDashboardSnapshot,
  TAdminEventDetail,
  TAdminEventRow,
  TAdminNewsDetail,
  TAdminNewsRow,
  TAdminTablePage,
  TAdminUserDetail,
  TAdminUserRow,
  TDashboardDistributionItem,
} from "@/types/admin-dashboard";
import {
  buildDailyTrend,
  getMissingProfileFields,
  toPercent,
} from "@/utils/admin-dashboard";

const ADMIN_ROLES = new Set(["ADMIN"]);
const ADMIN_TABLE_PAGE_SIZE = 10;
const ALL_ENVIRONMENTS = ["local", "preview", "production"];
const ALL_ROLES = ["USER", "ADMIN", "PENGURUS", "BENDAHARA"];

const getAccessScope = async (): Promise<{
  scope: TAdminDashboardAccessScope;
  environments: string[];
}> => ({
  scope: "all",
  environments: ALL_ENVIRONMENTS,
});

const authorizeAdminRead = async (): Promise<void> => {
  const role = await getCurrentUserRole();
  if (!ADMIN_ROLES.has(role)) throw new Error("Forbidden");
};

const normalizePage = (page: number): number =>
  Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;

const normalizeFilter = (value: string, options: string[]): string =>
  options.includes(value) ? value : "ALL";

const contains = (value: string) => ({
  contains: value,
  mode: "insensitive" as const,
});

const emptyProfileWhere = {
  OR: [
    { noTelephone: null },
    { noTelephone: "" },
    { nomorSiswa: null },
    { nomorSiswa: "" },
    { angkatan: null },
    { angkatan: "" },
    { jurusan: null },
    { jurusan: "" },
    { fakultas: null },
    { fakultas: "" },
  ],
};

const toDistribution = (
  rows: Array<{ label: string | null; value: number }>,
): TDashboardDistributionItem[] =>
  rows
    .map((row) => ({
      label: row.label?.trim() || "Belum diisi",
      value: row.value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

const toCapacityItem = (event: {
  id: string;
  judul: string;
  date: Date;
  batasDaftar: Date;
  maxCapacity: number;
  _count: { participants: number };
}): TAdminCapacityItem => ({
  id: event.id,
  title: event.judul,
  date: event.date.toISOString(),
  joined: event._count.participants,
  capacity: event.maxCapacity,
  percent: toPercent(event._count.participants, event.maxCapacity),
});

/**
 * Satu snapshot agregat untuk halaman /dashboard.
 * `cache()` mencegah query duplikat bila dipanggil beberapa kali dalam satu request.
 * Role dicek ulang di sini agar data tidak bocor walau dipanggil langsung.
 */
export const getAdminDashboardSnapshot = cache(
  async (): Promise<TAdminDashboardSnapshot> => {
    await authorizeAdminRead();

    const { scope, environments } = await getAccessScope();

    const now = new Date();
    const since30Days = new Date(now);
    since30Days.setDate(since30Days.getDate() - 30);
    const since14Days = new Date(now);
    since14Days.setDate(since14Days.getDate() - 13);
    const until30Days = new Date(now);
    until30Days.setDate(until30Days.getDate() + 30);
    const unverifiedBefore = new Date(now);
    unverifiedBefore.setDate(unverifiedBefore.getDate() - 7);
    const previewEnvironments = environments.filter(
      (environment) => environment !== "production",
    );

    const [
      totalUsers,
      verifiedUsers,
      newUsers30d,
      bannedUsers,
      incompleteCount,
      roleGroups,
      angkatanGroups,
      fakultasGroups,
      genderGroups,
      unverifiedRows,
      incompleteRows,
      expiringBanRows,
      recentUsers,
      recentParticipants,
      eventRows,
      activeEvents,
      upcomingEvents,
      totalParticipants,
      cancelCount,
      publishedNews,
      previewNews,
      pendingNewsRows,
      openTickets,
      unreadTickets,
      resolvedRows,
      ticketGroups,
      unreadRows,
      pushSubscribers,
      activeSessions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.count({ where: { createdAt: { gte: since30Days } } }),
      prisma.user.count({ where: { banned: true } }),
      prisma.user.count({ where: emptyProfileWhere }),
      prisma.user.groupBy({
        by: ["role"],
        _count: { _all: true },
      }),
      prisma.user.groupBy({
        by: ["angkatan"],
        _count: { _all: true },
      }),
      prisma.user.groupBy({
        by: ["fakultas"],
        _count: { _all: true },
      }),
      prisma.user.groupBy({
        by: ["jenisKelamin"],
        _count: { _all: true },
      }),
      prisma.user.findMany({
        where: {
          emailVerified: false,
          createdAt: { lte: unverifiedBefore },
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
        take: 5,
      }),
      prisma.user.findMany({
        where: emptyProfileWhere,
        select: {
          id: true,
          name: true,
          noTelephone: true,
          nomorSiswa: true,
          angkatan: true,
          jurusan: true,
          fakultas: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.user.findMany({
        where: {
          banned: true,
          banExpires: { not: null, gte: now, lte: until30Days },
        },
        select: {
          id: true,
          name: true,
          banExpires: true,
        },
        orderBy: { banExpires: "asc" },
        take: 5,
      }),
      prisma.user.findMany({
        where: { createdAt: { gte: since14Days } },
        select: { createdAt: true },
      }),
      prisma.participants.findMany({
        where: {
          createdAt: { gte: since14Days },
          event: { environment: { in: environments } },
        },
        select: { createdAt: true },
      }),
      prisma.events.findMany({
        where: { environment: { in: environments } },
        select: {
          id: true,
          judul: true,
          date: true,
          batasDaftar: true,
          maxCapacity: true,
          _count: { select: { participants: true } },
        },
        orderBy: { date: "asc" },
        take: 12,
      }),
      prisma.events.count({
        where: {
          environment: { in: environments },
          date: { gte: now },
        },
      }),
      prisma.events.count({
        where: {
          environment: { in: environments },
          date: { gte: now },
          batasDaftar: { gte: now },
        },
      }),
      prisma.participants.count({
        where: { event: { environment: { in: environments } } },
      }),
      prisma.cancelLog.count({
        where: { event: { environment: { in: environments } } },
      }),
      prisma.news.count({ where: { environment: "production" } }),
      prisma.news.count({
        where: { environment: { in: previewEnvironments } },
      }),
      prisma.news.findMany({
        where: { environment: { in: previewEnvironments } },
        select: {
          id: true,
          judul: true,
          environment: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.customerService.count({
        where: { status: { not: "RESOLVED" } },
      }),
      prisma.customerService.count({
        where: {
          readById: null,
          status: { not: "RESOLVED" },
        },
      }),
      prisma.customerService.findMany({
        where: { resolvedAt: { not: null } },
        select: { createdAt: true, resolvedAt: true },
      }),
      prisma.customerService.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.customerService.findMany({
        where: {
          readById: null,
          status: { not: "RESOLVED" },
        },
        select: {
          id: true,
          subject: true,
          catagory: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
        take: 5,
      }),
      prisma.notificationSubscription.count(),
      prisma.session.count({ where: { expiresAt: { gt: now } } }),
    ]);

    const capacity = eventRows.map(toCapacityItem).sort((a, b) => b.percent - a.percent);
    const lowCapacityEvents = capacity
      .filter((event) => {
        const source = eventRows.find((row) => row.id === event.id);
        return (
          source !== undefined &&
          source.date >= now &&
          source.batasDaftar >= now &&
          event.percent < 50
        );
      })
      .sort((a, b) => a.percent - b.percent)
      .slice(0, 5);

    const resolutionHours = resolvedRows
      .filter((row) => row.resolvedAt !== null)
      .map(
        (row) =>
          (row.resolvedAt!.getTime() - row.createdAt.getTime()) / 3_600_000,
      );
    const avgTicketResolutionHours = resolutionHours.length
      ? Math.round((resolutionHours.reduce((a, b) => a + b, 0) / resolutionHours.length) * 10) / 10
      : null;

    return {
      generatedAt: now.toISOString(),
      accessScope: scope,
      kpis: {
        totalUsers,
        verifiedUsers,
        unverifiedEmails: totalUsers - verifiedUsers,
        newUsers30d,
        incompleteProfilePercent: toPercent(incompleteCount, totalUsers),
        activeEvents,
        upcomingEvents,
        totalParticipants,
        cancellationRate: toPercent(cancelCount, totalParticipants),
        publishedNews,
        previewNews,
        openTickets,
        unreadTickets,
        avgTicketResolutionHours,
        pushSubscribers,
        activeSessions,
        bannedUsers,
      },
      trends: buildDailyTrend(
        recentUsers.map((row) => row.createdAt),
        recentParticipants.map((row) => row.createdAt),
        14,
        now,
      ),
      distributions: {
        roles: toDistribution(
          roleGroups.map((group) => ({ label: group.role, value: group._count._all })),
        ),
        angkatan: toDistribution(
          angkatanGroups.map((group) => ({
            label: group.angkatan,
            value: group._count._all,
          })),
        ),
        fakultas: toDistribution(
          fakultasGroups.map((group) => ({
            label: group.fakultas,
            value: group._count._all,
          })),
        ),
        genders: toDistribution(
          genderGroups.map((group) => ({
            label: group.jenisKelamin,
            value: group._count._all,
          })),
        ),
        ticketStatus: toDistribution(
          ticketGroups.map((group) => ({
            label: group.status,
            value: group._count._all,
          })),
        ),
      },
      actionQueue: {
        unreadTickets: unreadRows.map((row) => ({
          id: row.id,
          subject: row.subject,
          category: row.catagory,
          createdAt: row.createdAt.toISOString(),
        })),
        unverifiedUsers: unverifiedRows.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          createdAt: row.createdAt.toISOString(),
        })),
        incompleteProfiles: incompleteRows.map((row) => ({
          id: row.id,
          name: row.name,
          missingFields: getMissingProfileFields(row),
        })),
        lowCapacityEvents,
        pendingNews: pendingNewsRows.map((row) => ({
          id: row.id,
          judul: row.judul,
          environment: row.environment,
          updatedAt: row.updatedAt.toISOString(),
        })),
        expiringBans: expiringBanRows.map((row) => ({
          id: row.id,
          name: row.name,
          banExpires: row.banExpires!.toISOString(),
        })),
      },
      capacity,
    };
  },
);

/** Baris tabel user untuk panel admin. Field sensitif sengaja tidak di-select. */
export const getAdminUsers = cache(
  async (
    requestedPage = 1,
    rawQuery = "",
    rawRole = "ALL",
  ): Promise<TAdminTablePage<TAdminUserRow>> => {
    await authorizeAdminRead();

    const needle = rawQuery.trim();
    const roleFilter = normalizeFilter(rawRole, ALL_ROLES);
    const where: Prisma.UserWhereInput = {
      ...(roleFilter !== "ALL" ? { role: roleFilter as Role } : {}),
      ...(needle
        ? {
            OR: [
              { name: contains(needle) },
              { email: contains(needle) },
              { username: contains(needle) },
              { nomorSiswa: contains(needle) },
            ],
          }
        : {}),
    };

    const total = await prisma.user.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / ADMIN_TABLE_PAGE_SIZE));
    const page = Math.min(normalizePage(requestedPage), totalPages);

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        nomorSiswa: true,
        role: true,
        banned: true,
        banExpires: true,
        createdAt: true,
        angkatan: true,
        fakultas: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ADMIN_TABLE_PAGE_SIZE,
      take: ADMIN_TABLE_PAGE_SIZE,
    });

    return {
      rows: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        banExpires: user.banExpires?.toISOString() ?? null,
      })),
      total,
      page,
      pageSize: ADMIN_TABLE_PAGE_SIZE,
      totalPages,
    };
  },
);

export const getAdminEvents = cache(
  async (
    requestedPage = 1,
    rawQuery = "",
    rawEnvironment = "ALL",
  ): Promise<TAdminTablePage<TAdminEventRow>> => {
    await authorizeAdminRead();

    const needle = rawQuery.trim();
    const environmentFilter = normalizeFilter(rawEnvironment, ALL_ENVIRONMENTS);
    const where: Prisma.EventsWhereInput = {
      ...(environmentFilter !== "ALL" ? { environment: environmentFilter } : {}),
      ...(needle
        ? {
            OR: [
              { judul: contains(needle) },
              { slug: contains(needle) },
              { creator: { name: contains(needle) } },
            ],
          }
        : {}),
    };

    const total = await prisma.events.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / ADMIN_TABLE_PAGE_SIZE));
    const page = Math.min(normalizePage(requestedPage), totalPages);

    const events = await prisma.events.findMany({
      where,
      select: {
        id: true,
        judul: true,
        slug: true,
        date: true,
        batasDaftar: true,
        environment: true,
        maxCapacity: true,
        creator: { select: { name: true } },
        _count: { select: { participants: true } },
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * ADMIN_TABLE_PAGE_SIZE,
      take: ADMIN_TABLE_PAGE_SIZE,
    });

    return {
      rows: events.map((event) => ({
        id: event.id,
        title: event.judul,
        slug: event.slug,
        date: event.date.toISOString(),
        batasDaftar: event.batasDaftar.toISOString(),
        environment: event.environment,
        capacity: event.maxCapacity,
        joined: event._count.participants,
        creatorName: event.creator.name,
      })),
      total,
      page,
      pageSize: ADMIN_TABLE_PAGE_SIZE,
      totalPages,
    };
  },
);

export const getAdminNews = cache(
  async (
    requestedPage = 1,
    rawQuery = "",
    rawEnvironment = "ALL",
  ): Promise<TAdminTablePage<TAdminNewsRow>> => {
    await authorizeAdminRead();

    const needle = rawQuery.trim();
    const environmentFilter = normalizeFilter(rawEnvironment, ALL_ENVIRONMENTS);
    const where: Prisma.NewsWhereInput = {
      ...(environmentFilter !== "ALL" ? { environment: environmentFilter } : {}),
      ...(needle
        ? {
            OR: [
              { judul: contains(needle) },
              { slug: contains(needle) },
              { catagory: contains(needle) },
              { creator: { name: contains(needle) } },
            ],
          }
        : {}),
    };

    const total = await prisma.news.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / ADMIN_TABLE_PAGE_SIZE));
    const page = Math.min(normalizePage(requestedPage), totalPages);

    const news = await prisma.news.findMany({
      where,
      select: {
        id: true,
        judul: true,
        slug: true,
        catagory: true,
        environment: true,
        updatedAt: true,
        creator: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * ADMIN_TABLE_PAGE_SIZE,
      take: ADMIN_TABLE_PAGE_SIZE,
    });

    return {
      rows: news.map((item) => ({
        id: item.id,
        judul: item.judul,
        slug: item.slug,
        category: item.catagory,
        environment: item.environment,
        updatedAt: item.updatedAt.toISOString(),
        creatorName: item.creator.name,
      })),
      total,
      page,
      pageSize: ADMIN_TABLE_PAGE_SIZE,
      totalPages,
    };
  },
);

/**
 * Detail lengkap user, diambil hanya saat kartu detail dibuka.
 * Tidak memakai `cache()`: detail dipanggil dari Server Action, dan hasil null
 * dari percobaan sebelumnya tidak boleh terbawa ke percobaan berikutnya.
 */
export async function getAdminUserDetail(
  userId: string,
): Promise<TAdminUserDetail | null> {
  await authorizeAdminRead();
  const parsed = adminDetailIdSchema.safeParse(userId);
  if (!parsed.success) {
    console.warn("[admin-dashboard] getAdminUserDetail: id tidak valid");
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: parsed.data },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      nomorSiswa: true,
      noTelephone: true,
      angkatan: true,
      jurusan: true,
      fakultas: true,
      jenisKelamin: true,
      alamat: true,
      bio: true,
      statusPelajar: true,
      role: true,
      emailVerified: true,
      banned: true,
      banReason: true,
      banExpires: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    console.warn("[admin-dashboard] getAdminUserDetail: user tidak ditemukan");
    return null;
  }

  return {
    ...user,
    banExpires: user.banExpires?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function getAdminEventDetail(
  eventId: string,
): Promise<TAdminEventDetail | null> {
  await authorizeAdminRead();
  const parsed = adminDetailIdSchema.safeParse(eventId);
  if (!parsed.success) {
    console.warn("[admin-dashboard] getAdminEventDetail: id tidak valid");
    return null;
  }

  const event = await prisma.events.findUnique({
    where: { id: parsed.data },
    select: {
      id: true,
      judul: true,
      slug: true,
      catagory: true,
      lokasi: true,
      deskripsi: true,
      persyaratan: true,
      date: true,
      batasDaftar: true,
      environment: true,
      maxCapacity: true,
      creator: { select: { name: true } },
      _count: { select: { participants: true, cancelLogs: true } },
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!event) {
    console.warn("[admin-dashboard] getAdminEventDetail: event tidak ditemukan");
    return null;
  }

  return {
    id: event.id,
    title: event.judul,
    slug: event.slug,
    catagory: event.catagory,
    lokasi: event.lokasi,
    deskripsi: event.deskripsi,
    persyaratan: event.persyaratan,
    date: event.date.toISOString(),
    batasDaftar: event.batasDaftar.toISOString(),
    environment: event.environment,
    capacity: event.maxCapacity,
    joined: event._count.participants,
    cancelled: event._count.cancelLogs,
    creatorName: event.creator.name,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

export async function getAdminNewsDetail(
  newsId: string,
): Promise<TAdminNewsDetail | null> {
  await authorizeAdminRead();
  const parsed = adminDetailIdSchema.safeParse(newsId);
  if (!parsed.success) {
    console.warn("[admin-dashboard] getAdminNewsDetail: id tidak valid");
    return null;
  }

  const news = await prisma.news.findUnique({
    where: { id: parsed.data },
    select: {
      id: true,
      judul: true,
      slug: true,
      catagory: true,
      ringkasan: true,
      desckripsi: true,
      environment: true,
      creator: { select: { name: true } },
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!news) {
    console.warn("[admin-dashboard] getAdminNewsDetail: berita tidak ditemukan");
    return null;
  }

  return {
    id: news.id,
    judul: news.judul,
    slug: news.slug,
    catagory: news.catagory,
    ringkasan: news.ringkasan,
    desckripsi: news.desckripsi,
    environment: news.environment,
    creatorName: news.creator.name,
    createdAt: news.createdAt.toISOString(),
    updatedAt: news.updatedAt.toISOString(),
  };
}
