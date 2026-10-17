import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The default bottom-left spot would cover the theme toggle in dev.
  devIndicators: { position: "bottom-right" },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
