import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/plans',
        destination: 'https://staging-api.ogaflow.com/public/plans',
      },
    ];
  },
};

export default nextConfig;
