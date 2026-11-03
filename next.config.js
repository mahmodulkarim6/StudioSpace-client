const SERVER_URL = process.env.SERVER_URL;

if (!SERVER_URL && process.env.VERCEL) {
  throw new Error('SERVER_URL environment variable is missing!');
}

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${SERVER_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;