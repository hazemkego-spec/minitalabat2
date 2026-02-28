export const metadata = {
  title: "Mini Talabat | ميني طلبات",
  description: "أول مول تجاري رقمي في جيبك",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        {/* السطر ده بيخلي الموبايل يعتبره تطبيق حقيقي */}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
