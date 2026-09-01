/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://web-apps-clinica-api.tgo9zw.easypanel.host",
  },
};

export default nextConfig;
