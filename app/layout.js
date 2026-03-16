export const metadata = {
  title: 'Mini Talabat | ميني طلبات',
  description: 'أكبر مول تجاري رقمي في جيبك',
  metadataBase: new URL('https://minitalabat2.vercel.app'),
  manifest: '/manifest.json',
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
    <html lang="ar">
      <head>
        <link rel="icon" href="/mall-logo.png" />
        <link rel="apple-touch-icon" href="/mall-logo.png" />
        <meta name="theme-color" content="#FF6600" /> 
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* التعديل الجوهري لمنع الـ Zoom وتثبيت العناصر */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" 
        />
        
        <meta property="og:image" content="https://minitalabat2.vercel.app/mall-logo.png" />
      </head>
      <body style={{ backgroundColor: '#121212', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
