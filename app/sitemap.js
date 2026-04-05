export default async function sitemap() {
  const baseUrl = 'https://minitalabat-shops.vercel.app';

  // هنا يمكنك جلب روابط المتاجر من قاعدة البيانات الخاصة بك (Firebase مثلاً)
  // لكن للبداية سنضع الروابط الثابتة
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}
