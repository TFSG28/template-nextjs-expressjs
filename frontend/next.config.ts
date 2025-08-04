import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    YOUR_SECRET_KEY: process.env.YOUR_SECRET_KEY,
    },
    webpack: (config: any) => {
      config.resolve.fallback = { fs: false, net: false, tls: false };
      config.externals.push("pino-pretty", "lokijs", "encoding");
      return config;
    },
};

export default nextConfig;
