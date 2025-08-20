/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Evitar que busque la carpeta pages
  pageExtensions: ['tsx', 'ts'],
};

module.exports = nextConfig;
