// 1. استلام إشعار الـ Push وتخصيصه حسب المحل
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    // تحديد الأيقونة: نستخدم لوجو المحل لو مبعوث في البيانات، أو اللوجو الافتراضي
    const shopLogo = data.icon || '/adminMT.png';

    const options = {
      body: data.body || "لديك طلب جديد يحتاج للمراجعة",
      icon: shopLogo,
      badge: shopLogo, 
      vibrate: [500, 110, 500, 110, 450, 110, 200, 110], // نمط هزاز منبه
      tag: data.shopId || 'admin-notification', // التاج يمنع تكرار الإشعارات لنفس المحل
      renotify: true, 
      requireInteraction: true, 
      // ✅ تخزين الرابط الديناميكي للمحل عشان لما يضغط يفتح الصفحة الصح
      data: { url: data.url || `/shop-admin/${data.shopId || ''}` }
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "🔔 أوردر جديد", options)
    );
  }
});

// 2. التعامل الذكي مع الضغط على الإشعار (فتح صفحة المحل الصحيحة)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // البحث لو صفحة الإدارة الخاصة بهذا المحل مفتوحة فعلياً
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // لو مش مفتوحة، يفتح رابط المحل المحدد في الإشعار
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// 3. تحديث فوري للـ Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
