/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

// next.config.js
const withTM = require("next-transpile-modules")(["@mercadopago/sdk-react"]); // pass the modules you would like to see transpiled

module.exports = withTM();

module.exports = nextConfig;
