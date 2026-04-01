// ✅ اسم الكاش لتمييز نسخة الإدارة
const ADMIN_CACHE = 'admin-pwa-v20';

// 1. التثبيت وفتح الكاش (إلزامي لظهور زر Install)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(ADMIN_CACHE).then((cache) => {
      // كاش لصفحة البداية فقط لإرضاء معايير PWA
      return cache.addAll(['/']);
    })
  );
});

// 2. تفعيل وتنظيف الكاشات القديمة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== ADMIN_CACHE) return caches.delete(key);
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. مستمع الـ Fetch (الشرط الأساسي لتحويل الاختصار إلى تطبيق)
self.addEventListener('fetch', (event) => {
  // تمرير الطلبات بشكل طبيعي مع دعم بسيط للأوفلاين
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// --- 🔔 كود الإشعارات (معدل لضمان الأداء) ---

self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      // تأكيد رابط الأيقونة من السيرفر الرئيسي لضمان الظهور
      const shopLogo = data.icon || 'https://minitalabat2.vercel.app/adminMT.webp';

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
