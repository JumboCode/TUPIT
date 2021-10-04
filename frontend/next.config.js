const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  target: 'serverless',
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/')],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});
