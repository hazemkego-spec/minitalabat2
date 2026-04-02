"use client"; 

import "./globals.css";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation"; // أضفنا usePathname كاحتياط

export default function RootLayout({ children }) {
  const params = useParams();
  const pathname = usePathname(); // للحصول على المسار الحالي بدقة
  
  // استخراج shopId من الرابط أو من المسار لو الـ params تأخرت
  const shopIdFromUrl = params?.shopId || pathname.split('/').pop(); 

  // 1. قراءة نوع التطبيق - في المشروع الجديد يفضل ضبطها SHOP في Vercel
  const appType = process.env.NEXT_PUBLIC_APP_TYPE || 'SHOP'; 

  const [manifestFile, setManifestFile] = useState("/manifest.json");
  const [appTitle, setAppTitle] = useState("إدارة المتجر");
  const [isDarkTheme, setIsDarkTheme] = useState(true); // المتاجر دايماً Dark Theme

  useEffect(() => {
    // تسجيل الـ Service Worker الموحد
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW Registered!', reg.scope))
        .catch(err => console.error('SW Failed!', err));
    }

    if (typeof window !== "undefined") {
      // ✅ المنطق المطور للمشروع الجديد (minitalabat-shops)
      if (pathname.includes('/shop-admin') && shopIdFromUrl && !isNaN(shopIdFromUrl)) {
        // نطلب المانيفست الديناميكي فوراً بناءً على رقم المحل
        const dynamicManifest = `/api/manifest?shopId=${shopIdFromUrl}&v=${Date.now()}`;
        setManifestFile(dynamicManifest);
        setAppTitle("لوحة إدارة المتجر");
        setIsDarkTheme(true);
      } else if (pathname.startsWith('/admin')) {
        setManifestFile("/admin.json");
        setAppTitle("لوحة الإدارة العامة");
        setIsDarkTheme(true);
      } else {
        // الافتراضي للمشروع ده هو إدارة المحل
        setManifestFile("/shop.json");
        setIsDarkTheme(true);
      }
    }
  }, [shopIdFromUrl, pathname]);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>{appTitle}</title>
        
        {/* الربط الديناميكي للمانيفست - هو ده اللي بيغير اللوجو والاسم */}
        <link rel="manifest" href={manifestFile} />
        
        {/* الأيقونات: نستخدم الثيم المظلم لإدارة المتاجر */}
        <link rel="icon" href={isDarkTheme ? "/adminMT.webp" : "/mall-logo.webp"} />
        <link rel="apple-touch-icon" href={isDarkTheme ? "/adminMT.webp" : "/mall-logo.webp"} />
        
        <meta name="theme-color" content={isDarkTheme ? "#0b0c0d" : "#FF6600"} /> 
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={appTitle} />

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body style={{ backgroundColor: isDarkTheme ? '#0b0c0d' : '#f8f9fa', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
