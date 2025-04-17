/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Explicitly disable any special CSS processing
  webpack: (config) => {
    return config;
  }
}

module.exports = nextConfig