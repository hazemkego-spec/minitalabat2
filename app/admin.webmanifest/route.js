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
    // ✅ معرف فريد لكل متجر لضمان استقلالية التطبيق عند التثبيت
    id: `/shop-admin/${shopId || 'general'}`,
    name: currentShop ? `إدارة ${currentShop.name}` : "نظام ميني طلبات",
    short_name: currentShop ? currentShop.name : "الطلبات",
    description: `لوحة تحكم ذكية لإدارة طلبات ${currentShop?.name || 'المتجر'}`,
    start_url: `/shop-admin/${shopId || ''}`,
    // ✅ النطاق الخاص بالمتجر لضمان عمل الـ PWA في مساره الصحيح
    scope: `/shop-admin/${shopId || ''}`,
    display: "standalone",
    background_color: "#0b0c0d",
    theme_color: "#FF6600",
    icons: [
      {
        src: currentShop?.logo ? `${baseUrl}${currentShop.logo}` : `${baseUrl}/icon.webp`,
        sizes: "192x192",
        type: currentShop?.logo?.endsWith('.webp') ? "image/webp" : "image/png",
        purpose: "any"
      },
      {
        src: currentShop?.logo ? `${baseUrl}${currentShop.logo}` : `${baseUrl}/icon.webp`,
        sizes: "512x512",
        type: currentShop?.logo?.endsWith('.webp') ? "image/webp" : "image/png",
        purpose: "maskable"
      }
    ]
  };

  // 4. إرجاع النتيجة كـ JSON مع الترويسة الصحيحة للمانيفست
  return NextResponse.json(manifest);
}
