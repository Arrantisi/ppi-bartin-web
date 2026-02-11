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
