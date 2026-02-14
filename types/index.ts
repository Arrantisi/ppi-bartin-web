export type CardEventProps = {
  id: string;
  image: string;
  judul: string;
  createdBy: string;
  tanggal: string;
  lokasi: string;
  description: string;
  participant: { image: string }[];
  totalParticipant: string;
};

export type TcatagoryDialogEvent = {
  catagory: "berita" | "acara";
  onClose: () => void;
};

export type TuploadFileState = {
  file: File | null;
  progress: number;
  name: string;
  size: number;
  key: string;
  url: string;
};
