export const metadata = {
  title: 'Mini Talabat',
  description: 'أكبر مول تجاري رقمي في جيبك',
  icons: {
    icon: '/mall-logo.png',
    apple: '/mall-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#121212" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ margin: 0, backgroundColor: '#121212' }}>{children}</body>
    </html>
  );
}
