// ✅ اسم الكاش الموحد
const CACHE_NAME = 'minitalabat-v2026-core';

// 1. التثبيت الأولي (ضروري لتحويل الموقع إلى App حقيقي)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // كاش لصفحة البداية والأيقونات الأساسية لضمان عمل الـ Install
      return cache.addAll(['/', '/admin', '/shop-admin']);
    })
  );
});

// 2. تنظيف الكاشات القديمة
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

// 3. معالجة الطلبات (Fetch) - الركن الأساسي للـ PWA
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// --- 🔔 محرك الإشعارات المطور مع دعم الصوت والعمل في الخلفية ---

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    // تحديد الأيقونة بناءً على نوع الإشعار (إدارة أو متجر)
    const notificationIcon = data.icon || '/adminMT.webp';

    const options = {
      title: data.title || "🔔 أوردر جديد",
      body: data.body || "لديك طلب جديد يحتاج للمراجعة",
      icon: notificationIcon,
      badge: notificationIcon, 
      vibrate: [500, 110, 500, 110, 450, 110, 200, 110],
      tag: data.tag || 'order-notification',
      renotify: true, 
      requireInteraction: true, // يظل الإشعار ظاهراً حتى يتفاعل معه المستخدم
      data: { 
        url: data.url || (data.shopId ? `/shop-admin/${data.shopId}` : '/admin') 
      },
      // ملاحظة: المتصفحات الحديثة تشغل صوت التنبيه الافتراضي للنظام مع الاهتزاز
      // لتشغيل صوت مخصص، نعتمد على برمجية داخل صفحة الإدارة (سأوضحها لك)
    };

  event.waitUntil(
      self.registration.showNotification(options.title, options)
    );
  }
});

// التعامل مع الضغط على الإشعار
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // إذا كان الأبلكيشن مفتوحاً بالفعل، قم بالتركيز عليه (Focus)
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // إذا كان مغلقاً، افتحه في نافذة جديدة
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
