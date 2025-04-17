/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove env section - Next.js automatically exposes NEXT_PUBLIC_* vars
  // Add images config if using external images
  images: {
    domains: ['your-image-domain.com'],
  },
}

module.exports = nextConfig