const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
export default {
  eslint: { ignoreDuringBuilds: true },
  // Proxy /api/* to the Express server so the HTTPOnly cookie stays first-party.
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${SERVER_URL}/api/:path*` }];
  },
};
