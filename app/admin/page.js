"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase"; 
import { ref, onValue, update, remove, query } from "firebase/database";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null); // للتحكم في رسالة التثبيت
  const audioRef = useRef(null);
  const lastOrderCount = useRef(0);

  useEffect(() => {
    setIsClient(true);
    
    // 1. طلب إذن الإشعارات
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.permission !== "denied" && Notification.requestPermission();
    }

    // 2. منطق تثبيت التطبيق (Install Prompt)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const ordersRef = query(ref(db, 'orders'));
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(id => ({
          id,
          ...data[id]
        })).reverse();

        // اكتشاف الأوردر الجديد وتشغيل التنبيه
        if (lastOrderCount.current !== 0 && orderList.length > lastOrderCount.current) {
          handleNewOrderNotification(orderList[0]);
        }
        
        setOrders(orderList);
        lastOrderCount.current = orderList.length;
      } else {
        setOrders([]);
        lastOrderCount.current = 0;
      }
    });

    return () => unsubscribe();
  }, [orders.length]);

  // دالة تثبيت التطبيق
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
    }
  };

  const handleNewOrderNotification = (order) => {
    // تشغيل الصوت (يجب أن يكون قد تم تفعيله بالضغط أولاً)
    if (audioRef.current && audioEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log("الصوت محجوب"));
    }

    // إشعار النظام المتقدم
    if ("Notification" in window && Notification.permission === "granted") {
      const n = new Notification("🚀 طلب جديد في ميني طلبات", {
        body: `العميل: ${order.customer?.name} \nالإجمالي: ${order.total} ج.م`,
        icon: "/favicon.ico",
        tag: "admin-notify",
        requireInteraction: true, // يظل الإشعار ثابتاً حتى تفتحه
        vibrate: [200, 100, 200]
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
    msg += `*━━━━━━━━━━━━━━*\n`;
    msg += `*🧾 فاتورة رقم: #${order.invoiceRef}*\n`;
    msg += `*📅 التاريخ: ${date}*\n`;
    msg += `*⏰ الوقت: ${time}*\n`;
    msg += `*👤 العميل:* ${order.customer?.name}\n`;
    msg += `*📞 الهاتف:* ${order.customer?.phone}\n`;
    msg += `*🏠 العنوان:* ${order.customer?.address}\n`;
    if (order.location) msg += `*📍 الموقع:* ${order.location}\n`;
    msg += `*━━━━━━━━━━━━━━*\n`;
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
    <div dir="rtl" style={{ backgroundColor: "#0b0c0d", minHeight: "100vh", color: "#ffffff", padding: "15px", fontFamily: "sans-serif", pb: "50px" }}>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" loop={false} />

      {/* 1. تنبيه تفعيل الصوت + رسالة التثبيت كتطبيق */}
      <div style={{ position: "sticky", top: "10px", zIndex: 110, display: "flex", flexDirection: "column", gap: "10px" }}>
        {!audioEnabled && (
          <div 
            style={{ backgroundColor: "#FF6600", color: "#000", padding: "12px", borderRadius: "15px", textAlign: "center", fontWeight: "bold", cursor: "pointer", boxShadow: "0 5px 15px rgba(255,102,0,0.3)" }} 
            onClick={() => { audioRef.current.play(); audioRef.current.pause(); setAudioEnabled(true); }}
          >
            🔔 اضغط لتفعيل صوت التنبيهات
          </div>
        )}

        {deferredPrompt && (
          <div 
            style={{ backgroundColor: "#007bff", color: "#fff", padding: "12px", borderRadius: "15px", textAlign: "center", fontWeight: "bold", cursor: "pointer", boxShadow: "0 5px 15px rgba(0,123,255,0.3)" }} 
            onClick={handleInstallApp}
          >
            📲 تثبيت لوحة الإدارة كتطبيق
          </div>
        )}
      </div>

      {/* 2. الهيدر مع العداد الذكي */}
      <header style={{ position: "sticky", top: 0, backgroundColor: "rgba(11, 12, 13, 0.95)", zIndex: 100, padding: "15px 0", borderBottom: "1px solid #1e2022", marginBottom: "20px", marginTop: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ color: "#FF6600", margin: 0, fontSize: "20px", fontWeight: "900" }}>لوحة التحكم 🛡️</h1>
            <p style={{ color: "#555", fontSize: "11px", margin: 0 }}>ميني طلبات - الإدارة</p>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>{orders.length}</div>
            <div style={{ fontSize: "9px", color: "#4caf50", fontWeight: "bold" }}>أوردر نشط ●</div>
          </div>
        </div>
      </header>

      {/* 3. عرض الطلبات */}
      <div style={{ display: "grid", gap: "20px" }}>
        {orders.map((order) => (
          <div key={order.id} style={{ 
            backgroundColor: "#16181a", borderRadius: "25px", border: `1px solid ${order.status === 'completed' ? '#2e7d32' : '#25282b'}`, 
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)", overflow: "hidden", transition: "all 0.3s" 
          }}>
            
            {/* بار الحالة والوقت */}
            <div style={{ backgroundColor: "#1e2124", padding: "10px 20px", display: "flex", justifyContent: "space-between", fontSize: "11px", borderBottom: "1px solid #25282b" }}>
              <span style={{ color: "#FF6600", fontWeight: "bold" }}>#{order.invoiceRef}</span>
              <span style={{ color: "#888" }}>{order.orderTime} | {order.orderDate}</span>
            </div>

            <div style={{ padding: "20px" }}>
              {/* بيانات العميل وأزرار التواصل السريع */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "18px", color: "#fff" }}>{order.customer?.name}</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#aaa" }}>🏠 {order.customer?.address}</p>
                </div>
                {/* أزرار الاتصال واللوكيشن - واضحة جداً */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <a href={`tel:${order.customer?.phone}`} style={{ textDecoration: "none", backgroundColor: "#007bff20", padding: "12px", borderRadius: "18px", border: "1px solid #007bff40", fontSize: "18px" }}>📞</a>
                  {order.location && (
                    <a href={order.location} target="_blank" rel="noreferrer" style={{ textDecoration: "none", backgroundColor: "#dc354520", padding: "12px", borderRadius: "18px", border: "1px solid #dc354540", fontSize: "18px" }}>📍</a>
                  )}
                </div>
              </div>

              {/* تفاصيل المتاجر والأصناف */}
              <div style={{ backgroundColor: "#0b0c0d", borderRadius: "20px", padding: "15px", border: "1px solid #1e2022" }}>
                {Object.keys(order.items || {}).map((shopName) => (
                  <div key={shopName} style={{ marginBottom: "15px", borderBottom: "1px solid #1e2022", paddingBottom: "15px", lastChild: { borderBottom: "none" } }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#eee" }}>🏪 {shopName}</span>
                      {/* زرار واتساب المتجر */}
                      <button 
                        onClick={() => distributeOrder(order, shopName)} 
                        style={{ backgroundColor: "#25d366", color: "#fff", border: "none", padding: "6px 15px", borderRadius: "10px", fontSize: "10px", fontWeight: "bold", boxShadow: "0 3px 10px rgba(37,211,102,0.2)" }}
                      >
                        ارسال واتساب
                      </button>
                    </div>
                    {order.items[shopName].map((item, i) => (
                      <div key={i} style={{ fontSize: "12px", color: "#ccc", display: "flex", justifyContent: "space-between", backgroundColor: "#16181a", padding: "6px 10px", borderRadius: "8px", marginBottom: "4px" }}>
                        <span>{item.name} <b style={{ color: "#FF6600" }}>×{item.quantity}</b></span>
                        <span style={{ color: "#888" }}>{item.price * item.quantity} ج</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* الإجمالي */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", padding: "0 5px" }}>
                <span style={{ fontSize: "14px", color: "#888" }}>إجمالي الفاتورة:</span>
                <span style={{ fontSize: "22px", fontWeight: "900", color: "#FF6600" }}>{order.total} <small style={{ fontSize: "12px" }}>ج.م</small></span>
              </div>
            </div>

            {/* أزرار الأكشن السفلية */}
            <div style={{ display: "flex", gap: "1px", backgroundColor: "#25282b", borderTop: "1px solid #25282b" }}>
              <button 
                onClick={() => deleteOrder(order.id)} 
                style={{ flex: 1, padding: "18px", backgroundColor: "#16181a", color: "#ff4444", border: "none", fontSize: "12px", fontWeight: "bold" }}
              >
                حذف 🗑️
              </button>
              <button 
                onClick={() => toggleStatus(order.id, order.status)} 
                style={{ 
                  flex: 2, padding: "18px", 
                  backgroundColor: order.status === 'completed' ? "#1e2124" : "#FF6600", 
                  color: order.status === 'completed' ? "#4caf50" : "#000", 
                  border: "none", fontSize: "13px", fontWeight: "bold" 
                }}
              >
                {order.status === 'completed' ? 'مكتمل ✅ (تراجع؟)' : 'تحديد كمكتمل ✅'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
