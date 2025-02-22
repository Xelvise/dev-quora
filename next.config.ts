import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    serverExternalPackages: ["mongoose"],
    experimental: {
        // serverActions // are enabled by default from NextJS 14
        mdxRs: true,
    },
};

export default nextConfig;
