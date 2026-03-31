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
    // ✅ معرف فريد تماماً لكل نسخة إدارة لمنع التداخل مع تطبيق العميل
    id: `admin-pwa-id-${shopId || 'general'}`,
    name: currentShop ? `إدارة ${currentShop.name}` : "نظام ميني طلبات",
    short_name: currentShop ? currentShop.name : "الطلبات",
    description: `لوحة تحكم ذكية لإدارة طلبات ${currentShop?.name || 'المتجر'}`,
    
    // ✅ الرابط اللي الأبلكيشن هيفتح عليه لما تضغط على الأيقونة
    start_url: shopId ? `/shop-admin/${shopId}` : "/shop-admin",
    
    // ✅ النطاق الخاص بالإدارة (Scope) - ده اللي بيفصلها عن تطبيق العميل
    scope: "/shop-admin/",
    
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

  return NextResponse.json(manifest);
}
