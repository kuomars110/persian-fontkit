/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional: Use persian-fontkit plugin
  // Uncomment to enable automatic font optimization
  /*
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Optimize fonts during production build
      const { optimizeNextJSFonts } = require('persian-fontkit');
      optimizeNextJSFonts('./persian-fonts.config.js').catch(console.error);
    }
    return config;
  },
  */
};

module.exports = nextConfig;
