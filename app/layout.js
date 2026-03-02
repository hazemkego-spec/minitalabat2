export const metadata = {
  title: 'Mini Talabat | ميني طلبات',
  description: 'أكبر مول تجاري رقمي في جيبك - اطلب كل احتياجاتك في مكان واحد',
  openGraph: {
    title: 'Mini Talabat | ميني طلبات',
    description: 'أكبر مول تجاري رقمي في جيبك',
    url: 'https://minitalabat2.vercel.app/',
    siteName: 'Mini Talabat',
    images: [
      {
        url: '/mall-logo.png', // هنا بنحدد اللوجو بتاعنا
        width: 800,
        height: 600,
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mini Talabat | ميني طلبات',
    description: 'أكبر مول تجاري رقمي في جيبك',
    images: ['/mall-logo.png'],
  },
  icons: {
    icon: '/mall-logo.png', // دي عشان يظهر اللوجو في "تاب" المتصفح فوق
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  )
}
