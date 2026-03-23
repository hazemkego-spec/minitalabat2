"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase"; 
import { ref, onValue, update, remove, query } from "firebase/database";
// استدعاء المتاجر من ملفك الخاص بناءً على الخريطة التي أرسلتها
import { shops as staticShops } from "../components/ShopList";

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

  // 1. منطق التشغيل الأول + تحميل المتاجر من ملف ShopList
  useEffect(() => {
    setIsClient(true);
    
    // تحميل المتاجر فوراً من ملفك لضمان عدم حدوث Exception
    if (staticShops && Array.isArray(staticShops)) {
      // استخراج الأسماء فقط (name) من مصفوفة المحلات
      const shopNames = staticShops.map(s => s.name).filter(Boolean);
      setShops(shopNames);
    }

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

  // 2. مراقبة عودة المستخدم للتطبيق
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (audioRef.current && (audioEnabled || localStorage.getItem("adminAudioEnabled") === "true")) {
          audioRef.current.play().then(() => {
            audioRef.current.pause(); 
            audioRef.current.currentTime = 0;
          }).catch(e => console.log("Audio play blocked"));
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [audioEnabled]);

  // 3. الربط اللحظي بـ Firebase (نسخة مؤمنة وخفيفة ✅)
  useEffect(() => {
    if (!isClient) return; 

    const ordersRef = ref(db, 'orders');
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const orderList = Object.keys(data).map(id => ({
          id, ...data[id]
        })).reverse();

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
      console.error("❌ Firebase Error:", error);
    });

    return () => unsubscribe();
  }, [isClient]); 

  // --- دالة الفلترة الذكية للأوردرات (درع الحماية الأساسي ✅) ---
  const getFilteredOrders = () => {
    try {
      if (!orders || !Array.isArray(orders)) return [];
      if (activeTab === "الكل") return orders;
      
      return orders.filter(order => {
        // فحص هيكل الأوردر قبل الفلترة لمنع أي كراش
        const items = order?.items || [];
        // تحويل الـ items لمصفوفة لو كانت جاية بصيغة Object
        const itemsArray = Array.isArray(items) ? items : Object.values(items);
        return itemsArray.some(item => item && item.shopName === activeTab);
      });
    } catch (err) {
      console.error("Filter Error:", err);
      return [];
    }
  };

    // 4. دالة التثبيت (كاملة كما هي)
  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  // 5. دالة التنبيه المطورة (ذكية: ترن حسب التاب النشط وتدعم الـ Service Worker ✅)
  const handleNewOrderNotification = (order) => {
    if (!order) return;

    // منطق الفلترة: هل الأوردر يخص المتجر المفتوح حالياً؟
    // تم إضافة حماية لتحويل items لمصفوفة في حالة كانت Object من الفايربيز
    const orderItems = order.items || [];
    const itemsArray = Array.isArray(orderItems) ? orderItems : Object.values(orderItems);
    
    const isRelevantToTab = activeTab === "الكل" || 
      itemsArray.some(item => item && item.shopName === activeTab);

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

    // 2. إرسال الإشعار عبر الـ Service Worker (لضمان الظهور في الخلفية)
    if ('serviceWorker' in navigator && Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(`🔔 أوردر جديد: ${activeTab === "الكل" ? "ميني طلبات" : activeTab}`, {
          body: `العميل: ${order.customer?.name || 'غير معروف'} | المبلغ: ${order.total || 0} ج.م`,
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

  // 6. دالة تفعيل الصوت وحفظ التصاريح
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

  // 7. التحكم في حالة الطلب (مكتمل / قيد الانتظار)
  const toggleStatus = async (orderId, currentStatus) => {
    if (!orderId) return;
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await update(ref(db, `orders/${orderId}`), { status: newStatus });
    } catch (err) {
      console.error("Update Status Error:", err);
    }
  };

  // 8. حذف الطلب نهائياً
  const deleteOrder = async (orderId) => {
    if (!orderId) return;
    if (window.confirm("⚠️ هل أنت متأكد من حذف هذا الطلب نهائياً؟")) {
      try {
        await remove(ref(db, `orders/${orderId}`));
      } catch (err) {
        console.error("Delete Order Error:", err);
      }
    }
  };
        // 9. توزيع الطلب للواتساب (مطور ليدعم نظام التابات والمحلات ✅)
  const distributeOrder = (order, shopName) => {
    if (!order || !shopName) return;

    // تصفية الأصناف مع حماية إضافية لهيكل البيانات
    const orderItems = order.items || [];
    const itemsArray = Array.isArray(orderItems) ? orderItems : Object.values(orderItems);
    
    const shopItems = itemsArray.filter(item => item && item.shopName === shopName);
    
    if (!shopItems || shopItems.length === 0) {
      alert("⚠️ لا توجد أصناف لهذا المحل في هذا الأوردر");
      return;
    }

    let msg = `*📦 طلب جديد - ميني طلبات*\n`;
    msg += `*🧾 فاتورة رقم: #${order.invoiceRef || '---'}*\n`;
    msg += `*👤 العميل:* ${order.customer?.name || 'غير معروف'}\n`;
    msg += `*📞 الهاتف:* ${order.customer?.phone || '---'}\n`;
    msg += `*📍 العنوان:* ${order.customer?.address || "غير محدد"}\n`;
    msg += `*🛒 متجر: ${shopName}*\n\n`;
    
    let shopTotal = 0;
    msg += `*الأصناف:*\n`;
    shopItems.forEach(item => {
      if (item) {
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        shopTotal += itemTotal;
        msg += `• ${item.name} (${item.quantity}) = ${itemTotal} ج\n`;
      }
    });
    
    msg += `\n*💰 إجمالي المحل: ${shopTotal} ج.م*`;
    msg += `\n\n_تم الإرسال من لوحة الإدارة 🛡️_`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // التأكد من أن الكود يعمل في المتصفح فقط قبل الرندرة
  if (!isClient) return null;

  return (
    <div dir="rtl" style={{ 
      backgroundColor: "#0b0c0d", 
      minHeight: "100vh", 
      color: "#ffffff", 
      padding: "15px", 
      fontFamily: "sans-serif", 
      paddingBottom: "100px",
      overflowX: "hidden" 
    }}>
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

      {/* 3. الهيدر وشريط التابات الديناميكي (يعمل من ShopList ✅) */}
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

          {/* عرض التابات من مصفوفة shops المؤمنة */}
          {(shops || []).map((shop) => (
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
            if (!order || !order.items) return null;

            // 1. استخراج كل الأصناف وربطها باسم المحل (العنوان في الفايربيز)
            const allItems = [];
            Object.keys(order.items).forEach(shopKey => {
              const shopContent = order.items[shopKey];
              const itemsArray = Array.isArray(shopContent) ? shopContent : Object.values(shopContent);
              
              itemsArray.forEach(item => {
                if (item) {
                  // هنا بنخلي اسم المحل هو الـ shopKey اللي جاي من الفايربيز (زي: سوبر ماركت أحمد..)
                  allItems.push({ ...item, shopName: shopKey }); 
                }
              });
            });
            
            // 2. تصفية الأصناف حسب التاب (المحل) المختار
            const currentTabItems = activeTab === "الكل" 
              ? allItems 
              : allItems.filter(item => item.shopName === activeTab);

            // 3. حساب إجمالي الحساب للتاب الحالي فقط
            const tabTotal = currentTabItems.reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 1)), 0);

            // لو التاب محل والطلب ملوش حاجة فيه.. اخفي الكارت
            if (activeTab !== "الكل" && currentTabItems.length === 0) return null;

            return (
              <div key={order.id} style={{ backgroundColor: "#16181a", borderRadius: "30px", border: `2px solid ${order.status === 'completed' ? '#2e7d32' : '#25282b'}`, marginBottom: "20px", overflow: "hidden" }}>
                
                {/* رأس الكارت */}
                <div style={{ backgroundColor: "#1e2124", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#FF6600", fontWeight: "bold" }}>فاتورة #{order.invoiceRef || '---'}</span>
                  <span style={{ color: "#aaa" }}>{order.orderTime || ''}</span>
                </div>

                <div style={{ padding: "20px" }}>
                  {/* بيانات العميل */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                    <div>
                      <h3 style={{ margin: 0, color: "#fff" }}>{order.customer?.name}</h3>
                      <p style={{ margin: "5px 0", color: "#888", fontSize: "13px" }}>📍 {order.customer?.address}</p>
                    </div>
                    <a href={`tel:${order.customer?.phone}`} style={{ backgroundColor: "#28a745", color: "#fff", padding: "10px", borderRadius: "10px", textDecoration: "none" }}>📞</a>
                  </div>

                  {/* 🟢 عرض الأصناف (هنا الشغل كله) */}
                  <div style={{ backgroundColor: "#0b0c0d", borderRadius: "15px", padding: "15px" }}>
                    {activeTab === "الكل" ? (
                      // في تابة الكل: قسمهم حسب المحل
                      Object.keys(order.items).map(shopName => (
                        <div key={shopName} style={{ marginBottom: "10px", borderBottom: "1px solid #1e2124", paddingBottom: "10px" }}>
                          <div style={{ color: "#FF6600", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>🏪 {shopName}</div>
                          {(Array.isArray(order.items[shopName]) ? order.items[shopName] : Object.values(order.items[shopName])).map((item, i) => (
                            <div key={i} style={{ color: "#ddd", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                              <span>{item.name} x{item.quantity || 1}</span>
                              <span>{item.price * (item.quantity || 1)} ج</span>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      // في تابة محل معين: اعرض أصنافه بس
                      currentTabItems.map((item, i) => (
                        <div key={i} style={{ color: "#ddd", display: "flex", justifyContent: "space-between", fontSize: "15px", marginBottom: "5px" }}>
                          <span>{item.name} x{item.quantity || 1}</span>
                          <span>{item.price * (item.quantity || 1)} ج</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* الإجمالي المفلتر */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                    <span style={{ color: "#888" }}>{activeTab === "الكل" ? "إجمالي الفاتورة" : `حساب ${activeTab}`}</span>
                    <span style={{ color: "#4caf50", fontWeight: "bold", fontSize: "18px" }}>{tabTotal} ج.م</span>
                  </div>
                </div>

                {/* أزرار التحكم */}
                <div style={{ display: "flex" }}>
                  <button onClick={() => deleteOrder(order.id)} style={{ flex: 1, padding: "15px", background: "#16181a", color: "#ff4444", border: "none" }}>حذف</button>
                  <button onClick={() => toggleStatus(order.id, order.status)} style={{ flex: 2, padding: "15px", background: order.status === 'completed' ? "#25282b" : "#FF6600", color: "#000", border: "none", fontWeight: "bold" }}>
                    {order.status === 'completed' ? 'تم ✅' : 'تحديد كمكتمل'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
