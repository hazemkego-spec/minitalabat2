export default async function sitemap() {
  // الرابط الأساسي الجديد للأبلكيشن
  const baseUrl = 'https://minitalabat2.vercel.app';

  // ملاحظة: هنا سنقوم لاحقاً بجلب المصفوفة من Firebase 
  // حالياً سنضع روابط ثابتة كنموذج
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // مثال لكيفية إضافة متجر يدوياً حالياً
    {
      url: `${baseUrl}/shop-admin`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.3,
    },
  ];

  return routes;
}
