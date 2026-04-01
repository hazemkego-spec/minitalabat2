import { shops } from "../../components/ShopList";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get("shop");
  
  const currentShop = shops.find(s => s.id === parseInt(shopId));
  const baseUrl = "https://minitalabat-admin.vercel.app"; // تأكدنا من الدومين الجديد

  const manifest = {
    // ✅ ID فريد لكل نسخة إدارية لمنع التداخل
    id: `admin-v6-${shopId || 'global'}`,
    name: currentShop ? `إدارة ${currentShop.name}` : "لوحة التحكم",
    short_name: currentShop ? currentShop.name : "الإدارة",
    description: `نظام إدارة طلبات ${currentShop?.name || 'المتجر'}`,
    
    // ✅ بما أننا في دومين منفصل، الـ Start URL والـ Scope يجب أن يكونوا "/" لضمان التثبيت
    start_url: shopId ? `/shop-admin/${shopId}` : "/",
    scope: "/", 
    
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0c0d",
    theme_color: "#FF6600",
    icons: [
      {
        // الأيقونة نأتي بها من المشروع الرئيسي (minitalabat2) لضمان وجودها
        src: currentShop?.logo ? `https://minitalabat2.vercel.app${currentShop.logo}` : `https://minitalabat2.vercel.app/adminMT.webp`,
        sizes: "192x192",
        type: "image/webp",
        purpose: "any"
      },
      {
        src: currentShop?.logo ? `https://minitalabat2.vercel.app${currentShop.logo}` : `https://minitalabat2.vercel.app/adminMT.webp`,
        sizes: "512x512",
        type: "image/webp",
        purpose: "any"
      }
    ]
  };

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "no-cache, no-store, must-revalidate", // إجبار المتصفح على قراءة البيانات الجديدة
    },
  });
}
