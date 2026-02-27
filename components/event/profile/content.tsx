import { Separator } from "@/components/ui/separator";
import {
  IconArrowRight,
  IconLonceng,
  IconMatahari,
  IconPeringatan,
  IconText,
  IconGlobe,
} from "@/icons";

import Link from "next/link";

export const ContentProfile = () => {
  return (
    <div className="space-y-3 my-3">
      <h1 className="title-tiga">Setting</h1>
      <div className="space-y-3 py-[16px] px-[8px] shadow rounded-2xl ring ring-accent">
        <Link
          href={`/home/profile/update`}
          className="flex items-center justify-between px-[20px]"
        >
          <div className="flex items-center gap-3">
            <IconText />
            <p className="content-description">Edit Profile</p>
          </div>
          <IconArrowRight />
        </Link>
        <Separator className="w-full mx-0" />
        <div className="flex items-center justify-between px-[20px]">
          <div className="flex items-center gap-3">
            <IconGlobe />
            <p className="content-description">Bahasa</p>
          </div>
          <IconArrowRight />
        </div>
        <Separator className="w-full mx-0" />
        <div className="flex items-center justify-between px-[20px]">
          <div className="flex items-center gap-3">
            <IconLonceng />
            <p className="content-description">Notifikasi</p>
          </div>
          <IconArrowRight />
        </div>
        <Separator className="w-full mx-0" />
        <div className="flex items-center justify-between px-[20px]">
          <div className="flex items-center gap-3">
            <IconMatahari />
            <p className="content-description">Tema</p>
          </div>
          <IconArrowRight />
        </div>
        <Separator className="w-full mx-0" />
        <div className="flex items-center justify-between px-[20px]">
          <div className="flex items-center gap-3">
            <IconPeringatan />
            <p className="content-description">Syarat & Ketentuan</p>
          </div>
          <IconArrowRight />
        </div>
      </div>
    </div>
  );
};
