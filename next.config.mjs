/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Reddit image domains for Discover page thumbnails
      {
        protocol: 'https',
        hostname: 'external-preview.redd.it',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'preview.redd.it',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.redd.it',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a.thumbs.redditmedia.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'b.thumbs.redditmedia.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'styles.redditmedia.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
