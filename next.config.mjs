/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "server.wellcraftindia.co.in"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
