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
    // ✅ جعل الـ ID فريد جداً لضمان عدم الخلط مع أي نسخة أخرى
    id: `admin-app-v3-${shopId || 'general'}`,
    name: currentShop ? `إدارة ${currentShop.name}` : "نظام ميني طلبات",
    short_name: currentShop ? currentShop.name : "الطلبات",
    description: `لوحة تحكم ذكية لإدارة طلبات ${currentShop?.name || 'المتجر'}`,
    
    // ✅ إضافة باراميتر pwa للتمييز ومنع التداخل
    start_url: shopId ? `/shop-admin/${shopId}?pwa=true` : "/shop-admin?pwa=true",
    
    // ✅ تضييق النطاق (Scope) ليكون خاصاً بمنطقة الإدارة فقط
    scope: "/shop-admin/",
    
    display: "standalone",
    background_color: "#0b0c0d",
    theme_color: "#FF6600",
    icons: [
      {
        src: currentShop?.logo ? `${baseUrl}${currentShop.logo}` : `${baseUrl}/adminMT.webp`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: currentShop?.logo ? `${baseUrl}${currentShop.logo}` : `${baseUrl}/adminMT.webp`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };

  // إرجاع النتيجة كـ JSON مع الترويسة الصحيحة
  return NextResponse.json(manifest);
}
