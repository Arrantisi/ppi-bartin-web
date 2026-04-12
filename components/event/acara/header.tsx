"use client";

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
    </div>
  );
};

export default HeaderAcara;
