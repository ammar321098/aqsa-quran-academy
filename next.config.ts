import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Smaller production bundles, faster cold starts on VPS
  output: "standalone",
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        hostname: "aqsa-academy.t3.storage.dev",
        port: "",
        protocol: "https",
      },
    ],
  },
  // Reduce memory pressure on VPS
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
};

export default nextConfig;
