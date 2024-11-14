/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['fmnlactrxghjuxevhfis.supabase.co'],
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    },
    responseLimit: false
  },
};

export default nextConfig;
