"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";

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

const BeritaCatagory = () => {
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

  const catagoryTrigger = [
    { ctg: "all" },
    { ctg: "beasiswa" },
    { ctg: "kegiatan" },
    { ctg: "pengumuman" },
  ];

  return (
    <Tabs defaultValue="all" className="w-full my-3">
      {/* 1. Scrollable Tabs List */}
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <TabsList className="bg-transparent h-auto p-0 gap-3 flex justify-start">
          {catagoryTrigger.map((item) => (
            <TabsTrigger
              key={item.ctg}
              value={item.ctg}
              className={cn(
                "rounded-full bg-muted px-6 py-2.5 capitalize transition-all",
                "data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md",
              )}
            >
              {item.ctg}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      {/* 2. Mapping Content berdasarkan Kategori */}
      {catagoryTrigger.map((category) => (
        <TabsContent key={category.ctg} value={category.ctg} className="mt-4">
          {beritaTerbaruProps
            .filter((news) =>
              category.ctg === "all" ? true : news.catagory === category.ctg,
            )
            .map((news) => (
              <Link
                href={`/detail/berita/${news.id}`}
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
                    <h3 className="text-sm text-muted-foreground capitalize">
                      {news.catagory}
                    </h3>
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
              </Link>
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default BeritaCatagory;
