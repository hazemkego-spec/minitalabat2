import { shops } from "../components/ShopList";
import { NextResponse } from "next/server";

export async function GET(request) {
  // 1. استخراج الـ shopId من رابط الطلب
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get("shop");
  
  // 2. جلب بيانات المحل من ملف الإعدادات الخاص بك
  const currentShop = shops[shopId];

  // 3. بناء هيكل المانيفست بناءً على هوية المحل
  const manifest = {
    name: currentShop ? `إدارة ${currentShop.name}` : "نظام ميني طلبات",
    short_name: currentShop ? currentShop.name : "الطلبات",
    description: `لوحة تحكم ذكية لمتجر ${currentShop?.name || 'المتجر'}`,
    start_url: `/shop-admin/${shopId || ''}`,
    display: "standalone",
    background_color: "#0b0c0d",
    theme_color: "#FF6600",
    icons: [
      {
        src: currentShop?.logo || "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: currentShop?.logo || "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };

  // 4. إرجاع النتيجة كـ JSON مع الترويسة الصحيحة للمانيفست
  return NextResponse.json(manifest);
}
