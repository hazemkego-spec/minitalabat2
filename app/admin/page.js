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
const [activeTab, setActiveTab] = useState("الكل");

  // 1. منطق التشغيل الأول + استعادة الإعدادات + تسجيل الـ SW
  useEffect(() => {
    setIsClient(true);
    
    const savedAudio = localStorage.getItem("adminAudioEnabled");
    if (savedAudio === "true") {
      setAudioEnabled(true);
    }

    if (typeof window !== "undefined") {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { scope: '/admin/' })
          .then(reg => console.log('Admin SW Registered scope:', reg.scope))
          .catch(err => console.log('SW registration failed:', err));
      }

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

  // مراقبة عودة المستخدم للتطبيق
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (audioRef.current && (audioEnabled || localStorage.getItem("adminAudioEnabled") === "true")) {
          audioRef.current.play().then(() => {
            audioRef.current.pause();
          }).catch(e => console.log("Re-activation blocked"));
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [audioEnabled]);

  // 2. الربط اللحظي بـ Firebase (تم التعديل لقراءة هيكل المتاجر الجديد)
  useEffect(() => {
    if (!isClient) return; 

    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const orderList = Object.keys(data).map(id => {
          const rawOrder = data[id];
          
          // تحويل هيكل الأصناف (Object of Objects) إلى مصفوفة بسيطة
          let processedItems = [];
          if (rawOrder.items && typeof rawOrder.items === 'object') {
            Object.keys(rawOrder.items).forEach(shopName => {
              const itemsInShop = rawOrder.items[shopName];
              const itemsArray = Array.isArray(itemsInShop) ? itemsInShop : Object.values(itemsInShop);
              
              itemsArray.forEach(item => {
                if (item) {
                  processedItems.push({ 
                    ...item, 
                    shopName: shopName.trim() // ربط اسم المحل بالصنف
                  });
                }
              });
            });
          }

          return {
            id,
            ...rawOrder,
            processedItems // هذه المصفوفة الجاهزة للعرض
          };
        }).reverse();

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
  }, [isClient]);

  // 3. دالة التثبيت
  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };
