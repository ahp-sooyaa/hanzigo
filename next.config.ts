import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  serverExternalPackages: ["better-auth"],
};

export default nextConfig;
