"use client"; 

import "./globals.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // أضفنا هذا لجلب الـ shopId من الرابط

export default function RootLayout({ children }) {
  const params = useParams();
  const shopIdFromUrl = params?.shopId; // استخراج ID المتجر من الرابط لو موجود

  // 1. قراءة نوع التطبيق من متغيرات البيئة (Vercel)
  const appType = process.env.NEXT_PUBLIC_APP_TYPE; // ADMIN أو SHOP أو CLIENT (الافتراضي)

  // 2. حالات التحكم في الهوية
  const [manifestFile, setManifestFile] = useState("/manifest.json");
  const [appTitle, setAppTitle] = useState("ميني طلبات");
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // تسجيل الـ Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW Registered!', reg.scope))
          .catch(err => console.error('SW Failed!', err));
      });
    }

    // تحديد الهوية بناءً على نوع المشروع (App Type) والمسار (URL)
    if (typeof window !== "undefined") {
      const path = window.location.pathname;

      if (appType === 'ADMIN' || path.startsWith('/admin')) {
        setManifestFile("/admin.json");
        setAppTitle("لوحة الإدارة");
        setIsDarkTheme(true);
      } 
      else if (appType === 'SHOP' || path.startsWith('/shop-admin')) {
        // إذا كان هناك ID متجر، سنطلب مانيفست ديناميكي (سننشئه في الخطوة القادمة)
        const dynamicManifest = shopIdFromUrl 
          ? `/api/manifest?shopId=${shopIdFromUrl}&v=${Date.now()}` 
          : "/shop.json";
          
        setManifestFile(dynamicManifest);
        setAppTitle("إدارة المتجر");
        setIsDarkTheme(true);
      } 
      else {
        setManifestFile("/manifest.json");
        setAppTitle("ميني طلبات");
        setIsDarkTheme(false);
      }
    }
  }, [appType, shopIdFromUrl]);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>{appTitle}</title>
        
        {/* الربط الديناميكي للمانيفست */}
        <link rel="manifest" href={manifestFile} />
        
        {/* الأيقونات: أسود للإدارة والمتاجر، برتقالي للعميل */}
        <link rel="icon" href={isDarkTheme ? "/adminMT.webp" : "/mall-logo.webp"} />
        <link rel="apple-touch-icon" href={isDarkTheme ? "/adminMT.webp" : "/mall-logo.webp"} />
        
        {/* ألوان الهوية: أسود للإدارة والمتاجر، برتقالي للعميل */}
        <meta name="theme-color" content={isDarkTheme ? "#0b0c0d" : "#FF6600"} /> 
        <meta name="apple-mobile-web-app-status-bar-style" content={isDarkTheme ? "black-translucent" : "default"} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={appTitle} />

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body style={{ backgroundColor: isDarkTheme ? '#121212' : '#f8f9fa', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
