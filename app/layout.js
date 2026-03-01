export const metadata = {
  title: 'Mini Talabat',
  description: 'أكبر مول تجاري رقمي في جيبك', // التعديل الجديد هنا
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <head>
        {/* الأكواد دي بتخلي التطبيق يفتح شاشة كاملة وبدون شريط المتصفح */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#121212" />
      </head>
      <body style={{ margin: 0, backgroundColor: '#121212' }}>
        {children}
      </body>
    </html>
  );
}
