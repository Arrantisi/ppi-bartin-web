"use client";

import { ThemeToggle } from "@/components/buttons";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProfileUser } from "@/hooks/use-users";
import {
  IconArrowRight,
  IconCalendar,
  IconFileText,
  IconSun,
  IconTimeline,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";

export const ContentProfile = () => {
  const { data } = useProfileUser();

  if (!data) {
    return null;
  }

  return (
    <div className="w-full relative flex flex-col items-start py-0 box-border gap-3 text-left text-[0.75rem] text-slategray font-inter">
      {/* untuk 2 informasi */}
      <div className="self-stretch h-7 relative text-[1.125rem]">
        <div className="absolute top-[-0.062rem] left-0 leading-7 font-semibold">
          Informasi
        </div>
      </div>
      <div className="flex justify-center items-center gap-3 h-23 w-full">
        <Card className="py-5 rounded-xl px-2 w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <div className="bg-primary/10 rounded-full p-3">
                <IconCalendar
                  className="size-6 text-primary"
                  width={44}
                  height={44}
                />
              </div>
            </div>
            <div>
              <div className="h-13.5 flex-1 flex flex-col items-start">
                <div className="w-full flex items-start mb-1 pr-5">
                  <h1 className="relative leading-4">Tahun Kedatangan</h1>
                </div>
                <div className="self-stretch h-5 flex items-start shrink-0 text-[0.875rem] text-gray">
                  <h3 className="flex-1 relative leading-5 font-semibold">
                    {data?.angkatan}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className=" py-5 rounded-xl px-2 w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <div className="bg-primary/10 rounded-full p-3">
                <IconFileText
                  className="size-6 text-primary"
                  width={44}
                  height={44}
                />
              </div>
            </div>
            <div>
              <div className="h-13.5 flex-1 flex flex-col items-start">
                <div className="w-26.5 flex items-start">
                  <h1 className="relative leading-4">Jurusan</h1>
                </div>
                <div className="self-stretch h-5 flex items-start shrink-0 text-[0.875rem] text-gray">
                  <h3 className="flex-1 relative leading-5 font-semibold line-clamp-2">
                    {data?.jurusan}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* untuk 1 informasi */}

      <Card className="py-5 rounded-xl px-2 w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <div className="bg-primary/10 rounded-full p-3">
              <IconTimeline
                className="size-6 text-primary"
                width={44}
                height={44}
              />
            </div>
          </div>
          <div>
            <div className="h-13.5 flex-1 flex flex-col items-start">
              <div className="w-full flex items-start mb-1 pr-5">
                <h1 className="relative leading-4">Kegiatan yang Diikuti</h1>
              </div>
              <div className="self-stretch h-5 flex items-start shrink-0 text-[0.875rem] text-gray">
                <h3 className="flex-1 relative leading-5 font-semibold">
                  {data?.events.length} Kegiatan
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch h-20.5 flex flex-col items-start py-0 pl-2 pr-0 box-border gap-2 text-[0.875rem] text-mediumslateblue">
          {data.events.map((event) => (
            <div className="flex items-center gap-3" key={event.id}>
              <div className="size-1.5 bg-primary rounded-full" />
              <div className="text-[15px]">{event.judul}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="self-stretch h-7 relative text-[1.125rem] ">
        <div className="absolute top-[-0.062rem] left-0 leading-7 font-semibold">
          Setting
        </div>
      </div>
      <div className="self-stretch h-28.5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] rounded-2xl bg-card border-whitesmoke border-solid border box-border overflow-hidden shrink-0 flex flex-col items-start p-[0.062rem] text-center text-[1rem] text-gray">
        <Link
          href={`/home/profile/update`}
          className="self-stretch h-14 bg-card border-whitesmoke border-solid border-b box-border flex items-center justify-between py-0 px-5 gap-5"
        >
          <div className="h-6 w-full flex items-center gap-4">
            <IconUser className="h-6 w-6" width={24} />
            <p>Edit Profile</p>
          </div>
          <div
            className={buttonVariants({
              variant: "outline",
            })}
          >
            <IconArrowRight className="h-5 w-5 relative" />
          </div>
        </Link>
        <div className="self-stretch h-[3.563rem] bg-card border-whitesmoke border-solid border-b box-border flex items-center justify-between py-0 px-5 gap-5 text-left font-sf-pro">
          <div className="h-6 flex items-center gap-4">
            <IconSun className="h-6 w-6" />
            <div className="h-5.5 flex-1 relative">
              <div className="absolute top-[-0.062rem] left-0 tracking-[-0.31px] leading-5.5">
                Tema
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
