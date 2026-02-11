"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type BeritaTerbaruProps = {
  id: string;
  image: string;

  judul: string;
  createdBy: {
    image: string;
    user: string;
  };
  tanggal: string;
  catagory: "beasiswa" | "pengumuman" | "kegiatan";
}[];

const CarouselCard = () => {
  const beritaTerbaruProps: BeritaTerbaruProps = [
    {
      id: "403720ea-519e-59ec-ab25-5bb2d855de96",
      image: "/prestasi-news.jpeg",
      judul: "Turnamen Futsal Antar Mahasiswa Indonesia di Turki Meriah!",
      createdBy: {
        image: "/user-profile-03.png",
        user: "Jared Washington",
      },
      tanggal: "11 Maret 2026",
      catagory: "beasiswa",
    },
    {
      id: "0babe669-e503-5f37-a387-b17e66d4468e",
      image: "/passport-news.jpeg",
      judul: "Panduan Perpanjangan ikamet untuk Mahasiswa Indonesia",
      createdBy: {
        image: "/user-profile-02.png",
        user: "Allen Marshall",
      },
      tanggal: "10 Feb 2026",
      catagory: "kegiatan",
    },
    {
      id: "67ece45c-48fd-5a97-8710-f3286eb391fa",
      image: "/apartmen-news.jpeg",
      judul: "Tips Mencari Apartemen untuk Mahasiswa Baru di Bartin",
      createdBy: {
        image: "/user-profile-04.png",
        user: "Justin Casey",
      },
      tanggal: "07 Feb 2026",
      catagory: "pengumuman",
    },
    {
      id: "b83d2253-f4b4-571b-b569-7541af4fb350",
      image: "/nkri-news.jpeg",
      judul: "Perayaan Hari Kemerdekaan RI ke-79 di Bartin Penuh Kebersamaan",
      createdBy: {
        image: "/user-profile-01.png",
        user: "Ethan Atkins",
      },
      tanggal: "18 Agustus 2025",
      catagory: "beasiswa",
    },
  ];

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4 py-4">
        {beritaTerbaruProps.map((news) => (
          <CarouselItem
            key={news.id}
            className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3"
          >
            <div className="relative group overflow-hidden rounded-[2rem] h-[280px] w-full">
              {/* Image Background */}
              <Image
                src={news.image}
                alt="News"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content Context */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className=" flex justify-end">
                  <Badge shape={"circle"}>{news.catagory}</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white/80">
                    <Avatar className="size-6">
                      <AvatarImage src={news.createdBy.image} />
                      <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium leading-none">
                        {news.createdBy.user}
                      </span>
                      <div className="size-1.5 rounded-full bg-white/80" />
                      <span className="text-xs opacity-70">{news.tanggal}</span>
                    </div>
                  </div>

                  <h2 className="text-white text-lg font-bold leading-tight">
                    Panduan Perpanjangan Ikamet untuk Mahasiswa Indonesia di
                    Bartin
                  </h2>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CarouselCard;
