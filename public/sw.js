// 1. استلام إشعار الـ Push من السيرفر (لو مستقبلاً فعلت Firebase Cloud Messaging)
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/adminMT.png',
      badge: '/adminMT.png', // الأيقونة الصغيرة اللي بتظهر فوق في الموبايل
      vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40], // نمط هزاز قوي
      tag: 'admin-new-order', // عشان لو فيه كذا أوردر يظهر أحدث واحد بس ميملاش الستارة
      renotify: true, // يخلي الموبايل يتهز مع كل أوردر جديد حتى لو الإشعار القديم موجود
      requireInteraction: true, // الإشعار يفضل موجود وميختفيش لوحده أبداً
      data: { url: data.url || '/admin' }
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "🔔 أوردر جديد - ميني طلبات", options)
    );
  }
});

// 2. التعامل مع الضغط على الإشعار
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // قفل الإشعار بمجرد الضغط عليه

  // محاولة فتح التطبيق أو التركيز على الصفحة المفتوحة فعلياً
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // لو الأبلكيشن مفتوح أصلاً، نركز عليه (Focus)
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      // لو مش مفتوح، نفتح نافذة جديدة
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/admin');
      }
    })
  );
});

// 3. مستمع لرسائل الـ Frontend (اختياري لربط الصوت مستقبلاً)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
