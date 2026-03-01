export const metadata = {
  title: 'Mini Talabat',
  description: 'أكبر مول تجاري رقمي في جيبك',
  icons: {
    // تغيير الاسم هنا بيكسر الكاش ويخلي اللوجو الجديد يظهر فوراً
    icon: '/mall-logo.png', 
    shortcut: '/mall-logo.png',
    apple: '/mall-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <head>
        {/* الربط مع الأيقونة الجديدة */}
        <link rel="icon" href="/mall-logo.png" />
        <link rel="apple-touch-icon" href="/mall-logo.png" />
        
        {/* تعريف التطبيق عشان يظهر خيار التثبيت (Install) */}
        <link rel="manifest" href="/manifest.json" />
        
        <meta name="theme-color" content="#121212" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ margin: 0, backgroundColor: '#121212' }}>
        {children}
      </body>
    </html>
  );
}
