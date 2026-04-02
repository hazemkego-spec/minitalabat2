"use client"; 

import "./globals.css";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const is_admin_env = process.env.NEXT_PUBLIC_APP_TYPE === 'ADMIN';
  const [manifestFile, setManifestFile] = useState(is_admin_env ? "/admin.json" : "/manifest.json");
  const [appTitle, setAppTitle] = useState(is_admin_env ? "لوحة الإدارة" : "ميني طلبات");

  useEffect(() => {
    // 1. تسجيل الـ Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW Registered!', reg.scope))
          .catch(err => console.error('SW Failed!', err));
      });
    }

    // 2. تحديد الهوية ديناميكياً بناءً على المسار (Pathname)
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      
      if (path.startsWith('/shop-admin')) {
        setManifestFile("/shop.json");
        setAppTitle("إدارة المتاجر");
      } else if (path.startsWith('/admin')) {
        setManifestFile("/admin.json");
        setAppTitle("لوحة الإدارة");
      } else {
        setManifestFile("/manifest.json");
        setAppTitle("ميني طلبات");
      }
    }
  }, []);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>{appTitle}</title>
        
        {/* الربط الديناميكي للمانيفست بناءً على حالة الـ State */}
        <link rel="manifest" href={manifestFile} />
        
        {/* الأيقونات: نستخدم اللوجو الأسود للإدارة والمتاجر، والبرتقالي للعميل */}
        <link rel="icon" href={manifestFile.includes('manifest') ? "/mall-logo.webp" : "/adminMT.webp"} />
        <link rel="apple-touch-icon" href={manifestFile.includes('manifest') ? "/mall-logo.webp" : "/adminMT.webp"} />
        
        {/* ألوان الهوية: أسود للإدارة والمتاجر، برتقالي للعميل */}
        <meta name="theme-color" content={manifestFile.includes('manifest') ? "#FF6600" : "#0b0c0d"} /> 
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={appTitle} />

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body style={{ backgroundColor: manifestFile.includes('manifest') ? '#f8f9fa' : '#121212', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
