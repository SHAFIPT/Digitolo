/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Your existing env vars
    FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    // Add other Firebase config vars
  },
  // Add webpack configuration to fix CSS loading issues
  webpack: (config : any) => {
    return config;
  },
}

module.exports = nextConfig;