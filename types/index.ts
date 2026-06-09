import { TgetEventBySlug } from "@/server/data/events";
import { TgetNewsBySlug } from "@/server/data/news";

export type Tparticipants = {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    image: string | null;
    name: string | null;
    username: string | null;
    email: string;
    noTelephone: string | null;
    nomorSiswa: string | null;
    statusPelajar: string | null;
    fakultas: string | null;
    jurusan: string | null;
    angkatan: string | null;
    bio: string | null;
    tanggalLahir: Date | null;
    jenisKelamin: string | null;
    alamat: string | null;
    emailVerified: boolean;
  };
}[];

export type TupdateNewsProps = {
  slug: string;
  data: TgetNewsBySlug;
};

export type TupdateEventProps = {
  slug: string;
  data: TgetEventBySlug;
};

export type TCatagory = {
  catagory: "events" | "news";
};

export type TServerPrompt<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export type TcatagoryDialogEvent = {
  catagory: "berita" | "acara";
  onClose: () => void;
  slug: string;
};

export type TuploadFileState = {
  file: File | null;
  progress: number;
  name: string;
  size: number;
  key: string;
  url: string;
};
