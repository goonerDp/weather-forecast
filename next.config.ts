import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [new URL("https://cdn.weatherapi.com/weather/**")],
  },
};

export default nextConfig;
