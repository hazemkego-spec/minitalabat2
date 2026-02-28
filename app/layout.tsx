import React from "react";

export const metadata = {
  title: "Mini Talabat | ميني طلبات",
  description: "أول مول تجاري رقمي في جيبك",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
