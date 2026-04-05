"use client"; 

import "./globals.css";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const params = useParams();
  const pathname = usePathname();
  
  const rawId = params?.shopId || pathname.split('/').pop();
  const shopIdFromUrl = (!isNaN(rawId) && rawId !== "") ? rawId : null;

  const [manifestFile, setManifestFile] = useState("/manifest.json");
  const [appTitle, setAppTitle] = useState("ميني طلبات");
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const baseUrl = "https://minitalabat-shops.vercel.app"; 
  const logoPath = isDarkTheme ? "/adminMT.webp" : "/mall-logo.webp";

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js?v=2')
        .then(reg => console.log('SW Registered!', reg.scope))
        .catch(err => console.error('SW Failed!', err));
    }

    if (typeof window !== "undefined") {
      if (pathname.includes('/shop-admin') && shopIdFromUrl) {
        setManifestFile(`/api/manifest?shopId=${shopIdFromUrl}&v=${Date.now()}`);
        setAppTitle("لوحة إدارة المتجر");
        setIsDarkTheme(true);
      } 
      else if (pathname.startsWith('/admin')) {
        setManifestFile("/admin.json");
        setAppTitle("لوحة الإدارة العامة");
        setIsDarkTheme(true);
      } 
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
        
        {/* --- 🚀 تحسين الأداء: حقن التنسيقات الحرجة لمنع الـ Render Blocking --- */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg-primary: ${isDarkTheme ? '#0b0c0d' : '#ffffff'};
            --text-main: ${isDarkTheme ? '#ffffff' : '#121212'};
            --accent-color: #FF6600;
          }
          body {
            background-color: var(--bg-primary);
            color: var(--text-main);
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            min-height: -webkit-fill-available;
            overflow-x: hidden;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }
          * {
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
          }
          img {
            max-width: 100%;
            height: auto;
            display: block;
          }
        ` }} />
        {/* ------------------------------------------------------------------ */}

        <meta property="og:type" content="website" />
        <meta property="og:title" content={appTitle} />
        <meta property="og:description" content="أكبر مول تجاري رقمي في جيبك - اطلب الآن بكل سهولة" />
        <meta property="og:image" content={`${baseUrl}${logoPath}`} />
        <meta property="og:url" content={baseUrl} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={appTitle} />
        <meta name="twitter:image" content={`${baseUrl}${logoPath}`} />

        <link rel="manifest" href={manifestFile} />
        <link rel="icon" href={isDarkTheme ? "/adminMT.webp" : "/mall-logo.webp"} />
        <link rel="apple-touch-icon" href={isDarkTheme ? "/adminMT.webp" : "/mall-logo.webp"} />
        
        <meta name="theme-color" content={isDarkTheme ? "#0b0c0d" : "#FF6600"} /> 
        <meta name="apple-mobile-web-app-status-bar-style" content={isDarkTheme ? "black-translucent" : "default"} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={appTitle} />

        <meta name="viewport" content="width=device-width, initial-scale=1,  viewport-fit=cover" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
