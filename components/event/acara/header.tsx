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

const HeaderAcara = () => {
  return (
    <Dialog>
      <h1 className="text-lg font-semibold">Events</h1>
      <p className="text-xs text-muted-foreground capitalize">
        Semua Event seru ada disini
      </p>
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
      <DialogJudul catagory="event" />
    </Dialog>
  );
};

export default HeaderAcara;
