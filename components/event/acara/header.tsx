"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import {
  Dialog,
  DialogTrigger,
} from "@/components/animate-ui/components/base/dialog";
import { DialogJudul } from "../dialog-judul";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const HeaderAcara = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-between">
        <div>
          <h1 className="text-lg font-semibold">Events</h1>
          <p className="text-xs text-muted-foreground capitalize">
            Semua Event seru ada disini
          </p>
        </div>
        <Link href={"/"}>
          <div className=" bg-white rounded-full shadow-xl p-1.5 mx-2 flex items-center justify-center">
            <Image
              src={"/logo-ppi.png"}
              alt=""
              width={200}
              height={200}
              className="size-6"
            />
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <InputGroup className="rounded-full py-5">
          <InputGroupInput placeholder="Search..." className="text-sm" />
          <InputGroupAddon>
            <IconSearch className="size-5" />
          </InputGroupAddon>
        </InputGroup>

        <DialogTrigger
          className={"rounded-full bg-primary p-1.5 text-white/80"}
        >
          <IconPlus />
        </DialogTrigger>
      </div>
      <DialogJudul catagory="events" />
    </Dialog>
  );
};

export default HeaderAcara;
