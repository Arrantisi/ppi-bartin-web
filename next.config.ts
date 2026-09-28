import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "d9i7wgmc1q.ufs.sh",
      },
    ],
  },
  reactCompiler: true,
  allowedDevOrigins: ["b959-85-109-93-100.ngrok-free.app"],
  // optimizePackageImports untuk @tabler/icons-react sengaja DIHAPUS.
  //
  // Opsi itu membuat Turbopack menganalisis seluruh barrel package (ribuan
  // export) dan memanipulasi import map. Di Vercel itu berakhir jadi
  // "Error while looking up import map: next/font/google queries have
  // exactly one entry" + 28x "Can't resolve
  // '@vercel/turbopack-next/internal/font/google/font'", sehingga build
  // gagal total padahal `next/font/google` di layout.tsx pemanggilannya
  // benar dan build lokal lolos.
  //
  // Kalau nanti bundle icon jadi masalah, jalur yang benar adalah
  // mengonsolidasikan ke satu library (lihat docs/performance-plan.md),
  // bukan lewat optimizePackageImports.
};

export default nextConfig;
