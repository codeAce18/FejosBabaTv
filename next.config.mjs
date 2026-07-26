/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/**' },
    ],
    // Cloudinary URLs work reliably via direct <img>; keep optimizer for any local assets
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;