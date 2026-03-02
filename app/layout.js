export const metadata = {
  title: 'Mini Talabat | ميني طلبات',
  description: 'أكبر مول تجاري رقمي في جيبك',
  metadataBase: new URL('https://minitalabat2.vercel.app'), 
  
  openGraph: {
    title: 'Mini Talabat | ميني طلبات',
    description: 'أكبر مول تجاري رقمي في جيبك',
    url: 'https://minitalabat2.vercel.app/',
    siteName: 'Mini Talabat',
    images: [
      {
        url: 'https://minitalabat2.vercel.app/mall-logo.png', 
        width: 400,
        height: 400,
        alt: 'Mini Talabat Logo',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mini Talabat | ميني طلبات',
    description: 'أكبر مول تجاري رقمي في جيبك',
    images: ['https://minitalabat2.vercel.app/mall-logo.png'],
  },
  icons: {
    icon: '/mall-logo.png',
    shortcut: '/mall-logo.png',
    apple: '/mall-logo.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <head>
        {/* السطور دي هي اللي بتجبر الواتساب يشوف اللوجو فوراً */}
        <meta property="og:image" content="https://minitalabat2.vercel.app/mall-logo.png" />
        <meta property="og:image:secure_url" content="https://minitalabat2.vercel.app/mall-logo.png" />
        <meta property="og:image:type" content="image/png" />
        <meta name="theme-color" content="#FF6600" />
        <link rel="apple-touch-icon" href="/mall-logo.png" />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
