// ✅ اسم الكاش لتمييز الملفات ومنع التداخل
const CACHE_NAME = 'mt-shared-cache-v21';

// 1. تثبيت الـ Service Worker (ضروري لظهور زر Install في المتصفح)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // كاش بسيط جداً لضمان توافق معايير PWA
      return cache.addAll(['/']);
    })
  );
});

// 2. تنظيف الكاشات القديمة عند التحديث
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. مستمع الـ Fetch (الشرط الجوهري لتحويل الاختصار Shortcut إلى تطبيق مثبت)
self.addEventListener('fetch', (event) => {
  // تمرير الطلبات بشكل طبيعي مع دعم بسيط للكاش عند انقطاع الشبكة
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// --- 🔔 كود الإشعارات الخاص بك (تم الحفاظ عليه كما هو) ---

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    // الأيقونة الافتراضية
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
  }
});

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

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
