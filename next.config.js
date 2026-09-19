/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ]
  },
  // Keep the 3D bundle out of first paint: R3F is dynamically imported (ssr:false) in Hero3D
  experimental: { optimizePackageImports: ['three', '@react-three/drei'] }
};
module.exports = nextConfig;
