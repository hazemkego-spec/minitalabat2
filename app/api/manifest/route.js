import { NextResponse } from 'next/server';
import { shops } from '../../components/ShopList'; 

// ✅ إجبار المسار على العمل كديناميكي لمنع خطأ الـ Build
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');

    // ✅ تصحيح طريقة البحث لضمان عدم حدوث TypeError
    const currentShop = (shops && Array.isArray(shops)) 
      ? shops.find(s => String(s.id) === String(shopId)) 
      : null;

    const shopName = currentShop ? currentShop.name : "إدارة المتاجر";
    const shopLogo = currentShop ? currentShop.logo : "/adminMT.webp";

    const manifest = {
      "id": `mt-shop-${shopId || 'general'}`,
      "name": `إدارة ${shopName}`,
      "short_name": shopName,
      "description": `لوحة تحكم ${shopName} - ميني طلبات`,
      "start_url": `/shop-admin/${shopId || ''}`,
      "scope": "/", 
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

    return NextResponse.json(manifest);

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
