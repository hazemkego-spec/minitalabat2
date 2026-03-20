"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase"; 
import { ref, onValue, update, remove } from "firebase/database";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    // طلب إذن الإشعارات فور فتح الصفحة
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    let isFirstLoad = true;

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(id => ({
          id,
          ...data[id]
        })).reverse();

        // نظام التنبيه الذكي
        if (!isFirstLoad && orderList.length > orders.length) {
          const newOrder = orderList[0];
          playNotification(newOrder);
        }
        
        setOrders(orderList);
        isFirstLoad = false;
      }
    });

    return () => unsubscribe();
  }, [orders.length]);

  const playNotification = (order) => {
    // 1. تشغيل الصوت
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio Error:", err));
    }

    // 2. إرسال إشعار للنظام (يظهر حتى لو المتصفح في الخلفية)
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🚀 طلب جديد في ميني طلبات", {
        body: `العميل: ${order.customer?.name} - الإجمالي: ${order.total} ج.م`,
        icon: "/favicon.ico" // تأكد من وجود أيقونة
      });
    }
  };

  // تغيير حالة الطلب في Firebase
  const toggleStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await update(ref(db, `orders/${orderId}`), { status: newStatus });
  };

  // حذف الطلب نهائياً
  const deleteOrder = async (orderId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) {
      await remove(ref(db, `orders/${orderId}`));
    }
  };

  const distributeOrder = (order, shopName) => {
    const items = order.items[shopName];
    const date = order.orderDate || "---";
    const time = order.orderTime || "---";

    let msg = `*📦 طلب جديد من ميني طلبات*\n`;
    msg += `*━━━━━━━━━━━━━━*\n`;
    msg += `*🧾 فاتورة رقم: #${order.invoiceRef}*\n`;
    msg += `*📅 التاريخ: ${date}*\n`;
    msg += `*⏰ الوقت: ${time}*\n`;
    msg += `*👤 العميل:* ${order.customer?.name}\n`;
    msg += `*📞 الهاتف:* ${order.customer?.phone}\n`;
    msg += `*🏠 العنوان:* ${order.customer?.address}\n`;
    if (order.location) msg += `*📍 الموقع:* ${order.location}\n`;
    msg += `*━━━━━━━━━━━━━━*\n`;
    msg += `*🛒 طلبات متجر: ${shopName}*\n\n`;
    
    let shopTotal = 0;
    items.forEach(item => {
      const total = item.price * item.quantity;
      shopTotal += total;
      msg += `• ${item.name} (${item.quantity}) = ${total} ج.م\n`;
    });
    
    msg += `\n*💰 المطلوب تحصيله: ${shopTotal} ج.م*`;
    msg += `\n*━━━━━━━━━━━━━━*`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!isClient) return null;

  return (
    <div dir="rtl" style={{ backgroundColor: "#0b0c0d", minHeight: "100vh", color: "#ffffff", padding: "15px", fontFamily: "sans-serif" }}>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <header style={{ position: "sticky", top: 0, backgroundColor: "rgba(11, 12, 13, 0.95)", zIndex: 100, padding: "15px 0", borderBottom: "1px solid #1e2022", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ color: "#FF6600", margin: 0, fontSize: "22px", fontWeight: "900" }}>لوحة التحكم 🛡️</h1>
            <p style={{ color: "#666", fontSize: "12px", margin: "5px 0 0 0" }}>إجمالي العمليات: {orders.length}</p>
          </div>
          <div style={{ backgroundColor: "#1a1c1e", padding: "5px 12px", borderRadius: "20px", fontSize: "10px", color: "#4caf50", border: "1px solid #2d3035" }}>
            متصل مباشر ●
          </div>
        </div>
      </header>
      
      <div style={{ display: "grid", gap: "20px", paddingBottom: "50px" }}>
        {orders.map((order) => (
          <div key={order.id} style={{ backgroundColor: "#16181a", borderRadius: "25px", border: "1px solid #25282b", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", overflow: "hidden" }}>
            
            {/* بار الحالة العلوي */}
            <div style={{ backgroundColor: "#1e2124", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#FF6600", fontWeight: "bold", fontSize: "14px" }}>#{order.invoiceRef}</span>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "#888" }}>{order.orderTime}</span>
                <span style={{ 
                  backgroundColor: order.status === 'completed' ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 152, 0, 0.1)", 
                  color: order.status === 'completed' ? "#4caf50" : "#ff9800", 
                  padding: "4px 12px", borderRadius: "10px", fontSize: "10px", fontWeight: "bold" 
                }}>
                  {order.status === 'completed' ? 'مكتمل ✅' : 'انتظار ⏳'}
                </span>
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ margin: "0 0 5px 0", fontSize: "18px", color: "#fff" }}>{order.customer?.name}</h2>
                  <p style={{ margin: 0, fontSize: "13px", color: "#aaa" }}>📍 {order.customer?.address}</p>
                  <p style={{ margin: "5px 0 0 0", fontSize: "13px", color: "#FF6600", fontWeight: "bold" }}>📞 {order.customer?.phone}</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <a href={`tel:${order.customer?.phone}`} style={{ textDecoration: "none", backgroundColor: "#007bff20", padding: "12px", borderRadius: "15px", border: "1px solid #007bff40" }}>📞</a>
                  {order.location && (
                    <a href={order.location} target="_blank" style={{ textDecoration: "none", backgroundColor: "#dc354520", padding: "12px", borderRadius: "15px", border: "1px solid #dc354540" }}>📍</a>
                  )}
                </div>
              </div>

              <div style={{ backgroundColor: "#0b0c0d", borderRadius: "20px", padding: "15px", border: "1px solid #1e2022" }}>
                {Object.keys(order.items || {}).map((shopName) => (
                  <div key={shopName} style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#eee" }}>🏪 {shopName}</span>
                      <button onClick={() => distributeOrder(order, shopName)} style={{ backgroundColor: "#25d366", color: "#fff", border: "none", padding: "6px 15px", borderRadius: "10px", fontSize: "10px", fontWeight: "bold" }}>WhatsApp</button>
                    </div>
                    {order.items[shopName].map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", backgroundColor: "#16181a", borderRadius: "8px", marginBottom: "5px", fontSize: "12px" }}>
                        <span style={{ color: "#ccc" }}>{item.name} <b style={{ color: "#FF6600" }}>×{item.quantity}</b></span>
                        <span style={{ color: "#888" }}>{item.price * item.quantity} ج</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", padding: "15px 5px 0 5px", borderTop: "1px dashed #25282b" }}>
                <span style={{ fontSize: "14px", color: "#888" }}>إجمالي الحساب:</span>
                <span style={{ fontSize: "24px", fontWeight: "900", color: "#FF6600" }}>{order.total} <small style={{ fontSize: "12px" }}>ج.م</small></span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1px", backgroundColor: "#25282b", borderTop: "1px solid #25282b" }}>
              <button onClick={() => deleteOrder(order.id)} style={{ flex: 1, padding: "18px", backgroundColor: "#16181a", color: "#ff4444", border: "none", fontSize: "12px", fontWeight: "bold" }}>حذف 🗑️</button>
              <button onClick={() => toggleStatus(order.id, order.status)} style={{ flex: 1, padding: "18px", backgroundColor: order.status === 'completed' ? "#25282b" : "#FF6600", color: order.status === 'completed' ? "#888" : "#000", border: "none", fontSize: "12px", fontWeight: "bold" }}>
                {order.status === 'completed' ? 'تراجع للانتظار' : 'تحديد كمكتمل ✅'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
