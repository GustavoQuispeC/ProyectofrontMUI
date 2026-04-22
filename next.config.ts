import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com", // 👈 AGREGAR ESTE
      },
      {
        protocol: "https",
        hostname: "media.falabella.com", // 👈 NUEVO
      },
    ],
  },
};
export default nextConfig;
