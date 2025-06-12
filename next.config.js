module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://109.73.198.81/api/:path*',
      },
    ];
  },
};
