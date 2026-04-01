import "./globals.css";

export const metadata = {
  title: 'Mini Talabat | ميني طلبات',
  description: 'أكبر مول تجاري رقمي في جيبك',
  metadataBase: new URL('https://minitalabat2.vercel.app'),
  // تم إزالة سطر المانيفست الثابت من هنا لضمان الفصل
  icons: {
    icon: '/mall-logo.webp',
    apple: '/mall-logo.webp',
  },
  openGraph: {
    title: 'Mini Talabat | ميني طلبات',
    description: 'أكبر مول تجاري رقمي في جيبك',
    url: 'https://minitalabat2.vercel.app/',
    siteName: 'Mini Talabat',
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
  // جلب نوع التطبيق داخل الـ Component لضمان القراءة الصحيحة وقت التنفيذ
  const appType = process.env.NEXT_PUBLIC_APP_TYPE;

  return (
    <html lang="ar">
      <head>
        <link rel="icon" href="/mall-logo.png" />
        <link rel="apple-touch-icon" href="/mall-logo.png" />
        <meta name="theme-color" content="#FF6600" /> 
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" 
        />

        {/* ✅ الربط الشرطي للمانيفست بناءً على إعدادات Vercel */}
        {appType === 'CLIENT' && (
          <link rel="manifest" href="/manifest.json" />
        )}
        
        <meta property="og:image" content="https://minitalabat2.vercel.app/mall-logo.webp" />
      </head>
      <body style={{ backgroundColor: '#121212', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