// 4. دالة التنبيه (نسخة التشغيل الإجباري للصوت والاشعارات)
  const handleNewOrderNotification = (order) => {
    const isAudioSaved = localStorage.getItem("adminAudioEnabled") === "true";
    
    // 1. محاولة تشغيل الصوت مع "إيقاظ" المتصفح
    if (audioRef.current && (audioEnabled || isAudioSaved)) {
      audioRef.current.muted = false; 
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("🔊 تم تشغيل صوت التنبيه بنجاح");
        }).catch(error => {
          console.warn("⚠️ المتصفح منع الصوت تلقائياً:", error);
          if (navigator.vibrate) navigator.vibrate([500, 200, 500]); 
        });
      }
    }

    // 2. إرسال إشعار النظام
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("🔔 أوردر جديد وصل!", {
          body: `العميل: ${order.customer?.name || 'مجهول'} | المبلغ: ${order.total || 0} ج.م`,
          icon: "/adminMT.png",
          tag: "admin-order-alert", 
          requireInteraction: true, 
          vibrate: [200, 100, 200]
        });
      } catch (e) {
        console.error("Notification Error:", e);
      }
    }
  };

  // 5. دالة تفعيل الصوت (كسر حماية المتصفح)
  const toggleAudioSystem = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setAudioEnabled(true);
        localStorage.setItem("adminAudioEnabled", "true"); 
        alert("✅ تم تفعيل الصوت بنجاح! 🛡️");
      }).catch(() => alert("يرجى الضغط مرة أخرى للسماح بالصوت"));
    }
  };

  // 6. التحكم في حالة الطلب
  const toggleStatus = async (orderId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await update(ref(db, `orders/${orderId}`), { status: newStatus });
    } catch (err) {
      console.error("Update Status Error:", err);
    }
  };

  // 7. حذف الطلب
  const deleteOrder = async (orderId) => {
    if (window.confirm("⚠️ هل أنت متأكد من حذف هذا الطلب نهائياً؟")) {
      try {
        await remove(ref(db, `orders/${orderId}`));
      } catch (err) {
        console.error("Delete Order Error:", err);
      }
    }
  };

  // 8. توزيع الطلب للواتساب (تم تحديثها لتدعم الهيكل الجديد ✅)
  const distributeOrder = (order, shopName) => {
    // سحب الأصناف الخاصة بهذا المحل فقط من المصفوفة المعالجة
    const shopItems = order.processedItems?.filter(item => item.shopName === shopName) || [];
    
    if (shopItems.length === 0) {
        alert("لا توجد أصناف لهذا المتجر");
        return;
    }

    let msg = `*📦 طلب جديد - ميني طلبات*\n`;
    msg += `*🧾 فاتورة رقم: #${order.invoiceRef || '---'}*\n`;
    msg += `*👤 العميل:* ${order.customer?.name || 'غير مسجل'}\n`;
    msg += `*📞 الهاتف:* ${order.customer?.phone || '---'}\n`;
    msg += `*🛒 متجر: ${shopName}*\n\n`;
    
    let shopTotal = 0;
    shopItems.forEach(item => {
      const q = item.quantity || 1;
      const p = item.price || 0;
      const itemTotal = p * q;
      shopTotal += itemTotal;
      msg += `• ${item.name} (${q}) = ${itemTotal} ج\n`;
    });
    
    msg += `\n*💰 المطلوب تحصيله: ${shopTotal} ج.م*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!isClient) return null;

  return (
    <div dir="rtl" style={{ backgroundColor: "#0b0c0d", minHeight: "100vh", color: "#ffffff", padding: "15px", fontFamily: "sans-serif", paddingBottom: "80px" }}>
      
      {/* ملف الصوت */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* 2. أزرار الأكشن */}
      <div style={{ position: "sticky", top: "10px", zIndex: 110, display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
        
        {!audioEnabled && (
          <div 
            style={{ 
              backgroundColor: "#FF6600", color: "#000", padding: "20px", borderRadius: "22px", 
              textAlign: "center", fontWeight: "900", cursor: "pointer", 
              boxShadow: "0 10px 25px rgba(255,102,0,0.5)", border: "3px solid #fff",
              marginBottom: "10px"
            }} 
            onClick={toggleAudioSystem}
          >
            📢 اضغط هنا لتفعيل صوت التنبيهات 🔔
            <div style={{ fontSize: "10px", marginTop: "5px", fontWeight: "normal" }}>
              (يجب التفعيل مرة واحدة لضمان وصول الأوردرات فوراً)
            </div>
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
      {/* 3. الهيدر (تم إضافة التبويبات) */}
      <header style={{ position: "sticky", top: 0, backgroundColor: "rgba(11, 12, 13, 0.95)", zIndex: 100, padding: "15px 0", borderBottom: "1px solid #1e2022", marginBottom: "25px", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 15px", marginBottom: "15px" }}>
          <div>
            <h1 style={{ color: "#FF6600", margin: 0, fontSize: "22px", fontWeight: "900" }}>لوحة التحكم 🛡️</h1>
            <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>متابعة {activeTab} لحظياً</p>
          </div>
          <div style={{ textAlign: "center", backgroundColor: "#1a1c1e", padding: "8px 15px", borderRadius: "12px", border: "1px solid #2d3035" }}>
            <div style={{ fontSize: "20px", fontWeight: "900", color: "#4caf50" }}>{getFilteredOrders().length}</div>
            <div style={{ fontSize: "10px", color: "#888" }}>طلب</div>
          </div>
        </div>

        {/* 📱 شريط التبويبات (Tabs) للمتاجر */}
        <div style={{ display: "flex", gap: "10px", overflowX: "auto", padding: "0 15px 10px 15px", scrollbarWidth: "none" }}>
          {getShopTabs().map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 18px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: activeTab === tab ? "#FF6600" : "#1e2124",
                color: activeTab === tab ? "#000" : "#fff",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "0.2s",
                fontSize: "13px"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* 4. عرض الطلبات المفلترة ذكياً */}
      <div style={{ display: "grid", gap: "25px" }}>
        {getFilteredOrders().length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 20px", color: "#444" }}>
             <div style={{ fontSize: "50px", marginBottom: "10px" }}>📭</div>
             لا توجد طلبات في {activeTab} حالياً..
          </div>
        ) : (
          getFilteredOrders().map((order) => {
            // حساب إجمالي "المتجر المختار" فقط لو التاب مش "الكل"
            const tabTotal = activeTab === "الكل" 
              ? order.total 
              : order.processedItems?.filter(i => i.shopName === activeTab).reduce((s, i) => s + (i.price * i.quantity), 0);

            return (
              <div key={order.id} style={{ 
                backgroundColor: "#16181a", borderRadius: "30px", border: `2px solid ${order.status === 'completed' ? '#2e7d32' : '#25282b'}`, 
                boxShadow: "0 15px 35px rgba(0,0,0,0.6)", overflow: "hidden" 
              }}>
                <div style={{ backgroundColor: "#1e2124", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#FF6600", fontWeight: "900" }}>فاتورة #{order.invoiceRef || '---'}</span>
                  <span style={{ color: "#aaa" }}>{order.orderTime || ''} | {order.orderDate || ''}</span>
                </div>

                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", color: "#fff" }}>{order.customer?.name || 'عميل مجهول'}</h3>
                      <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>📍 {order.customer?.address || 'بدون عنوان'}</p>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <a href={`tel:${order.customer?.phone}`} style={{ textDecoration: "none", backgroundColor: "#28a745", color: "#fff", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "15px", fontSize: "20px" }}>📞</a>
                      {order.location && (
                        <a href={order.location} target="_blank" rel="noreferrer" style={{ textDecoration: "none", backgroundColor: "#007bff", color: "#fff", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "15px", fontSize: "20px" }}>📍</a>
                      )}
                    </div>
                  </div>

                  {/* 🛒 عرض الأصناف حسب التاب النشط */}
                  <div style={{ backgroundColor: "#0b0c0d", borderRadius: "20px", padding: "15px" }}>
                    {order.items && typeof order.items === 'object' ? (
                      Object.keys(order.items)
                        .filter(shopName => activeTab === "الكل" || shopName === activeTab) // فلترة المحلات
                        .map((shopName) => {
                          const shopItems = Array.isArray(order.items[shopName]) ? order.items[shopName] : Object.values(order.items[shopName]);
                          return (
                            <div key={shopName} style={{ marginBottom: "15px", borderBottom: "1px solid #1e2022", paddingBottom: "10px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <span style={{ fontWeight: "bold", color: "#FF6600" }}>🏪 {shopName}</span>
                                <button onClick={() => distributeOrder(order, shopName)} style={{ backgroundColor: "#25d366", color: "#000", border: "none", padding: "8px 15px", borderRadius: "10px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>إرسال ✅</button>
                              </div>
                              {shopItems.map((item, i) => (
                                <div key={i} style={{ fontSize: "13px", color: "#ddd", display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                  <span>{item?.name} <b>×{item?.quantity || 1}</b></span>
                                  <span>{(item?.price || 0) * (item?.quantity || 1)} ج</span>
                                </div>
                              ))}
                            </div>
                          );
                        })
                    ) : (
                      <div style={{ color: "#555", textAlign: "center", fontSize: "12px" }}>لا توجد تفاصيل للأصناف</div>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                    <span style={{ color: "#888" }}>{activeTab === "الكل" ? "الإجمالي المطلوب:" : `حساب ${activeTab}:`}</span>
                    <span style={{ fontSize: "22px", fontWeight: "900", color: "#4caf50" }}>{tabTotal || 0} ج.م</span>
                  </div>
                </div>

                {/* أزرار التحكم */}
                <div style={{ display: "flex", gap: "1px", backgroundColor: "#25282b" }}>
                  <button onClick={() => deleteOrder(order.id)} style={{ flex: 1, padding: "18px", backgroundColor: "#16181a", color: "#ff4444", border: "none", fontWeight: "bold", cursor: "pointer" }}>حذف 🗑️</button>
                  <button onClick={() => toggleStatus(order.id, order.status)} style={{ flex: 2, padding: "18px", backgroundColor: order.status === 'completed' ? "#1e2124" : "#FF6600", color: order.status === 'completed' ? "#4caf50" : "#000", border: "none", fontWeight: "900", cursor: "pointer" }}>
                    {order.status === 'completed' ? 'تم الاكتمال ✅' : 'تحديد كمكتمل'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
