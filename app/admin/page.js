"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase"; 
import { ref, onValue, update, remove, query } from "firebase/database";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const audioRef = useRef(null);
  const ordersCountRef = useRef(0);

  // 1. منطق التشغيل الأول + استعادة الإعدادات + تسجيل الـ SW
  useEffect(() => {
    setIsClient(true);
    
    // استعادة حالة الصوت المحفوظة
    const savedAudio = localStorage.getItem("adminAudioEnabled");
    if (savedAudio === "true") {
      setAudioEnabled(true);
    }

    if (typeof window !== "undefined") {
      // تسجيل الـ Service Worker لضمان عمل الإشعارات في الخلفية
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('Admin SW Registered!'))
          .catch(err => console.log('SW Registration Failed', err));
      }

      // إزالة المانيفست القديم وربط الجديد المخصص للإدارة
      const oldManifests = document.querySelectorAll('link[rel="manifest"]');
      oldManifests.forEach(el => el.remove());

      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = `/admin.webmanifest?v=${Date.now()}`; 
      document.head.appendChild(link);

      document.title = "لوحة الإدارة 🛡️";
      let themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute("content", "#0b0c0d");
    }

    // طلب إذن الإشعارات إذا لم يتم منحه
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  // 2. الربط اللحظي بـ Firebase (تم تحسينه للعمل الدائم بدون ريفريش)
  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    
    // نترك مصفوفة التبعية فارغة [] لضمان بقاء الاتصال مفتوحاً دائماً
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(id => ({
          id, ...data[id]
        })).reverse();

        // تنبيه عند وصول أوردر جديد (مقارنة بالعدد المخزن)
        if (ordersCountRef.current !== 0 && orderList.length > ordersCountRef.current) {
          handleNewOrderNotification(orderList[0]);
        }
        setOrders(orderList);
        ordersCountRef.current = orderList.length;
      } else {
        setOrders([]);
        ordersCountRef.current = 0;
      }
    });

    return () => unsubscribe();
  }, []); 

  // 3. دالة التثبيت
  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  // 4. دالة التنبيه (الصوت + الإشعار) مع حفظ حالة الصوت
  const handleNewOrderNotification = (order) => {
    // قراءة الحالة اللحظية من الـ State لضمان التشغيل
    if (audioRef.current && (audioEnabled || localStorage.getItem("adminAudioEnabled") === "true")) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => console.log("Audio play blocked"));
    }

    if ("Notification" in window && Notification.permission === "granted") {
      const n = new Notification("🔔 أوردر جديد وصل!", {
        body: `العميل: ${order.customer?.name} | المبلغ: ${order.total} ج.م`,
        icon: "/adminMT.png",
        tag: "admin-new-order", 
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });
      n.onclick = () => { window.focus(); n.close(); };
    }
  };

  // 5. دالة تفعيل الصوت وحفظ الاختيار (تُستدعى عند الضغط على الزر)
  const toggleAudioSystem = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setAudioEnabled(true);
        localStorage.setItem("adminAudioEnabled", "true");
        alert("✅ تم تفعيل التنبيهات الصوتية دائماً");
      }).catch(() => alert("يرجى المحاولة مرة أخرى"));
    }
  };

    // 5. التحكم في حالة الطلب (مكتمل / قيد الانتظار)
  const toggleStatus = async (orderId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await update(ref(db, `orders/${orderId}`), { status: newStatus });
    } catch (err) {
      console.error("Update Status Error:", err);
    }
  };

  // 6. حذف الطلب
  const deleteOrder = async (orderId) => {
    if (window.confirm("⚠️ هل أنت متأكد من حذف هذا الطلب نهائياً؟")) {
      try {
        await remove(ref(db, `orders/${orderId}`));
      } catch (err) {
        console.error("Delete Order Error:", err);
      }
    }
  };

  // 7. توزيع الطلب للواتساب
  const distributeOrder = (order, shopName) => {
    const items = order.items[shopName];
    if (!items) return;

    let msg = `*📦 طلب جديد - ميني طلبات*\n`;
    msg += `*🧾 فاتورة رقم: #${order.invoiceRef}*\n`;
    msg += `*👤 العميل:* ${order.customer?.name}\n`;
    msg += `*📞 الهاتف:* ${order.customer?.phone}\n`;
    msg += `*🛒 متجر: ${shopName}*\n\n`;
    
    let shopTotal = 0;
    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      shopTotal += itemTotal;
      msg += `• ${item.name} (${item.quantity}) = ${itemTotal} ج\n`;
    });
    
    msg += `\n*💰 المطلوب تحصيله: ${shopTotal} ج.م*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!isClient) return null;

  return (
    <div dir="rtl" style={{ backgroundColor: "#0b0c0d", minHeight: "100vh", color: "#ffffff", padding: "15px", fontFamily: "sans-serif", paddingBottom: "80px" }}>
      
      {/* ملف الصوت */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* 2. أزرار الأكشن (تفعيل الصوت + التثبيت) */}
      <div style={{ position: "sticky", top: "10px", zIndex: 110, display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
        {!audioEnabled && (
          <div 
            style={{ 
              backgroundColor: "#FF6600", color: "#000", padding: "15px", borderRadius: "18px", 
              textAlign: "center", fontWeight: "900", cursor: "pointer", 
              boxShadow: "0 8px 20px rgba(255,102,0,0.4)", border: "2px solid rgba(255,255,255,0.2)" 
            }} 
            onClick={() => { 
              if(audioRef.current) {
                audioRef.current.play().then(() => {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                  setAudioEnabled(true);
                  alert("✅ تم تفعيل التنبيهات الصوتية للإدارة");
                }).catch(() => alert("يرجى الضغط مرة أخرى لتفعيل الصوت"));
              }
            }}
          >
            🔔 تفعيل تنبيهات الإدارة 🛡️
          </div>
        )}

        {deferredPrompt && (
          <div 
            style={{ 
              backgroundColor: "#1a73e8", color: "#fff", padding: "12px", borderRadius: "15px", 
              textAlign: "center", fontWeight: "bold", cursor: "pointer", 
              boxShadow: "0 5px 15px rgba(26,115,232,0.3)", border: "1px solid rgba(255,255,255,0.1)" 
            }} 
            onClick={handleInstallApp}
          >
            📲 تثبيت لوحة الإدارة (منفصل)
          </div>
        )}
      </div>

      {/* 3. الهيدر */}
      <header style={{ position: "sticky", top: 0, backgroundColor: "rgba(11, 12, 13, 0.95)", zIndex: 100, padding: "15px 0", borderBottom: "1px solid #1e2022", marginBottom: "25px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ color: "#FF6600", margin: 0, fontSize: "24px", fontWeight: "900" }}>لوحة التحكم 🛡️</h1>
            <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>متابعة الطلبات لحظياً</p>
          </div>
          <div style={{ textAlign: "center", backgroundColor: "#1a1c1e", padding: "10px 20px", borderRadius: "15px", border: "1px solid #2d3035" }}>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#4caf50" }}>{orders.length}</div>
            <div style={{ fontSize: "10px", color: "#888" }}>طلب نشط</div>
          </div>
        </div>
      </header>

      {/* 4. عرض الطلبات */}
      <div style={{ display: "grid", gap: "25px" }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#444" }}>لا توجد طلبات حالياً..</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{ 
              backgroundColor: "#16181a", borderRadius: "30px", border: `2px solid ${order.status === 'completed' ? '#2e7d32' : '#25282b'}`, 
              boxShadow: "0 15px 35px rgba(0,0,0,0.6)", overflow: "hidden" 
            }}>
              <div style={{ backgroundColor: "#1e2124", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "#FF6600", fontWeight: "900" }}>فاتورة #{order.invoiceRef}</span>
                <span style={{ color: "#aaa" }}>{order.orderTime} | {order.orderDate}</span>
              </div>

              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", color: "#fff" }}>{order.customer?.name}</h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>📍 {order.customer?.address}</p>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <a href={`tel:${order.customer?.phone}`} style={{ textDecoration: "none", backgroundColor: "#28a745", color: "#fff", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "15px", fontSize: "20px" }}>📞</a>
                    {order.location && (
                      <a href={order.location} target="_blank" rel="noreferrer" style={{ textDecoration: "none", backgroundColor: "#007bff", color: "#fff", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "15px", fontSize: "20px" }}>📍</a>
                    )}
                  </div>
                </div>

                <div style={{ backgroundColor: "#0b0c0d", borderRadius: "20px", padding: "15px" }}>
                  {Object.keys(order.items || {}).map((shopName) => (
                    <div key={shopName} style={{ marginBottom: "15px", borderBottom: "1px solid #1e2022", paddingBottom: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold", color: "#FF6600" }}>🏪 {shopName}</span>
                        <button onClick={() => distributeOrder(order, shopName)} style={{ backgroundColor: "#25d366", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "8px", fontSize: "10px", fontWeight: "900" }}>إرسال ✅</button>
                      </div>
                      {order.items[shopName].map((item, i) => (
                        <div key={i} style={{ fontSize: "13px", color: "#ddd", display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                          <span>{item.name} <b>×{item.quantity}</b></span>
                          <span>{item.price * item.quantity} ج</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                  <span style={{ color: "#888" }}>الإجمالي:</span>
                  <span style={{ fontSize: "22px", fontWeight: "900", color: "#FF6600" }}>{order.total} ج.م</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1px", backgroundColor: "#25282b" }}>
                <button onClick={() => deleteOrder(order.id)} style={{ flex: 1, padding: "15px", backgroundColor: "#16181a", color: "#ff4444", border: "none", fontWeight: "bold" }}>حذف 🗑️</button>
                <button onClick={() => toggleStatus(order.id, order.status)} style={{ flex: 2, padding: "15px", backgroundColor: order.status === 'completed' ? "#1e2124" : "#FF6600", color: order.status === 'completed' ? "#4caf50" : "#000", border: "none", fontWeight: "900" }}>
                  {order.status === 'completed' ? 'مكتمل ✅' : 'تحديد كمكتمل'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
