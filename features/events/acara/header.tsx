"use client";

import { IconHome } from "@/components/shared/icon-home";

const HeaderAcara = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="title-satu">Kegiatan</h1>
          <p className="footnote capitalize">
            Semua kegiatan seru ada disini
          </p>
        </div>
        <IconHome />
      </div>
    </div>
  );
};

export default HeaderAcara;

