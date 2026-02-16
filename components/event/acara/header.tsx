"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { IconPlus, IconSearch } from "@tabler/icons-react";

import { useState } from "react";
import { SheetForm } from "../sheet-form";
import { LoadingAnimation } from "@/components/ui/loading-animation";

const HeaderAcara = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {isLoading && (
          <div className="fixed h-screen w-full z-60 backdrop-blur-md left-0 top-0 flex items-center justify-center">
            <LoadingAnimation />
          </div>
        )}

        <div>
          <h1 className="text-lg font-semibold">Acara</h1>
          <p className="text-xs text-muted-foreground capitalize">
            kegiatan mahasiswa indonesia bartın
          </p>
          <div className="flex items-center gap-2 mt-3">
            <InputGroup className="rounded-full py-5">
              <InputGroupInput placeholder="Search..." className="text-sm" />
              <InputGroupAddon>
                <IconSearch className="size-5" />
              </InputGroupAddon>
            </InputGroup>

            <SheetTrigger
              className={"rounded-full bg-primary p-1.5 text-white/80"}
            >
              <IconPlus />
            </SheetTrigger>
          </div>
        </div>
        <SheetForm
          maxCapacity={0}
          catagory="create"
          onClose={() => setIsOpen(false)}
          onLoading={() => setIsLoading(true)}
          judul={""}
          slug={""}
          date={new Date()}
          lokasi={""}
          content={""}
        />
      </Sheet>
    </div>
  );
};

export default HeaderAcara;
