/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

// next.config.js
const withTM = require("next-transpile-modules")(["@mercadopago/sdk-react"]); // pass the modules you would like to see transpiled

module.exports = withTM();

module.exports = nextConfig;
