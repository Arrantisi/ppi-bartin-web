"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import { ButtonCreate } from "@/components/buttons";
import { IconHome } from "../icon-home";

const HeaderBerita = () => {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="text-[24px] font-semibold">Berita</h1>
          <p className="text-[13px] text-muted-foreground capitalize">
            Semua info penting untuk kamu
          </p>
        </div>
        <IconHome />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <InputGroup className="rounded-full py-5">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <IconSearch className="size-5" />
          </InputGroupAddon>
        </InputGroup>

        <ButtonCreate catagory="news" />
      </div>
    </div>
  );
};

export default HeaderBerita;
