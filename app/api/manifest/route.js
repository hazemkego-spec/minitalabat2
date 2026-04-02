import { NextResponse } from 'next/server';
// تم تعديل المسار لاستخدام المسار النسبي بناءً على خريطة ملفاتك
import { shops } from '../../components/ShopList'; 

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');

    // البحث عن بيانات المتجر المحدد من القائمة
    const currentShop = shops ? shops.find(s => s.id === shopId) : null;

    // تحديد البيانات (الاسم واللوجو)
    const shopName = currentShop ? currentShop.name : "إدارة المتاجر";
    
    // التأكد من أن مسار اللوجو يبدأ بـ / ليكون مساراً مطلقاً من مجلد public
    let shopLogo = "/adminMT.webp";
    if (currentShop && currentShop.logo) {
      shopLogo = currentShop.logo.startsWith('http') ? currentShop.logo : currentShop.logo;
    }

    const manifest = {
      "id": `mt-shop-${shopId || 'general'}`,
      "name": `إدارة ${shopName}`,
      "short_name": shopName,
      "description": `لوحة تحكم ${shopName} - ميني طلبات`,
      "start_url": shopId ? `/shop-admin/${shopId}` : `/shop-admin`,
      "scope": `/`, 
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
  } catch (error) {
    console.error("Manifest Error:", error);
    return NextResponse.json({ error: "Failed to generate manifest" }, { status: 500 });
  }
}
