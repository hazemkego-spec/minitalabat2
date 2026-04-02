import { NextResponse } from 'next/server';
import { shops } from '@/app/components/ShopList'; // استيراد قائمة المتاجر من ملفك

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');

  // البحث عن بيانات المتجر المحدد من القائمة اللي عندك
  const currentShop = shops.find(s => s.id === shopId);

  // إذا لم يجد المتجر، يستخدم بيانات افتراضية (لوحة المتاجر العامة)
  const shopName = currentShop ? currentShop.name : "إدارة المتاجر";
  const shopLogo = currentShop ? currentShop.logo : "/adminMT.webp";

  const manifest = {
    "id": `mt-shop-${shopId || 'general'}`,
    "name": `إدارة ${shopName}`,
    "short_name": shopName,
    "description": `لوحة تحكم ${shopName} - ميني طلبات`,
    "start_url": `/shop-admin/${shopId || ''}`,
    "scope": `/shop-admin/${shopId || ''}`,
    "display": "standalone",
    "orientation": "portrait",
    "background_color": "#0b0c0d",
    "theme_color": "#0b0c0d",
    "icons": [
      {
        "src": shopLogo,
        "sizes": "512x512",
        "type": "image/webp",
        "purpose": "any maskable"
      }
    ]
  };

  return NextResponse.json(manifest, {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Content-Type': 'application/json',
    },
  });
}
