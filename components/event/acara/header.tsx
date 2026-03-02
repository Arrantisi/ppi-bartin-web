"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { ButtonCreate } from "@/components/buttons";

const HeaderAcara = () => {
  return (
    <div>
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
