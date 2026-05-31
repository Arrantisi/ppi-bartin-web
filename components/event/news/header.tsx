"use client";

import { IconHome } from "../icon-home";

const HeaderBerita = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] font-semibold">Berita</h1>
          <p className="text-[13px] text-muted-foreground capitalize">
            Semua info penting untuk kamu
          </p>
        </div>
        <IconHome />
      </div>
    </div>
  );
};

export default HeaderBerita;
