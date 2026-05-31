"use client";

import { IconHome } from "@/components/shared/icon-home";

const HeaderBerita = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="title-satu">Berita</h1>
          <p className="footnote capitalize">
            Semua info penting untuk kamu
          </p>
        </div>
        <IconHome />
      </div>
    </div>
  );
};

export default HeaderBerita;

