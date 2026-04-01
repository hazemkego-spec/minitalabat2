import "./globals.css";

export const metadata = {
  title: 'إدارة ميني طلبات | Admin',
  description: 'لوحة التحكم الذكية لإدارة الطلبات',
  metadataBase: new URL('https://minitalabat-admin.vercel.app'),
  icons: {
    icon: '/mall-logo.webp',
    apple: '/mall-logo.webp',
  },
  openGraph: {
    title: 'إدارة ميني طلبات',
    description: 'لوحة التحكم الذكية لإدارة الطلبات',
    url: 'https://minitalabat-admin.vercel.app/',
    siteName: 'Mini Talabat Admin',
    images: [
      {
        url: '/mall-logo.webp',
        width: 512,
        height: 512,
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  // جلب نوع التطبيق لضمان عرض المانيفست الصحيح
  const appType = process.env.NEXT_PUBLIC_APP_TYPE;

  return (
    <html lang="ar">
      <head>
        <link rel="icon" href="/mall-logo.png" />
        <link rel="apple-touch-icon" href="/mall-logo.png" />
        <meta name="theme-color" content="#0b0c0d" /> 
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" 
        />

        {/* ✅ الربط الشرطي للمانيفست بناءً على نوع المشروع */}
        {/* إذا كان مشروع العميل، نستخدم المانيفست القديم */}
        {appType === 'CLIENT' && (
          <link rel="manifest" href="/manifest.json" />
        )}

        {/* ✅ إذا كان مشروع الإدارة، نربط المانيفست الديناميكي مباشرة هنا */}
        {appType === 'ADMIN' && (
          <link rel="manifest" href="/admin.webmanifest" />
        )}
        
        <meta property="og:image" content="https://minitalabat2.vercel.app/mall-logo.webp" />
      </head>
      <body style={{ backgroundColor: '#121212', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
