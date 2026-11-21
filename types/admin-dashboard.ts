/** Cakupan environment yang boleh dilihat role saat ini. */
export type TAdminDashboardAccessScope = "all" | "preview" | "production";

/** Hasil tabel admin dengan filter dan pagination yang dijalankan di server. */
export type TAdminTablePage<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type TAdminKpis = {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedEmails: number;
  newUsers30d: number;
  incompleteProfilePercent: number;
  activeEvents: number;
  upcomingEvents: number;
  totalParticipants: number;
  cancellationRate: number;
  publishedNews: number;
  previewNews: number;
  openTickets: number;
  unreadTickets: number;
  avgTicketResolutionHours: number | null;
  pushSubscribers: number;
  activeSessions: number;
  bannedUsers: number;
};

export type TDashboardDistributionItem = {
  label: string;
  value: number;
};

export type TDashboardTrendItem = {
  date: string;
  users: number;
  participants: number;
};

export type TAdminCapacityItem = {
  id: string;
  title: string;
  date: string;
  joined: number;
  capacity: number;
  percent: number;
};

export type TAdminActionQueues = {
  unreadTickets: Array<{
    id: string;
    subject: string;
    category: string;
    createdAt: string;
  }>;
  unverifiedUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    createdAt: string;
  }>;
  incompleteProfiles: Array<{
    id: string;
    name: string | null;
    missingFields: string[];
  }>;
  lowCapacityEvents: TAdminCapacityItem[];
  pendingNews: Array<{
    id: string;
    judul: string;
    environment: string;
    updatedAt: string;
  }>;
  expiringBans: Array<{
    id: string;
    name: string | null;
    banExpires: string;
  }>;
};

export type TAdminUserRow = {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  nomorSiswa: string | null;
  role: string;
  banned: boolean | null;
  banExpires: string | null;
  createdAt: string;
  angkatan: string | null;
  fakultas: string | null;
};

export type TAdminEventRow = {
  id: string;
  title: string;
  slug: string;
  date: string;
  batasDaftar: string;
  environment: string;
  capacity: number;
  joined: number;
  creatorName: string | null;
};

export type TAdminNewsRow = {
  id: string;
  judul: string;
  slug: string;
  category: string;
  environment: string;
  updatedAt: string;
  creatorName: string | null;
};

export type TAdminDashboardSnapshot = {
  generatedAt: string;
  accessScope: TAdminDashboardAccessScope;
  kpis: TAdminKpis;
  trends: TDashboardTrendItem[];
  distributions: {
    roles: TDashboardDistributionItem[];
    angkatan: TDashboardDistributionItem[];
    fakultas: TDashboardDistributionItem[];
    genders: TDashboardDistributionItem[];
    ticketStatus: TDashboardDistributionItem[];
  };
  actionQueue: TAdminActionQueues;
  capacity: TAdminCapacityItem[];
};

/** Detail user yang diambil saat kartu detail dibuka (bukan saat memuat tabel). */
export type TAdminUserDetail = {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  nomorSiswa: string | null;
  noTelephone: string | null;
  angkatan: string | null;
  jurusan: string | null;
  fakultas: string | null;
  jenisKelamin: string | null;
  alamat: string | null;
  bio: string | null;
  statusPelajar: string | null;
  role: string;
  emailVerified: boolean;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TAdminEventDetail = {
  id: string;
  title: string;
  slug: string;
  catagory: string | null;
  lokasi: string;
  deskripsi: string;
  persyaratan: string | null;
  date: string;
  batasDaftar: string;
  environment: string;
  capacity: number;
  joined: number;
  cancelled: number;
  creatorName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TAdminNewsDetail = {
  id: string;
  judul: string;
  slug: string;
  catagory: string;
  ringkasan: string;
  desckripsi: string;
  environment: string;
  creatorName: string | null;
  createdAt: string;
  updatedAt: string;
};
