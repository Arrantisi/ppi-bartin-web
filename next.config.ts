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
  allowedDevOrigins: ["1a8f-85-109-93-100.ngrok-free.app"],
};

export default nextConfig;
