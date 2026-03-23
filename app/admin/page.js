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

  // --- الإضافات الجديدة لنظام المتاجر الديناميكي ---
  const [activeTab, setActiveTab] = useState("الكل"); 
  const [shops, setShops] = useState([]); 

  // 1. منطق التشغيل الأول + استعادة الإعدادات + تسجيل الـ SW (كاملة)
  useEffect(() => {
    setIsClient(true);
    
    // استعادة حالة الصوت فوراً من الذاكرة
    const savedAudio = localStorage.getItem("adminAudioEnabled");
    if (savedAudio === "true") {
      setAudioEnabled(true);
    }

    if (typeof window !== "undefined") {
      // تسجيل الـ Service Worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { scope: '/admin/' })
          .then(reg => console.log('Admin SW Registered scope:', reg.scope))
          .catch(err => console.log('SW registration failed:', err));
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

  // 2. مراقبة عودة المستخدم للتطبيق (كاملة لإعادة تنشيط الصوت)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Welcome back! 🛡️ جاري التأكد من جاهزية الصوت...");
        if (audioRef.current && (audioEnabled || localStorage.getItem("adminAudioEnabled") === "true")) {
          audioRef.current.play().then(() => {
            audioRef.current.pause(); 
            audioRef.current.currentTime = 0;
          }).catch(e => console.log("Re-activation blocked until user clicks"));
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [audioEnabled]);

  // 3. الربط اللحظي بـ Firebase + استخراج المتاجر ديناميكياً
  useEffect(() => {
    if (!isClient) return; 

    console.log("🔄 جاري محاولة الاتصال بـ Firebase...");
    const ordersRef = ref(db, 'orders');
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      console.log("📥 استلام بيانات جديدة من السيرفر!");
      const data = snapshot.val();
      
      if (data) {
        const orderList = Object.keys(data).map(id => ({
          id, ...data[id]
        })).reverse();

        // --- استخراج أسماء المتاجر الفريدة من الأوردرات ---
        const allShops = new Set();
        orderList.forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              if (item.shopName) allShops.add(item.shopName);
            });
          }
        });
        setShops(Array.from(allShops)); // تحويلها لمصفوفة ليتم عرضها في الـ Tabs

        // فحص وصول أوردر جديد للتنبيه
        if (ordersCountRef.current !== 0 && orderList.length > ordersCountRef.current) {
          console.log("🔔 اكتشاف أوردر جديد! جاري تشغيل التنبيه...");
          handleNewOrderNotification(orderList[0]);
        }
        
        setOrders(orderList);
        ordersCountRef.current = orderList.length;
      } else {
        console.log("📭 لا توجد طلبات في قاعدة البيانات");
        setOrders([]);
        setShops([]);
        ordersCountRef.current = 0;
      }
    }, (error) => {
      console.error("❌ خطأ في الاتصال بـ Firebase:", error);
    });

    return () => unsubscribe();
  }, [isClient]); 

  // --- دالة الفلترة الذكية للأوردرات حسب التاب النشط ---
  const getFilteredOrders = () => {
    if (activeTab === "الكل") return orders;
    return orders.filter(order => 
      order.items?.some(item => item.shopName === activeTab)
    );
  };

  // 4. دالة التثبيت (كاملة كما هي)
  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

        // 4. دالة التنبيه المطورة (ذكية: ترن حسب التاب النشط أو الإدارة العامة)
  const handleNewOrderNotification = (order) => {
    // منطق الفلترة: هل الأوردر يخص المتجر المفتوح حالياً؟
    const isRelevantToTab = activeTab === "الكل" || 
      order.items?.some(item => item.shopName === activeTab);

    // لو الأوردر ملوش علاقة بالتاب المفتوح، مش هنعمل إزعاج بالصوت
    if (!isRelevantToTab) return;

    const isAudioSaved = localStorage.getItem("adminAudioEnabled") === "true";
    
    // 1. تشغيل الصوت (إيقاظ النظام)
    if (audioRef.current && (audioEnabled || isAudioSaved)) {
      audioRef.current.muted = false; 
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("🔊 تم تشغيل التنبيه الصوتي بنجاح");
        }).catch(() => {
          if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
        });
      }
    }

    // 2. إرسال الإشعار عبر الـ Service Worker (لضمان الخلفية)
    if ('serviceWorker' in navigator && Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(`🔔 أوردر جديد: ${activeTab === "الكل" ? "ميني طلبات" : activeTab}`, {
          body: `العميل: ${order.customer?.name} | المبلغ: ${order.total} ج.م`,
          icon: "/adminMT.png",
          badge: "/adminMT.png",
          tag: "admin-order-alert", 
          renotify: true,
          requireInteraction: true,
          vibrate: [500, 110, 500, 110, 450, 110, 200],
          data: { url: '/admin' }
        });
      });
    } else if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🔔 أوردر جديد وصل!", {
        body: `العميل: ${order.customer?.name} | المبلغ: ${order.total} ج.م`,
        icon: "/adminMT.png",
        tag: "admin-order-alert",
        requireInteraction: true
      }).onclick = () => { window.focus(); };
    }
  };

  // 5. دالة تفعيل الصوت وحفظ التصاريح
  const toggleAudioSystem = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setAudioEnabled(true);
        localStorage.setItem("adminAudioEnabled", "true"); 
        
        if ("Notification" in window) {
          Notification.requestPermission();
        }
        alert("✅ اللوحة جاهزة الآن للتنبيهات اللحظية 🛡️");
      }).catch(() => alert("يرجى المحاولة مرة أخرى للسماح بالصوت"));
    }
  };

  // 6. التحكم في حالة الطلب (مكتمل / قيد الانتظار)
  const toggleStatus = async (orderId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await update(ref(db, `orders/${orderId}`), { status: newStatus });
    } catch (err) {
      console.error("Update Status Error:", err);
    }
  };

  // 7. حذف الطلب نهائياً
  const deleteOrder = async (orderId) => {
    if (window.confirm("⚠️ هل أنت متأكد من حذف هذا الطلب نهائياً؟")) {
      try {
        await remove(ref(db, `orders/${orderId}`));
      } catch (err) {
        console.error("Delete Order Error:", err);
      }
    }
  };

    // 8. توزيع الطلب للواتساب (مطور ليدعم نظام التابات والمحلات)
  const distributeOrder = (order, shopName) => {
    // تصفية الأصناف الخاصة بالمحل المختار فقط
    const shopItems = order.items?.filter(item => item.shopName === shopName);
    
    if (!shopItems || shopItems.length === 0) {
      alert("⚠️ لا توجد أصناف لهذا المحل في هذا الأوردر");
      return;
    }

    let msg = `*📦 طلب جديد - ميني طلبات*\n`;
    msg += `*🧾 فاتورة رقم: #${order.invoiceRef}*\n`;
    msg += `*👤 العميل:* ${order.customer?.name}\n`;
    msg += `*📞 الهاتف:* ${order.customer?.phone}\n`;
    msg += `*📍 العنوان:* ${order.customer?.address || "غير محدد"}\n`;
    msg += `*🛒 متجر: ${shopName}*\n\n`;
    
    let shopTotal = 0;
    msg += `*الأصناف:*\n`;
    shopItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      shopTotal += itemTotal;
      msg += `• ${item.name} (${item.quantity}) = ${itemTotal} ج\n`;
    });
    
    msg += `\n*💰 إجمالي المحل: ${shopTotal} ج.م*`;
    msg += `\n\n_تم الإرسال من لوحة الإدارة 🛡️_`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!isClient) return null;

  return (
    <div dir="rtl" style={{ backgroundColor: "#0b0c0d", minHeight: "100vh", color: "#ffffff", padding: "15px", fontFamily: "sans-serif", paddingBottom: "100px" }}>
      
      {/* ملف الصوت */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* 2. أزرار الأكشن (تفعيل الصوت + التثبيت) */}
      <div style={{ position: "sticky", top: "10px", zIndex: 110, display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
        {!audioEnabled && (
          <div 
            style={{ 
              backgroundColor: "#FF6600", color: "#000", padding: "18px", borderRadius: "20px", 
              textAlign: "center", fontWeight: "900", cursor: "pointer", 
              boxShadow: "0 10px 25px rgba(255,102,0,0.5)", border: "3px solid #fff"
            }} 
            onClick={toggleAudioSystem}
          >
            📢 تفعيل التنبيهات الصوتية 🔔
          </div>
        )}

        {deferredPrompt && (
          <div 
            style={{ 
              backgroundColor: "#1a73e8", color: "#fff", padding: "12px", borderRadius: "15px", 
              textAlign: "center", fontWeight: "bold", cursor: "pointer", 
              border: "1px solid rgba(255,255,255,0.1)" 
            }} 
            onClick={handleInstallApp}
          >
            📲 تثبيت لوحة الإدارة 🛡️
          </div>
        )}
      </div>

      {/* 3. الهيدر وشريط التابات الديناميكي */}
      <header style={{ position: "sticky", top: 0, backgroundColor: "#0b0c0d", zIndex: 100, padding: "10px 0", borderBottom: "1px solid #1e2022", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <div>
            <h1 style={{ color: "#FF6600", margin: 0, fontSize: "22px", fontWeight: "900" }}>ميني طلبات 🛡️</h1>
            <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>إدارة {activeTab}</p>
          </div>
          <div style={{ textAlign: "center", backgroundColor: "#1a1c1e", padding: "8px 15px", borderRadius: "12px", border: "1px solid #2d3035" }}>
            <div style={{ fontSize: "20px", fontWeight: "900", color: "#4caf50" }}>{getFilteredOrders().length}</div>
            <div style={{ fontSize: "9px", color: "#888" }}>طلب</div>
          </div>
        </div>

        {/* شريط التابات (Scrollable Tabs) */}
        <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "none" }}>
          {/* تاب "الكل" الأساسي */}
          <div 
            onClick={() => setActiveTab("الكل")}
            style={{
              padding: "10px 20px", borderRadius: "12px", whiteSpace: "nowrap", cursor: "pointer",
              backgroundColor: activeTab === "الكل" ? "#FF6600" : "#1a1c1e",
              color: activeTab === "الكل" ? "#000" : "#fff",
              fontWeight: "bold", fontSize: "14px", border: "1px solid #2d3035", transition: "0.3s"
            }}
          >
            الكل 🌍
          </div>

          {/* تابات المحلات المستخرجة أوتوماتيكياً */}
          {shops.map((shop) => (
            <div 
              key={shop}
              onClick={() => setActiveTab(shop)}
              style={{
                padding: "10px 20px", borderRadius: "12px", whiteSpace: "nowrap", cursor: "pointer",
                backgroundColor: activeTab === shop ? "#FF6600" : "#1a1c1e",
                color: activeTab === shop ? "#000" : "#fff",
                fontWeight: "bold", fontSize: "14px", border: "1px solid #2d3035", transition: "0.3s"
              }}
            >
              {shop}
            </div>
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
            // حساب إجمالي الأصناف الخاصة بالتاب النشط فقط
            const currentTabItems = activeTab === "الكل" 
              ? order.items 
              : order.items?.filter(item => item.shopName === activeTab);

            const tabTotal = activeTab === "الكل" 
              ? order.total 
              : currentTabItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return (
              <div key={order.id} style={{ 
                backgroundColor: "#16181a", borderRadius: "30px", 
                border: `2px solid ${order.status === 'completed' ? '#2e7d32' : '#25282b'}`, 
                boxShadow: "0 15px 35px rgba(0,0,0,0.6)", overflow: "hidden" 
              }}>
                {/* شريط المعلومات العلوي */}
                <div style={{ backgroundColor: "#1e2124", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#FF6600", fontWeight: "900" }}>فاتورة #{order.invoiceRef}</span>
                  <span style={{ color: "#aaa" }}>{order.orderTime} | {order.orderDate}</span>
                </div>

                <div style={{ padding: "20px" }}>
                  {/* معلومات العميل */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", color: "#fff" }}>{order.customer?.name}</h3>
                      <p style={{ margin: 0, fontSize: "13px", color: "#888", lineHeight: "1.4" }}>📍 {order.customer?.address}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <a href={`tel:${order.customer?.phone}`} style={{ textDecoration: "none", backgroundColor: "#28a745", color: "#fff", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", fontSize: "18px" }}>📞</a>
                      {order.location && (
                        <a href={order.location} target="_blank" rel="noreferrer" style={{ textDecoration: "none", backgroundColor: "#007bff", color: "#fff", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", fontSize: "18px" }}>📍</a>
                      )}
                    </div>
                  </div>

                  {/* قائمة الأصناف المفلترة حسب التاب */}
                  <div style={{ backgroundColor: "#0b0c0d", borderRadius: "20px", padding: "15px", border: "1px solid #1e2022" }}>
                    {activeTab === "الكل" ? (
                      // عرض كل المتاجر لو التاب "الكل"
                      Array.from(new Set(order.items?.map(i => i.shopName))).map(shop => (
                        <div key={shop} style={{ marginBottom: "15px", borderBottom: "1px solid #1e2022", paddingBottom: "10px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ fontWeight: "bold", color: "#FF6600", fontSize: "13px" }}>🏪 {shop}</span>
                            <button onClick={() => distributeOrder(order, shop)} style={{ backgroundColor: "#25d366", color: "#000", border: "none", padding: "5px 12px", borderRadius: "8px", fontSize: "10px", fontWeight: "900" }}>إرسال ✅</button>
                          </div>
                          {order.items?.filter(i => i.shopName === shop).map((item, idx) => (
                            <div key={idx} style={{ fontSize: "13px", color: "#ddd", display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span>{item.name} <b style={{ color: "#FF6600" }}>×{item.quantity}</b></span>
                              <span>{item.price * item.quantity} ج</span>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      // عرض أصناف المحل المختار فقط
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                          <span style={{ fontWeight: "bold", color: "#FF6600" }}>🏪 {activeTab}</span>
                          <button onClick={() => distributeOrder(order, activeTab)} style={{ backgroundColor: "#25d366", color: "#000", border: "none", padding: "6px 15px", borderRadius: "10px", fontSize: "11px", fontWeight: "900" }}>إرسال الواتساب ✅</button>
                        </div>
                        {currentTabItems?.map((item, idx) => (
                          <div key={idx} style={{ fontSize: "14px", color: "#ddd", display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span>{item.name} <b style={{ color: "#FF6600" }}>×{item.quantity}</b></span>
                            <span>{item.price * item.quantity} ج</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* الإجمالي حسب الفلترة */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", alignItems: "baseline" }}>
                    <span style={{ color: "#888", fontSize: "13px" }}>{activeTab === "الكل" ? "إجمالي الأوردر:" : `إجمالي ${activeTab}:`}</span>
                    <span style={{ fontSize: "22px", fontWeight: "900", color: "#4caf50" }}>{tabTotal} ج.م</span>
                  </div>
                </div>

                {/* أزرار التحكم */}
                <div style={{ display: "flex", gap: "1px", backgroundColor: "#25282b", borderTop: "1px solid #25282b" }}>
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
