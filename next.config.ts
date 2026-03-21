import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow reading from content/ directory
  serverExternalPackages: ["diff"],

};

export default nextConfig;
