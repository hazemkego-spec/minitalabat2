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

  useEffect(() => {
    setIsClient(true);
    
    // 1. طلب إذن الإشعارات فوراً
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // 2. منطق الـ PWA - التقاط رسالة التثبيت
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  // 3. الربط اللحظي المحسن مع نظام "إعادة المحاولة"
  useEffect(() => {
    let unsubscribe;
    const connectToFirebase = () => {
      const ordersRef = query(ref(db, 'orders'));
      
      unsubscribe = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const orderList = Object.keys(data).map(id => ({
            id,
            ...data[id]
          })).reverse();

          // كشف الأوردر الجديد بدقة
          if (ordersCountRef.current !== 0 && orderList.length > ordersCountRef.current) {
            handleNewOrderNotification(orderList[0]);
          }
          
          setOrders(orderList);
          ordersCountRef.current = orderList.length;
        } else {
          setOrders([]);
          ordersCountRef.current = 0;
        }
      }, (error) => {
        console.error("Firebase Sync Error. Retrying in 5s...", error);
        setTimeout(connectToFirebase, 5000); // إعادة محاولة الاتصال تلقائياً
      });
    };

    connectToFirebase();
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
    }
  };

  // دالة التنبيه المحسنة - حل مشكلة الصوت
  const handleNewOrderNotification = (order) => {
    if (audioRef.current && audioEnabled) {
      // إجبار المتصفح على إعادة تحميل الملف وتشغيله
      audioRef.current.pause();
      audioRef.current.load(); // مهم جداً لإعادة "تنشيط" الملف
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log("Audio play blocked. Browser needs interaction.");
        });
      }
    }

    if ("Notification" in window && Notification.permission === "granted") {
      const n = new Notification("🔔 أوردر جديد وصل!", {
        body: `العميل: ${order.customer?.name}\nالمبلغ: ${order.total} ج.م`,
        icon: "/favicon.ico",
        tag: "admin-order-alert", // يمنع تكرار نفس الإشعار
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 400]
      });
      n.onclick = () => { window.focus(); n.close(); };
    }
  };

  const toggleStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await update(ref(db, `orders/${orderId}`), { status: newStatus });
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) {
      await remove(ref(db, `orders/${orderId}`));
    }
  };

  const distributeOrder = (order, shopName) => {
    const items = order.items[shopName];
    const date = order.orderDate || "---";
    const time = order.orderTime || "---";

    let msg = `*📦 طلب جديد - ميني طلبات*\n`;
    msg += `*🧾 #${order.invoiceRef}*\n`;
    msg += `*👤 العميل:* ${order.customer?.name}\n`;
    msg += `*📞 الهاتف:* ${order.customer?.phone}\n`;
    msg += `*🛒 متجر: ${shopName}*\n\n`;
    
    let shopTotal = 0;
    items.forEach(item => {
      const total = item.price * item.quantity;
      shopTotal += total;
      msg += `• ${item.name} (${item.quantity}) = ${total} ج\n`;
    });
    
    msg += `\n*💰 المطلوب: ${shopTotal} ج.م*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!isClient) return null;

            return (
    <div dir="rtl" style={{ backgroundColor: "#0b0c0d", minHeight: "100vh", color: "#ffffff", padding: "15px", fontFamily: "sans-serif", paddingBottom: "80px" }}>
      {/* تأكد أن ملف الصوت في فولدر public باسم notification.mp3 */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" loop={false} />

      {/* 1. أزرار الأكشن العلوية (تفعيل الصوت + تثبيت التطبيق) */}
      <div style={{ position: "sticky", top: "10px", zIndex: 110, display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
        {!audioEnabled && (
          <div 
            style={{ backgroundColor: "#FF6600", color: "#000", padding: "15px", borderRadius: "18px", textAlign: "center", fontWeight: "900", cursor: "pointer", boxShadow: "0 8px 20px rgba(255,102,0,0.4)", border: "2px solid #fff" }} 
            onClick={() => { 
              if(audioRef.current) {
                // تفعيل الصوت من خلال تشغيل صامت وسريع لفك حظر المتصفح
                audioRef.current.play().then(() => {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                  setAudioEnabled(true);
                  alert("✅ تم تفعيل التنبيهات الصوتية");
                }).catch(err => alert("يرجى المحاولة مرة أخرى لتفعيل الصوت"));
              }
            }}
          >
            🔔 اضغط هنا لتفعيل صوت التنبيهات
          </div>
        )}

        {deferredPrompt && (
          <div 
            style={{ backgroundColor: "#007bff", color: "#fff", padding: "12px", borderRadius: "15px", textAlign: "center", fontWeight: "bold", cursor: "pointer", boxShadow: "0 5px 15px rgba(0,123,255,0.3)" }} 
            onClick={handleInstallApp}
          >
            📲 تثبيت لوحة الإدارة (تطبيق)
          </div>
        )}
      </div>

      {/* 2. الهيدر المطور مع العداد اللحظي */}
      <header style={{ position: "sticky", top: 0, backgroundColor: "rgba(11, 12, 13, 0.95)", zIndex: 100, padding: "15px 0", borderBottom: "1px solid #1e2022", marginBottom: "25px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ color: "#FF6600", margin: 0, fontSize: "24px", fontWeight: "900", letterSpacing: "-1px" }}>لوحة التحكم 🛡️</h1>
            <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>متابعة الطلبات لحظياً</p>
          </div>
          {/* عداد الأوردرات اللحظي */}
          <div style={{ textAlign: "center", backgroundColor: "#1a1c1e", padding: "10px 20px", borderRadius: "15px", border: "1px solid #2d3035" }}>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#4caf50", lineHeight: "1" }}>{orders.length}</div>
            <div style={{ fontSize: "10px", color: "#888", marginTop: "5px" }}>طلب نشط</div>
          </div>
        </div>
      </header>

      {/* 3. قائمة الطلبات */}
      <div style={{ display: "grid", gap: "25px" }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#444" }}>لا توجد طلبات حالياً..</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{ 
              backgroundColor: "#16181a", borderRadius: "30px", border: `2px solid ${order.status === 'completed' ? '#2e7d32' : '#25282b'}`, 
              boxShadow: "0 15px 35px rgba(0,0,0,0.6)", overflow: "hidden" 
            }}>
              
              {/* شريط معلومات الفاتورة */}
              <div style={{ backgroundColor: "#1e2124", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: "12px", borderBottom: "1px solid #25282b" }}>
                <span style={{ color: "#FF6600", fontWeight: "900" }}>فاتورة #{order.invoiceRef}</span>
                <span style={{ color: "#aaa" }}>{order.orderTime} | {order.orderDate}</span>
              </div>

              <div style={{ padding: "20px" }}>
                {/* بيانات العميل وأزرار التواصل الضخمة */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", color: "#fff", fontWeight: "bold" }}>{order.customer?.name}</h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>📍 {order.customer?.address}</p>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    {/* زر اتصال العميل */}
                    <a href={`tel:${order.customer?.phone}`} style={{ textDecoration: "none", backgroundColor: "#28a745", color: "#fff", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "15px", fontSize: "20px", boxShadow: "0 4px 10px rgba(40,167,69,0.3)" }}>📞</a>
                    {/* زر لوكيشن العميل */}
                    {order.location && (
                      <a href={order.location} target="_blank" rel="noreferrer" style={{ textDecoration: "none", backgroundColor: "#007bff", color: "#fff", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "15px", fontSize: "20px", boxShadow: "0 4px 10px rgba(0,123,255,0.3)" }}>📍</a>
                    )}
                  </div>
                </div>

                {/* تفاصيل المتاجر داخل الأوردر */}
                <div style={{ backgroundColor: "#0b0c0d", borderRadius: "20px", padding: "15px", border: "1px solid #1e2022" }}>
                  {Object.keys(order.items || {}).map((shopName) => (
                    <div key={shopName} style={{ marginBottom: "15px", borderBottom: "1px solid #1e2022", paddingBottom: "15px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "15px", fontWeight: "bold", color: "#FF6600" }}>🏪 {shopName}</span>
                        {/* زر واتساب المتجر */}
                        <button 
                          onClick={() => distributeOrder(order, shopName)} 
                          style={{ backgroundColor: "#25d366", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "12px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}
                        >
                          إرسال للمتجر ✅
                        </button>
                      </div>
                      {order.items[shopName].map((item, i) => (
                        <div key={i} style={{ fontSize: "13px", color: "#ddd", display: "flex", justifyContent: "space-between", backgroundColor: "#16181a", padding: "8px 12px", borderRadius: "10px", marginBottom: "5px" }}>
                          <span>{item.name} <b style={{ color: "#FF6600" }}>×{item.quantity}</b></span>
                          <span style={{ color: "#aaa" }}>{item.price * item.quantity} ج</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* الإجمالي */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", padding: "0 5px" }}>
                  <span style={{ fontSize: "16px", color: "#888" }}>إجمالي الحساب:</span>
                  <span style={{ fontSize: "26px", fontWeight: "900", color: "#FF6600" }}>{order.total} <small style={{ fontSize: "14px" }}>ج.م</small></span>
                </div>
              </div>

              {/* أزرار الحالة والحذف */}
              <div style={{ display: "flex", gap: "2px", backgroundColor: "#25282b", borderTop: "1px solid #25282b" }}>
                <button 
                  onClick={() => deleteOrder(order.id)} 
                  style={{ flex: 1, padding: "20px", backgroundColor: "#16181a", color: "#ff4444", border: "none", fontSize: "13px", fontWeight: "bold" }}
                >
                  حذف 🗑️
                </button>
                <button 
                  onClick={() => toggleStatus(order.id, order.status)} 
                  style={{ 
                    flex: 2, padding: "20px", 
                    backgroundColor: order.status === 'completed' ? "#1e2124" : "#FF6600", 
                    color: order.status === 'completed' ? "#4caf50" : "#000", 
                    border: "none", fontSize: "14px", fontWeight: "900" 
                  }}
                >
                  {order.status === 'completed' ? 'مكتمل ✅' : 'تحديد كمكتمل ✅'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
