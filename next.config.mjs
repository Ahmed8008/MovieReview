/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_SECRET: SecretKeys,
  },
};

export default nextConfig;
