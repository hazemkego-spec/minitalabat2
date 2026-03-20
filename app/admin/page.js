"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase"; 
import { ref, onValue, update, remove, offset, limitToLast, query } from "firebase/database";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef(null);
  const lastOrderCount = useRef(0);

  useEffect(() => {
    setIsClient(true);
    // طلب إذن الإشعارات
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // استعلام لجلب الأوردرات مع التأكد من التحديث اللحظي
    const ordersRef = query(ref(db, 'orders'));
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(id => ({
          id,
          ...data[id]
        })).reverse();

        // اكتشاف الأوردر الجديد حتى والصفحة في الخلفية
        if (lastOrderCount.current !== 0 && orderList.length > lastOrderCount.current) {
          handleNewOrderNotification(orderList[0]);
        }
        
        setOrders(orderList);
        lastOrderCount.current = orderList.length;
      } else {
        setOrders([]);
        lastOrderCount.current = 0;
      }
    }, (error) => {
      console.error("Firebase Connection Error:", error);
      // محاولة إعادة الاتصال بعد 5 ثواني لو حصل فصل
      setTimeout(() => window.location.reload(), 5000);
    });

    return () => unsubscribe();
  }, []);

  const handleNewOrderNotification = (order) => {
    // 1. تشغيل الصوت (يعمل فقط لو المستخدم ضغط على أي زرار في الصفحة أول ما فتح)
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log("Audio play blocked by browser"));
    }

    // 2. إشعار النظام (يعمل في الخلفية)
    if ("Notification" in window && Notification.permission === "granted") {
      const n = new Notification("🚨 طلب جديد مستعجل!", {
        body: `العميل: ${order.customer?.name}\nالحساب: ${order.total} ج.م`,
        tag: "new-order", // لمنع تكرار الإشعارات
        requireInteraction: true // يخلي الإشعار ميفضلش موجود لحد ما تقفله
      });
      n.onclick = () => {
        window.focus();
        n.close();
      };
    }
  };

  const toggleStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await update(ref(db, `orders/${orderId}`), { status: newStatus });
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("حذف الأوردر ده نهائياً؟")) {
      await remove(ref(db, `orders/${orderId}`));
    }
  };

  const distributeOrder = (order, shopName) => {
    const items = order.items[shopName];
    let msg = `*📦 طلب جديد - ميني طلبات*\n*🧾 #${order.invoiceRef}*\n*👤 العميل:* ${order.customer?.name}\n*📞 ${order.customer?.phone}*\n*🏠 ${order.customer?.address}*\n*🛒 متجر: ${shopName}*\n\n`;
    items.forEach(item => msg += `• ${item.name} (${item.quantity})\n`);
    msg += `\n*💰 المطلوب: ${order.total} ج.م*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!isClient) return null;

  return (
    <div dir="rtl" style={{ backgroundColor: "#0b0c0d", minHeight: "100vh", color: "#ffffff", padding: "15px", fontFamily: "sans-serif" }}>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" loop={false} />

      {/* تنبيه تفعيل الصوت - ضروري جداً للمتصفحات */}
      {!audioEnabled && (
        <div style={{ backgroundColor: "#FF6600", color: "#000", padding: "10px", borderRadius: "10px", textAlign: "center", marginBottom: "15px", fontWeight: "bold", cursor: "pointer" }} 
             onClick={() => { audioRef.current.play(); audioRef.current.pause(); setAudioEnabled(true); }}>
          اضغط هنا لتفعيل صوت التنبيهات 🔔
        </div>
      )}

      <header style={{ position: "sticky", top: 0, backgroundColor: "rgba(11, 12, 13, 0.95)", zIndex: 100, padding: "10px 0", borderBottom: "1px solid #1e2022", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ color: "#FF6600", margin: 0, fontSize: "20px", fontWeight: "900" }}>لوحة التحكم 🛡️</h1>
          <div style={{ fontSize: "12px", color: audioEnabled ? "#4caf50" : "#ff4444" }}>
            {audioEnabled ? "النظام جاهز ●" : "الصوت معطل ✖"}
          </div>
        </div>
      </header>

      <div style={{ display: "grid", gap: "15px" }}>
        {orders.map((order) => (
          <div key={order.id} style={{ backgroundColor: "#16181a", borderRadius: "20px", border: `1px solid ${order.status === 'completed' ? '#2e7d32' : '#25282b'}`, overflow: "hidden" }}>
            <div style={{ backgroundColor: "#1e2124", padding: "10px 15px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: "#FF6600", fontWeight: "bold" }}>#{order.invoiceRef}</span>
              <span>{order.orderTime} | {order.orderDate}</span>
            </div>

            <div style={{ padding: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0", fontSize: "16px" }}>{order.customer?.name}</h3>
                  <p style={{ margin: "5px 0", fontSize: "12px", color: "#aaa" }}>📍 {order.customer?.address}</p>
                  <p style={{ margin: "0", fontSize: "13px", color: "#FF6600" }}>📞 {order.customer?.phone}</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <a href={`tel:${order.customer?.phone}`} style={{ backgroundColor: "#007bff20", padding: "10px", borderRadius: "12px", border: "1px solid #007bff40", textDecoration: "none" }}>📞</a>
                  {order.location && <a href={order.location} target="_blank" style={{ backgroundColor: "#dc354520", padding: "10px", borderRadius: "12px", border: "1px solid #dc354540", textDecoration: "none" }}>📍</a>}
                </div>
              </div>

              <div style={{ backgroundColor: "#0b0c0d", borderRadius: "15px", padding: "10px", border: "1px solid #1e2022" }}>
                {Object.keys(order.items || {}).map((shopName) => (
                  <div key={shopName} style={{ marginBottom: "10px", borderBottom: "1px solid #1e2022", paddingBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "bold" }}>🏪 {shopName}</span>
                      <button onClick={() => distributeOrder(order, shopName)} style={{ backgroundColor: "#25d366", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "8px", fontSize: "10px" }}>WhatsApp</button>
                    </div>
                    {order.items[shopName].map((item, i) => (
                      <div key={i} style={{ fontSize: "11px", color: "#ccc", display: "flex", justifyContent: "space-between" }}>
                        <span>{item.name} × {item.quantity}</span>
                        <span>{item.price * item.quantity} ج</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", fontWeight: "bold" }}>
                <span style={{ color: "#888" }}>الإجمالي:</span>
                <span style={{ color: "#FF6600", fontSize: "18px" }}>{order.total} ج.م</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1px", backgroundColor: "#25282b" }}>
              <button onClick={() => deleteOrder(order.id)} style={{ flex: 1, padding: "12px", backgroundColor: "#16181a", color: "#ff4444", border: "none", fontSize: "11px" }}>حذف 🗑️</button>
              <button onClick={() => toggleStatus(order.id, order.status)} style={{ flex: 2, padding: "12px", backgroundColor: order.status === 'completed' ? "#1e2124" : "#FF6600", color: order.status === 'completed' ? "#4caf50" : "#000", border: "none", fontSize: "11px", fontWeight: "bold" }}>
                {order.status === 'completed' ? 'مكتمل ✅ (تراجع؟)' : 'تحديد كمكتمل ✅'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
