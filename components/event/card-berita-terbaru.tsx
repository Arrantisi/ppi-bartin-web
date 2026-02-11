import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type BeritaTerbaruProps = {
  id: string;
  image: string;
  title: string;
  judul: string;
  createdBy: {
    image: string;
    user: string;
  };
  tanggal: string;
}[];

const CardBeritaTerbaru = () => {
  const beritaTerbaruProps: BeritaTerbaruProps = [
    {
      id: "403720ea-519e-59ec-ab25-5bb2d855de96",
      image: "/prestasi-news.jpeg",
      title: "Kegiatan",
      judul: "Turnamen Futsal Antar Mahasiswa Indonesia di Turki Meriah!",
      createdBy: {
        image: "/user-profile-03.png",
        user: "Jared Washington",
      },
      tanggal: "11 Maret 2026",
    },
    {
      id: "0babe669-e503-5f37-a387-b17e66d4468e",
      image: "/passport-news.jpeg",
      title: "Kegiatan",
      judul: "Panduan Perpanjangan ikamet untuk Mahasiswa Indonesia",
      createdBy: {
        image: "/user-profile-02.png",
        user: "Allen Marshall",
      },
      tanggal: "10 Feb 2026",
    },
    {
      id: "67ece45c-48fd-5a97-8710-f3286eb391fa",
      image: "/apartmen-news.jpeg",
      title: "Kegiatan",
      judul: "Tips Mencari Apartemen untuk Mahasiswa Baru di Bartin",
      createdBy: {
        image: "/user-profile-04.png",
        user: "Justin Casey",
      },
      tanggal: "07 Feb 2026",
    },
    {
      id: "b83d2253-f4b4-571b-b569-7541af4fb350",
      image: "/nkri-news.jpeg",
      title: "Kegiatan",
      judul: "Perayaan Hari Kemerdekaan RI ke-79 di Bartin Penuh Kebersamaan",
      createdBy: {
        image: "/user-profile-01.png",
        user: "Ethan Atkins",
      },
      tanggal: "18 Agustus 2025",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-3 my-3 ">
      {beritaTerbaruProps.map((news) => (
        <div
          key={news.id}
          className="grid grid-cols-5 w-full hover:bg-muted-foreground/5 p-2 rounded-4xl gap-2"
        >
          <Image
            src={news.image}
            alt="berita"
            height={200}
            width={200}
            className="size-36 rounded-4xl col-span-2"
          />
          <div className="flex flex-col items-start h-36 col-span-3">
            <div className="space-y-1">
              <h3 className="text-sm text-muted-foreground">{news.title}</h3>
              <h1 className="text-lg/6 font-semibold">{news.judul}</h1>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1">
                <Avatar className="size-6">
                  <AvatarImage src={news.createdBy.image} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-xs">{news.createdBy.user}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-2 bg-muted-foreground rounded-full" />
                <span className="text-xs text-muted-foreground">
                  {news.tanggal}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardBeritaTerbaru;
