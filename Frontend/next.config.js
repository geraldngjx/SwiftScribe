/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

module.exports = {
  webpack: (config) => {
    // Add a new rule to handle mp4 files
    config.module.rules.push({
      test: /\.mp4$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next',
          name: 'static/media/[name].[hash].[ext]',
        },
      },
    });

    return config;
  },
};