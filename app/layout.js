import "./globals.css"; // تأكد إن السطر ده موجود لو عندك ملف css

export const metadata = {
  title: 'Mini Talabat | ميني طلبات',
  description: 'أكبر مول تجاري رقمي في جيبك',
  metadataBase: new URL('https://minitalabat2.vercel.app'),
  manifest: '/manifest.json', // السطر ده هو اللي بيرجع زرار الـ Install
  icons: {
    icon: '/mall-logo.png',
    apple: '/mall-logo.png',
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* السطور دي بترجع هوية التطبيق للموبايل */}
        <link rel="icon" href="/mall-logo.png" />
        <link rel="apple-touch-icon" href="/mall-logo.png" />
        <meta name="theme-color" content="#FF6600" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  )
}
