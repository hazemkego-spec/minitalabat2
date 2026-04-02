"use client"; // ضروري لإضافة التفاعلية وتسجيل الـ Service Worker

import "./globals.css";
import { useEffect } from "react";

// ملاحظة: الـ Metadata في Next.js (App Router) لازم تكون في ملف منفصل لو استخدمت "use client"
// أو نضعها داخل ملف layout.js إذا لم يكن "use client" موجوداً. 
// بما أننا نحتاج تسجيل الـ SW، سنقسم العمل كالتالي:

export default function RootLayout({ children }) {
  
  // 1. تحديد نوع التطبيق بناءً على الرابط أو البيئة
  const is_admin = process.env.NEXT_PUBLIC_APP_TYPE === 'ADMIN';

  useEffect(() => {
    // 2. تسجيل الـ Service Worker المسؤول عن التنبيهات والتثبيت كـ App
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('Service Worker Registered!', reg.scope))
          .catch(err => console.error('SW Registration Failed!', err));
      });
    }
  }, []);

  // تحديد ملف المانيفست بناءً على نوع المشروع
  const manifestFile = is_admin ? "/admin.json" : "/manifest.json";

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>{is_admin ? 'لوحة إدارة ميني طلبات' : 'ميني طلبات | Mini Talabat'}</title>
        <meta name="description" content={is_admin ? 'النظام الإداري للمتاجر والطلبات' : 'أكبر مول تجاري رقمي في جيبك'} />
        
        {/* الربط الديناميكي للمانيفست */}
        <link rel="manifest" href={manifestFile} />
        
        {/* الأيقونات المحلية */}
        <link rel="icon" href={is_admin ? "/adminMT.webp" : "/mall-logo.webp"} />
        <link rel="apple-touch-icon" href={is_admin ? "/adminMT.webp" : "/mall-logo.webp"} />
        
        {/* ألوان الهوية البصرية */}
        <meta name="theme-color" content={is_admin ? "#0b0c0d" : "#FF6600"} /> 
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={is_admin ? "الإدارة" : "ميني طلبات"} />

        {/* إعدادات الشاشة للموبايل */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body style={{ backgroundColor: is_admin ? '#121212' : '#f8f9fa', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
