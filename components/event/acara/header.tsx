"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import { ButtonCreate } from "@/components/buttons";
import { IconHome } from "../icon-home";

const HeaderAcara = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] font-semibold">Kegiatan</h1>
          <p className="text-[13px] text-muted-foreground capitalize">
            Semua kegiatan seru ada disini
          </p>
        </div>
        <IconHome />
      </div>

      <div className="flex items-center gap-2 mt-3 ">
        <InputGroup className="rounded-full py-5">
          <InputGroupInput placeholder="Search..." className="text-sm" />
          <InputGroupAddon>
            <IconSearch className="size-5" />
          </InputGroupAddon>
        </InputGroup>

        <ButtonCreate catagory="events" />
      </div>
    </div>
  );
};

export default HeaderAcara;
