import { Button } from "@/components/ui/button";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconPlus, IconSearch } from "@tabler/icons-react";

const HeaderAcara = () => {
  return (
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

        <Button className="rounded-full">
          <IconPlus />
        </Button>
      </div>
    </div>
  );
};

export default HeaderAcara;
