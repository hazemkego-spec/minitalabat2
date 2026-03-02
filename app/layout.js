export const metadata = {
  title: 'Mini Talabat | ميني طلبات',
  description: 'أكبر مول تجاري رقمي في جيبك',
  manifest: '/manifest.json',
  icons: {
    icon: '/mall-logo.png',
    apple: '/mall-logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <head>
        <link rel="icon" href="/mall-logo.png" />
        <link rel="apple-touch-icon" href="/mall-logo.png" />
        
        {/* السطر ده هيحول الشريط الأبيض لبرتقالي مبهج */}
        <meta name="theme-color" content="#FF6600" /> 
        
        {/* السطر ده عشان أجهزة الأيفون تخليه برتقالي برضه */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body style={{ backgroundColor: '#121212', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
