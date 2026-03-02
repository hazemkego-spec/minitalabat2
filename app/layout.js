export const metadata = {
  title: 'Mini Talabat | ميني طلبات',
  description: 'أكبر مول تجاري رقمي في جيبك',
  metadataBase: new URL('https://minitalabat2.vercel.app'), // اللينك بتاعك
  openGraph: {
    title: 'Mini Talabat | ميني طلبات',
    description: 'أكبر مول تجاري رقمي في جيبك',
    url: 'https://minitalabat2.vercel.app/',
    siteName: 'Mini Talabat',
    images: [
      {
        url: '/mall-logo.png', // لازم المسار ده يكون شغال
        width: 300, // الواتساب بيحب الحجم ده
        height: 300,
        alt: 'Mini Talabat Logo',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    images: ['/mall-logo.png'],
  },
  icons: {
    icon: '/mall-logo.png',
    apple: '/mall-logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <head>
        {/* أهم سطر للواتساب والفيسبوك عشان يجبرهم يقرأوا الصورة */}
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
      </head>
      <body>{children}</body>
    </html>
  )
}
