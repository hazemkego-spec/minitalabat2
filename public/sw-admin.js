// 1. إضافة مستمع الـ Install لضمان التحديث الفوري
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 2. 🚨 الخطوة السحرية: مستمع الـ Fetch (ضروري جداً لتحويل الاختصار إلى تطبيق مثبت)
self.addEventListener('fetch', (event) => {
  // بنخلي الـ SW يمرر الطلبات بشكل طبيعي، وجوده فقط كافٍ لإقناع الكروم بالتثبيت
  event.respondWith(fetch(event.request).catch(() => {
    return caches.match(event.request);
  }));
});

// 3. استلام إشعار الـ Push وتخصيصه حسب المحل (كودك الأصلي)
self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const shopLogo = data.icon || '/adminMT.png';

      const options = {
        body: data.body || "لديك طلب جديد يحتاج للمراجعة",
        icon: shopLogo,
        badge: shopLogo, 
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110],
        tag: data.shopId || 'admin-notification',
        renotify: true, 
        requireInteraction: true, 
        data: { url: data.url || `/shop-admin/${data.shopId || ''}` }
      };

      event.waitUntil(
        self.registration.showNotification(data.title || "🔔 أوردر جديد", options)
      );
    } catch (e) {
      console.error("Push data error:", e);
    }
  }
});

// 4. التعامل الذكي مع الضغط على الإشعار (كودك الأصلي)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// 5. تحديث فوري للـ Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
