const webpack = require('webpack');

module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Exclude specific problematic parts of dependencies
    config.module.rules.push({
      test: /\.js$/,
      include: /browserslist|keyv/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: 'defaults' }]
          ]
        }
      }
    });

    // Add Puppeteer to externals
    if (isServer) {
      config.externals.push('puppeteer');
      config.externals.push('crawlee');
      config.externals.push('browserslist')
    }

    // Add fallbacks for Puppeteer dependencies
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      os: false,
      stream: false,
      zlib: false,
      path: false,
      http: false,
      https: false,
    };

    return config;
  },
};
