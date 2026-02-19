export type TServerPrompt = {
  status: "error" | "success";
  msg: string;
};

export type CardEventProps = {
  id: string;
  slug: string;
  image: string;
  judul: string;
  createdBy: string;
  tanggal: string;
  lokasi: string;
  description: string;
  participant: { image: string; id: string }[];
  totalParticipant: number;
  maxCapacity: number;
};

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
