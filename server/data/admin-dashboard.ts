import { cache } from "react";

import { prisma } from "@/lib/db";
import { getCurrentUserRole } from "@/server/actions/account";
import type {
  TAdminCapacityItem,
  TAdminDashboardAccessScope,
  TAdminDashboardSnapshot,
  TAdminEventRow,
  TAdminNewsRow,
  TAdminUserRow,
  TDashboardDistributionItem,
} from "@/types/admin-dashboard";
import {
  buildDailyTrend,
  getMissingProfileFields,
  toPercent,
} from "@/utils/admin-dashboard";

const ADMIN_ROLES = new Set(["ADMIN"]);

const ALL_ENVIRONMENTS = ["local", "preview", "production"];

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
          banExpires: { not: null, lte: until30Days },
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
        incompleteProfilePercent: toPercent(totalUsers - incompleteCount, totalUsers),
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
  async (): Promise<TAdminUserRow[]> => {
    await authorizeAdminRead();
    const users = await prisma.user.findMany({
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
      take: 200,
    });

    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      banExpires: user.banExpires?.toISOString() ?? null,
    }));
  },
);

export const getAdminEvents = cache(
  async (): Promise<TAdminEventRow[]> => {
    await authorizeAdminRead();
    const events = await prisma.events.findMany({
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
      take: 200,
    });

    return events.map((event) => ({
      id: event.id,
      title: event.judul,
      slug: event.slug,
      date: event.date.toISOString(),
      batasDaftar: event.batasDaftar.toISOString(),
      environment: event.environment,
      capacity: event.maxCapacity,
      joined: event._count.participants,
      creatorName: event.creator.name,
    }));
  },
);

export const getAdminNews = cache(
  async (): Promise<TAdminNewsRow[]> => {
    await authorizeAdminRead();
    const news = await prisma.news.findMany({
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
      take: 200,
    });

    return news.map((item) => ({
      id: item.id,
      judul: item.judul,
      slug: item.slug,
      category: item.catagory,
      environment: item.environment,
      updatedAt: item.updatedAt.toISOString(),
      creatorName: item.creator.name,
    }));
  },
);
