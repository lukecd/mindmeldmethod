/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: false, // Disable compression to prevent ERR_CONTENT_DECODING_FAILED errors
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig 