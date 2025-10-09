import withPWA from 'next-pwa';
import { resolve } from 'path';

const isDev = process.env.NODE_ENV === 'development';

const pwa = withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true,
  runtimeCaching: []
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  webpack: (config) => {
    config.resolve.alias['@'] = resolve('.', '.');
    return config;
  }
};

export default pwa(nextConfig);
