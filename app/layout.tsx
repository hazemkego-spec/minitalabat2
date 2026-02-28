import "./globals.css"; // تأكد من وجود هذا السطر لو كان موجود أصلاً

export const metadata = {
  title: "Mini Talabat | ميني طلبات",
  description: "أول مول تجاري رقمي في جيبك",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
