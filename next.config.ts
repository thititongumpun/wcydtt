import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn4.iconfinder.com",
      },
    ]
  }
};

export default nextConfig;
