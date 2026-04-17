import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fly.storage.tigris.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assembled-packetcase-fg928o.fly.storage.tigris.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
