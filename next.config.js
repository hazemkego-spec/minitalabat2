/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 1. إعدادات التحويل للدومين الجديد (Redirects)
  async redirects() {
    // التحويل فقط إذا لم نكن في مشروع المتاجر أو الإدارة
    if (process.env.NEXT_PUBLIC_APP_TYPE !== 'SHOP' && process.env.NEXT_PUBLIC_APP_TYPE !== 'ADMIN') {
      return [
        {
          source: '/shop-admin/:path*',
          destination: 'https://minitalabat-shops.vercel.app/shop-admin/:path*',
          permanent: true,
        },
      ];
    }
    return [];
  },

  // 2. إعدادات الرأس (Headers) لمنع الكاش وضمان تحديث الـ PWA
  async headers() {
    return [
      {
        source: '/(.*).json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/api/manifest', // تأمين مسار المانيفست الديناميكي الجديد
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
