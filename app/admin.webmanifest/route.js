import { shops } from "../components/ShopList";
import { NextResponse } from "next/server";

export async function GET(request) {
  // 1. استخراج الـ shopId من رابط الطلب
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get("shop");
  
  // البحث عن المحل داخل المصفوفة باستخدام الـ id الرقمي
  const currentShop = shops.find(s => s.id === parseInt(shopId));
  const baseUrl = "https://minitalabat2.vercel.app";

  // 3. بناء هيكل المانيفست بناءً على هوية المحل
  const manifest = {
    // ✅ تحديث الـ ID لنسخة جديدة تماماً لإجبار المتصفح على إعادة الفحص
    id: `admin-pwa-v5-final-${shopId || 'general'}`,
    name: currentShop ? `إدارة ${currentShop.name}` : "نظام ميني طلبات",
    short_name: currentShop ? currentShop.name : "الطلبات",
    description: `لوحة تحكم ذكية لإدارة طلبات ${currentShop?.name || 'المتجر'}`,
    
    // ✅ الرابط الأساسي مع إضافة pwa=true للتمييز
    start_url: shopId ? `/shop-admin/${shopId}?pwa=true` : "/shop-admin?pwa=true",
    
    // ✅ جعل الـ Scope مطابق تماماً لما تم تسجيله في الـ Service Worker (مهم جداً)
    scope: shopId ? `/shop-admin/${shopId}/` : "/shop-admin/",
    
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0c0d",
    theme_color: "#FF6600",
    icons: [
      {
        // ✅ استخدام رابط كامل شامل الـ baseUrl لضمان ظهور الأيقونة وعدم فشل الـ PWA
        src: currentShop?.logo ? `${baseUrl}${currentShop.logo}` : `${baseUrl}/adminMT.webp`,
        sizes: "192x192",
        type: "image/webp",
        purpose: "any"
      },
      {
        src: currentShop?.logo ? `${baseUrl}${currentShop.logo}` : `${baseUrl}/adminMT.webp`,
        sizes: "512x512",
        type: "image/webp",
        purpose: "any"
      }
    ]
  };

  // إرجاع النتيجة كـ JSON مع الترويسة الصحيحة
  return NextResponse.json(manifest);
}
