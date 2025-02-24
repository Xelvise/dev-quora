import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    serverExternalPackages: ["mongoose"],
    experimental: {
        mdxRs: true,
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "*" },
            { protocol: "http", hostname: "*" },
        ],
    },
};

export default nextConfig;
