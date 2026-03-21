"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase"; 
import { ref, onValue, update, remove, query, limitToLast } from "firebase/database";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    setIsClient(true);
    // طلب إذن الإشعارات بشكل صريح
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // اتصال "قوي" بـ Firebase يضمن التحديث بدون ريفريش
    const ordersRef = ref(db, 'orders');
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(id => ({
          id,
          ...data[id]
        })).reverse();

        // التنبيه فقط عند دخول أوردر جديد فعلاً
        if (!isFirstRun.current && orderList.length > orders.length) {
          triggerAlarm(orderList[0]);
        }
        
        setOrders(orderList);
        isFirstRun.current = false;
      }
    });

    return () => unsubscribe();
  }, [orders.length]);

  const triggerAlarm = (order) => {
    // تشغيل الصوت
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => console.log("بانتظار تفاعل المستخدم لتشغيل الصوت"));
    }

    // إشعار النظام (يظهر في الخلفية)
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🔔 أوردر جديد وصل!", {
        body: `العميل: ${order.customer?.name}\nالمبلغ: ${order.total} ج.م`,
        tag: "new-order",
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });
    }
  };

  const toggleStatus = async (id, current) => {
    await update(ref(db, `orders/${id}`), { status: current === 'completed' ? 'pending' : 'completed' });
  };

  if (!isClient) return null;

  return (
    <div dir="rtl" style={{ backgroundColor: "#0b0c0d", minHeight: "100vh", color: "#fff", padding: "15px" }}>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* زر ضروري لإعطاء المتصفح إذن الصوت */}
      {!audioEnabled && (
        <button 
          onClick={() => { audioRef.current.play(); audioRef.current.pause(); setAudioEnabled(true); }}
          style={{ width: "100%", padding: "15px", backgroundColor: "#FF6600", border: "none", borderRadius: "12px", color: "#000", fontWeight: "bold", marginBottom: "20px" }}
        >
          تنشيط نظام التنبيه الصوتي 🔔 (اضغط هنا)
        </button>
      )}

      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", borderBottom: "1px solid #222", paddingBottom: "10px" }}>
        <h1 style={{ fontSize: "20px", color: "#FF6600" }}>لوحة التحكم 🛡️</h1>
        <div style={{ fontSize: "12px" }}>إجمالي الأوردرات: {orders.length}</div>
      </header>

      <div style={{ display: "grid", gap: "15px" }}>
        {orders.map((order) => (
          <div key={order.id} style={{ backgroundColor: "#16181a", borderRadius: "20px", border: "1px solid #25282b", overflow: "hidden" }}>
            <div style={{ padding: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#FF6600", fontWeight: "bold" }}>#{order.invoiceRef}</span>
                <span style={{ fontSize: "11px", color: "#888" }}>{order.orderTime}</span>
              </div>
              <h3 style={{ margin: "10px 0 5px" }}>{order.customer?.name}</h3>
              <p style={{ fontSize: "13px", color: "#aaa", margin: "0" }}>📞 {order.customer?.phone}</p>
              <p style={{ fontSize: "13px", color: "#aaa", margin: "5px 0" }}>📍 {order.customer?.address}</p>
              
              <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#000", borderRadius: "10px" }}>
                <span style={{ fontSize: "12px", color: "#555" }}>الإجمالي:</span>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#FF6600" }}>{order.total} ج.م</div>
              </div>
            </div>

            <button 
              onClick={() => toggleStatus(order.id, order.status)}
              style={{ width: "100%", padding: "12px", border: "none", backgroundColor: order.status === 'completed' ? "#1b5e20" : "#FF6600", color: "#fff", fontWeight: "bold" }}
            >
              {order.status === 'completed' ? 'تم التوصيل ✅' : 'تحديد كمكتمل'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
