"use client";

import {
  Dialog,
  DialogTrigger,
} from "@/components/animate-ui/components/base/dialog";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { IconPlus, IconSearch } from "@tabler/icons-react";
import PhotoUpload from "../photo-upload";
import { useState } from "react";

const HeaderBerita = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div>
        <h1 className="text-lg font-semibold">Berita</h1>
        <p className="text-xs text-muted-foreground capitalize">
          Semua info penting untuk kamu
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
      </div>
      <PhotoUpload catagory="berita" onClose={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default HeaderBerita;
