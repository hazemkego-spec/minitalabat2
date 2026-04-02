import "./globals.css";

// جلب نوع التطبيق (ADMIN أو CLIENT) من إعدادات Vercel
const is_admin = process.env.NEXT_PUBLIC_APP_TYPE === 'ADMIN';

export const metadata = {
  // التغيير الديناميكي للعنوان والوصف
  title: is_admin ? 'لوحة إدارة ميني طلبات' : 'ميني طلبات | Mini Talabat',
  description: is_admin ? 'النظام الإداري للمتاجر والطلبات' : 'أكبر مول تجاري رقمي في جيبك',
  
  // ضبط الرابط الأساسي بناءً على المشروع
  metadataBase: new URL(is_admin ? 'https://minitalabat-admin.vercel.app' : 'https://minitalabat2.vercel.app'),
  
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover',
  
  icons: {
    // استخدام اللوجو المحلي لكل مشروع بدلاً من روابط خارجية لمنع التداخل
    icon: is_admin ? '/adminMT.webp' : '/mall-logo.webp',
    apple: is_admin ? '/adminMT.webp' : '/mall-logo.webp',
  },
};

export default function RootLayout({ children }) {
  // اختيار ملف المانيفست المناسب (العميل يقرأ manifest.json والإدارة تقرأ admin.json)
  const manifestFile = is_admin ? "/admin.json" : "/manifest.json";

  return (
    <html lang="ar">
      <head>
        {/* الربط الديناميكي للأيقونات والمانيفست */}
        <link rel="icon" href={is_admin ? "/adminMT.webp" : "/mall-logo.webp"} />
        <link rel="apple-touch-icon" href={is_admin ? "/adminMT.webp" : "/mall-logo.webp"} />
        <link rel="manifest" href={manifestFile} />
        
        {/* تخصيص لون شريط الحالة (أسود للإدارة، برتقالي للعميل) */}
        <meta name="theme-color" content={is_admin ? "#0b0c0d" : "#FF6600"} /> 
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        <meta property="og:image" content={is_admin ? "/adminMT.webp" : "/mall-logo.webp"} />
      </head>
      <body style={{ backgroundColor: is_admin ? '#121212' : '#f8f9fa', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
