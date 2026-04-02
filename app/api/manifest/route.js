import { NextResponse } from 'next/server';
import { shops } from '../../components/ShopList'; 

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');

    const currentShop = (shops && Array.isArray(shops)) 
      ? shops.find(s => String(s.id) === String(shopId)) 
      : null;

    const shopName = currentShop ? currentShop.name : "إدارة المتاجر";
    const shopLogo = currentShop ? currentShop.logo : "/adminMT.webp";

    // ✅ التعديل الجذري هنا لتمييز الهوية عن تطبيق العميل
    const manifest = {
      "id": `pwa-mt-admin-${shopId || 'main'}`, // ID فريد تماماً يمنع التداخل
      "name": `إدارة ${shopName}`,
      "short_name": shopName,
      "description": `لوحة تحكم ${shopName} - ميني طلبات`,
      "start_url": `/shop-admin/${shopId || ''}?mode=pwa_admin`, // علامة مميزة لبداية التطبيق
      "scope": "/", 
      "display": "standalone",
      "orientation": "portrait",
      "background_color": "#0b0c0d",
      "theme_color": "#0b0c0d",
      "prefer_related_applications": false, // يجبر المتصفح على عرض خيار التثبيت
      "icons": [
        {
          "src": shopLogo,
          "sizes": "512x512",
          "type": "image/webp",
          "purpose": "any" // تغيير من maskable لـ any لضمان العرض على كل الموبايلات
        }
      ]
    };

    return new NextResponse(JSON.stringify(manifest), {
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
