"use client"; 

import "./globals.css";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const params = useParams();
  const pathname = usePathname();
  
  // استخراج shopId بدقة مع التأكد أنه رقم
  const rawId = params?.shopId || pathname.split('/').pop();
  const shopIdFromUrl = (!isNaN(rawId) && rawId !== "") ? rawId : null;

  // 1. قراءة نوع التطبيق
  const appType = process.env.NEXT_PUBLIC_APP_TYPE || 'SHOP'; 

  const [manifestFile, setManifestFile] = useState("/manifest.json");
  const [appTitle, setAppTitle] = useState("ميني طلبات");
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // ✅ تسجيل الـ Service Worker مع إضافة Version لضمان التحديث
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js?v=2')
        .then(reg => console.log('SW Registered!', reg.scope))
        .catch(err => console.error('SW Failed!', err));
    }

    if (typeof window !== "undefined") {
      // ✅ حالة إدارة المتجر (المشروع الجديد)
      if (pathname.includes('/shop-admin') && shopIdFromUrl) {
        // نستخدم رابط الـ API المطور مع v=Date لكسر الكاش تماماً
        setManifestFile(`/api/manifest?shopId=${shopIdFromUrl}&v=${Date.now()}`);
        setAppTitle("لوحة إدارة المتجر");
        setIsDarkTheme(true);
      } 
      // ✅ حالة الإدارة العامة
      else if (pathname.startsWith('/admin')) {
        setManifestFile("/admin.json");
        setAppTitle("لوحة الإدارة العامة");
        setIsDarkTheme(true);
      } 
      // ✅ حالة العميل
      else {
        setManifestFile("/manifest.json");
        setAppTitle("ميني طلبات");
        setIsDarkTheme(false);
      }
    }
  }, [shopIdFromUrl, pathname]);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>{appTitle}</title>
        
        {/* الربط الديناميكي للمانيفست */}
        <link rel="manifest" href={manifestFile} />
        
        <link rel="icon" href={isDarkTheme ? "/adminMT.webp" : "/mall-logo.webp"} />
        <link rel="apple-touch-icon" href={isDarkTheme ? "/adminMT.webp" : "/mall-logo.webp"} />
        
        <meta name="theme-color" content={isDarkTheme ? "#0b0c0d" : "#FF6600"} /> 
        <meta name="apple-mobile-web-app-status-bar-style" content={isDarkTheme ? "black-translucent" : "default"} />
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
