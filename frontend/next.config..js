/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Use client-side rendering for pages that need browser APIs
  experimental: {
    // Optional: if needed
    // appDir: false,
  }
}

module.exports = nextConfig