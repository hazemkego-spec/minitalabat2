export const metadata = {
  title: 'Mini Talabat | ميني طلبات',
  description: 'أكبر مول تجاري رقمي في جيبك',
  metadataBase: new URL('https://minitalabat2.vercel.app'), // مهم جداً للروابط
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mini Talabat | ميني طلبات',
    description: 'أكبر مول تجاري رقمي في جيبك',
    url: 'https://minitalabat2.vercel.app/',
    siteName: 'Mini Talabat',
    images: [
      {
        url: '/mall-logo.png', 
        width: 512,
        height: 512,
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  icons: {
    icon: '/mall-logo.png',
    shortcut: '/mall-logo.png',
    apple: '/mall-logo.png',
  },
  manifest: '/manifest.json', // الربط بملف الأيقونات
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <head>
        {/* كود إضافي لضمان ظهور الأيقونة في الأندرويد */}
        <meta name="theme-color" content="#FF6600" />
        <link rel="apple-touch-icon" href="/mall-logo.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
