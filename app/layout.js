import "./globals.css";

export const metadata = {
  // تحديث العنوان ليظهر "لوحة الإدارة" بشكل واضح في التثبيت
  title: 'لوحة إدارة ميني طلبات',
  description: 'النظام الإداري للمتاجر والطلبات',
  metadataBase: new URL('https://minitalabat-admin.vercel.app'),
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover',
  icons: {
    icon: 'https://minitalabat2.vercel.app/adminMT.webp',
    apple: 'https://minitalabat2.vercel.app/adminMT.webp',
  },
}

export default function RootLayout({ children }) {
  // التأكد من أن التطبيق يقرأ "ADMIN" كقيمة افتراضية في هذا المشروع
  const appType = process.env.NEXT_PUBLIC_APP_TYPE || 'ADMIN';

  return (
    <html lang="ar">
      <head>
        {/* أيقونة اللوحة الإدارية المميزة */}
        <link rel="icon" href="https://minitalabat2.vercel.app/adminMT.webp" />
        <link rel="apple-touch-icon" href="https://minitalabat2.vercel.app/adminMT.webp" />
        
        <meta name="theme-color" content="#0b0c0d" /> 
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* ✅ الربط المباشر والنهائي للمانيفست الثابت */}
        {/* تم إلغاء الشروط المعقدة هنا لضمان أن يرى المتصفح ملف الـ JSON فوراً */}
        <link rel="manifest" href="/admin.json" />
        
        <meta property="og:image" content="https://minitalabat2.vercel.app/adminMT.webp" />
      </head>
      <body style={{ backgroundColor: '#121212', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
