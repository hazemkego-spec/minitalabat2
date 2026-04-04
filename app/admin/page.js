"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase"; 
import { ref, onValue, update, remove, query } from "firebase/database";

// --- إضافة استيراد المتاجر بناءً على خريطة الملفات ---
import { shops } from "../components/ShopList"; 

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  // --- إضافة حالات جديدة للنظام المطور ---
  const [activeTab, setActiveTab] = useState("الكل"); 
  const shopTabs = ["الكل", ...shops.map(shop => shop.name)];

  const audioRef = useRef(null);
  const ordersCountRef = useRef(0);

  // 1. منطق التشغيل الأول + استعادة الإعدادات + تسجيل الـ SW الموحد
  useEffect(() => {
    setIsClient(true);
    
    const savedAudio = localStorage.getItem("adminAudioEnabled");
    if (savedAudio === "true") {
      setAudioEnabled(true);
    }

    if (typeof window !== "undefined") {
      // ✅ تسجيل الـ SW الموحد بدون تقييد الـ scope لضمان قوة التثبيت كـ App
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => {
            console.log('Admin SW Registered successfully');
            // طلب إذن الإشعارات فور التسجيل
            if (Notification.permission === "default") {
              Notification.requestPermission();
            }
          })
          .catch(err => console.log('SW registration failed:', err));
      }

      // ✅ تنظيف أي مانيفست قديم وفرض ملف admin.json الجديد
      const oldManifests = document.querySelectorAll('link[rel="manifest"]');
      oldManifests.forEach(el => el.remove());

      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = `/admin.json?v=${Date.now()}`; // استخدام الامتداد الصحيح المتفق عليه
      document.head.appendChild(link);

      document.title = "لوحة إدارة ميني طلبات 🛡️";
      
      // ✅ ضبط لون الثيم الأسود للإدارة
      let themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute("content", "#0b0c0d");
      } else {
        const meta = document.createElement('meta');
        meta.name = "theme-color";
        meta.content = "#0b0c0d";
        document.head.appendChild(meta);
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // إظهار زر التثبيت تلقائياً لو متاح
      console.log("Ready to install Admin App");
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  // مراقبة عودة المستخدم للتطبيق وتفعيل الصوت (Audio Context Resume)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // محاولة تنشيط الصوت بمجرد عودة المستخدم للتطبيق (حل مشكلة حظر الصوت في المتصفح)
        if (audioRef.current && (audioEnabled || localStorage.getItem("adminAudioEnabled") === "true")) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              audioRef.current.pause(); // تنشيط فقط ليتمكن من العمل لاحقاً عند الأوردر
            }).catch(e => console.log("Audio activation requires user interaction"));
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [audioEnabled]);

    // 2. الربط اللحظي بـ Firebase (معالجة الهيكل الجديد + التنبيهات الصوتية)
  useEffect(() => {
    if (!isClient) return; 

    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const orderList = Object.keys(data).map(id => {
          const rawOrder = data[id];
          
          let processedItems = [];
          if (rawOrder.items && typeof rawOrder.items === 'object') {
            Object.keys(rawOrder.items).forEach(shopName => {
              const itemsInShop = rawOrder.items[shopName];
              const itemsArray = Array.isArray(itemsInShop) ? itemsInShop : Object.values(itemsInShop);
              
              itemsArray.forEach(item => {
                if (item) {
                  processedItems.push({ 
                    ...item, 
                    shopName: shopName.trim() 
                  });
                }
              });
            });
          }

          return {
            id,
            ...rawOrder,
            processedItems 
          };
        }).reverse();

        // 🔔 منطق التنبيه الذكي مع تشغيل الصوت
        if (ordersCountRef.current !== 0 && orderList.length > ordersCountRef.current) {
          const newOrder = orderList[0];
          
          const isRelevantToTab = activeTab === "الكل" || 
            newOrder.processedItems.some(item => item.shopName === activeTab);

          if (isRelevantToTab) {
            // تشغيل الصوت فوراً لو كان مفعل
            if (audioEnabled && audioRef.current) {
               audioRef.current.play().catch(e => console.log("Sound play blocked"));
            }
            handleNewOrderNotification(newOrder);
          }
        }
        
        setOrders(orderList);
        ordersCountRef.current = orderList.length;
      } else {
        setOrders([]);
        ordersCountRef.current = 0;
      }
    });

    return () => unsubscribe();
  }, [isClient, activeTab, audioEnabled]); // أضفت audioEnabled هنا لضمان عمل الصوت

  // 3. دالة التثبيت (PWA) - تم تحسينها لتتوافق مع المانيفست الجديد
  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      alert("⚠️ التطبيق مثبت بالفعل أو المتصفح لا يدعم التثبيت حالياً");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("✅ تم قبول تثبيت لوحة الإدارة");
      setDeferredPrompt(null);
    }
  };

  // 4. دالة التنبيه (صوت + إشعارات نظام) - تم تحديث الأيقونات والمسارات
  const handleNewOrderNotification = (order) => {
    const isAudioSaved = localStorage.getItem("adminAudioEnabled") === "true";
    
    if (audioRef.current && (audioEnabled || isAudioSaved)) {
      audioRef.current.muted = false; 
      // إعادة ضبط التوقيت لضمان البدء من الصفر في كل مرة
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("🔊 صوت التنبيه يعمل بنجاح");
        }).catch(error => {
          console.warn("⚠️ تم حظر الصوت تلقائياً، محاولة الهزاز:", error);
          if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]); 
        });
      }
    }

    // إرسال إشعار للنظام (System Notification)
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        // استخدام لوجو الإدارة المتفق عليه في التنبيه
        new Notification("🔔 أوردر جديد | ميني طلبات", {
          body: `العميل: ${order.customer?.name || 'مجهول'} | فاتورة #${order.invoiceRef}`,
          icon: "/adminMT.webp", 
          badge: "/adminMT.webp",
          tag: "admin-alert", 
          requireInteraction: true, 
          vibrate: [500, 110, 500]
        });
      } catch (e) { 
        console.error("خطأ في إرسال الإشعار:", e); 
      }
    }
  };

  // 5. دالة تفعيل الصوت (كسر حماية المتصفح) - تم تحسين الاستجابة
  const toggleAudioSystem = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      // محاولة "تنشيط" ملف الصوت لمرة واحدة لفك حظر المتصفح
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setAudioEnabled(true);
        localStorage.setItem("adminAudioEnabled", "true"); 
        alert("✅ تم تفعيل جرس التنبيهات بنجاح! 🛡️");
      }).catch((err) => {
        console.error(err);
        alert("يرجى الضغط مرة أخرى لتفعيل الصوت");
      });
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

  // --- 🚀 دالة الطباعة الاحترافية المطورة (تدعم الإدارة والمحل) 🖨️ ---
  const printOrder = (order) => {
    // 1. تحديد نوع الطباعة (إدارة عامة أم إدارة محل)
    const isGlobalAdmin = window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/shop-admin');
    
    // 2. فلترة الأصناف (لو أدمن عام يطبع الكل، لو محل يطبع أصنافه فقط)
    const shopItems = isGlobalAdmin 
      ? (order.processedItems || []) 
      : (order.processedItems?.filter(item => item.shopName === activeTab) || []);

    if (shopItems.length === 0) {
      alert("لا توجد أصناف للطباعة لهذا القسم");
      return;
    }

    const printWindow = window.open('', '_blank');
    let totalSum = 0;
    
    const itemsHtml = shopItems.map(item => {
      const total = item.price * item.quantity;
      totalSum += total;
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px dashed #ccc;">${item.name} ${isGlobalAdmin ? `<br/><small>(${item.shopName})</small>` : ''}</td>
          <td style="padding: 8px; border-bottom: 1px dashed #ccc; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px dashed #ccc; text-align: left;">${total}ج</td>
        </tr>`;
    }).join('');

    // 3. بناء الهيكل الكامل لضمان عدم ظهور خطأ "Problem printing"
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>فاتورة ${isGlobalAdmin ? 'إدارة ميني طلبات' : activeTab}</title>
        <style>
          @media print { 
            @page { margin: 0; size: 80mm auto; } 
            body { margin: 0; padding: 5mm; } 
          }
          body { font-family: 'Arial', sans-serif; color: #000; background: #fff; line-height: 1.4; }
          .invoice-box { width: 70mm; margin: auto; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { border-bottom: 2px solid #000; text-align: right; font-size: 14px; }
          .total-section { text-align: left; margin-top: 15px; border-top: 2px solid #000; padding-top: 5px; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <center>
            <img src="${isGlobalAdmin ? '/mall-logo.webp' : (currentShop?.logo || '/adminMT.webp')}" 
                 style="width: 60px; height: 60px; border-radius: 12px; margin-bottom: 8px; object-fit: cover;">
            <h2 style="margin: 0; font-size: 18px;">${isGlobalAdmin ? 'كشف طلبات ميني طلبات' : activeTab}</h2>
            <p style="font-size: 12px; margin: 4px 0;">نظام ميني طلبات الذكي 🛵</p>
            <hr style="border: 0; border-top: 1px dashed #000;">
          </center>

          <div style="font-size: 12px;">
            <p><b>رقم الطلب:</b> #${order.invoiceRef}</p>
            <p><b>التاريخ:</b> ${order.orderDate} | ${order.orderTime}</p>
            <p><b>العميل:</b> ${order.customer?.name}</p>
            <p><b>الهاتف:</b> ${order.customer?.phone || 'غير مسجل'}</p>
            <p><b>العنوان:</b> ${order.customer?.address}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th style="text-align: right;">الصنف</th>
                <th style="text-align: center;">العدد</th>
                <th style="text-align: left;">السعر</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div class="total-section">
            <h3 style="margin: 0;">الإجمالي: ${totalSum} ج.م</h3>
          </div>

          <center>
            <p style="font-size: 10px; margin-top: 25px; border-top: 1px solid #eee; padding-top: 10px;">
              ${isGlobalAdmin ? 'تقرير إدارة النظام المركزي' : 'شكراً لتعاملكم مع ميني طلبات ✨'}
            </p>
          </center>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();

    // 4. تأمين الطباعة بعد اكتمال التحميل تماماً
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    // حماية إضافية للموبايل في حال تعطل onload
    setTimeout(() => {
      if (printWindow) {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }, 1200);
  };
// --- نهاية دالة الطباعة ---

  
     // 9. توزيع الطلب للواتساب
  const distributeOrder = (order, shopName) => {
    const shopItems = order.processedItems?.filter(item => item.shopName === shopName) || [];
    if (shopItems.length === 0) return;

    let msg = `*📦 طلب جديد - ميني طلبات*\n`;
    msg += `*🧾 فاتورة رقم: #${order.invoiceRef || '---'}*\n`;
    msg += `*👤 العميل:* ${order.customer?.name || 'غير مسجل'}\n`;
    msg += `*📍 العنوان:* ${order.customer?.address || '---'}\n`;
    msg += `*🛒 متجر: ${shopName}*\n\n`;
    
    let shopTotal = 0;
    shopItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      shopTotal += itemTotal;
      msg += `• ${item.name} (${item.quantity}) = ${itemTotal} ج\n`;
    });
    
    msg += `\n*💰 المطلوب تحصيله للمتجر: ${shopTotal} ج.م*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

// ✅ 1. دالة فلترة الأوردرات (توضع قبل الـ return)
  const getFilteredOrders = () => {
    if (!orders || !Array.isArray(orders)) return []; 
    if (activeTab === "الكل") return orders;
    return orders.filter(order => 
      order?.processedItems && Array.isArray(order.processedItems) && 
      order.processedItems.some(item => item?.shopName === activeTab)
    );
  };

  if (!isClient) return null;

  return (
    <div dir="rtl" style={{ backgroundColor: "#0b0c0d", minHeight: "100vh", color: "#ffffff", padding: "15px", fontFamily: "sans-serif", paddingBottom: "80px" }}>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* أزرار الأكشن العلوية */}
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
            📢 اضغط لتفعيل صوت التنبيهات 🔔
          </div>
        )}
      </div>

       {/* 3. الهيدر المطور (دعم الـ Tabs) */}
      <header style={{ position: "sticky", top: 0, backgroundColor: "rgba(11, 12, 13, 0.95)", zIndex: 100, padding: "15px 0", borderBottom: "1px solid #1e2022", marginBottom: "25px", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px", marginBottom: "15px" }}>
          <div>
            <h1 style={{ color: "#FF6600", margin: 0, fontSize: "24px", fontWeight: "900" }}>لوحة التحكم 🛡️</h1>
            <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>متابعة {activeTab} لحظياً</p>
          </div>
          <div style={{ textAlign: "center", backgroundColor: "#1a1c1e", padding: "10px 20px", borderRadius: "15px", border: "1px solid #2d3035" }}>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#4caf50" }}>{getFilteredOrders().length}</div>
            <div style={{ fontSize: "10px", color: "#888" }}>طلب نشط</div>
          </div>
        </div>

        {/* 📱 شريط التبويبات (ديناميكي من ShopList) */}
        <div style={{ display: "flex", gap: "10px", overflowX: "auto", padding: "0 10px 10px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {shopTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 22px",
                borderRadius: "15px",
                border: "none",
                backgroundColor: activeTab === tab ? "#FF6600" : "#1a1c1e",
                color: activeTab === tab ? "#000" : "#fff",
                fontWeight: "900",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "0.3s",
                boxShadow: activeTab === tab ? "0 4px 15px rgba(255,102,0,0.3)" : "none",
                fontSize: "13px"
              }}
            >
              {tab === "الكل" ? "🌍 الكل" : tab}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: "grid", gap: "25px" }}>
        {getFilteredOrders().length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>لا توجد طلبات..</div>
        ) : (
                    getFilteredOrders().map((order) => {
            
            // ✅ دالة حساب الإجمالي للمحل المختار
            const getShopTotal = (sName) => {
              if (!order?.processedItems) return 0;
              return order.processedItems
                .filter(item => item?.shopName === sName)
                .reduce((total, item) => total + ((item?.price || 0) * (item?.quantity || 1)), 0);
            };

            return (
              <div key={order.id} style={{ 
                backgroundColor: "#16181a", borderRadius: "30px", border: `2px solid ${order.status === 'completed' ? '#2e7d32' : '#25282b'}`, 
                boxShadow: "0 15px 35px rgba(0,0,0,0.6)", overflow: "hidden", marginBottom: "20px" 
              }}>
                {/* رأس الكارت */}
                <div style={{ backgroundColor: "#1e2124", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#FF6600", fontWeight: "900" }}>فاتورة #{order.invoiceRef || '---'}</span>
                  <span style={{ color: "#aaa" }}>{order.orderTime || ''} | {order.orderDate || ''}</span>
                </div>

                <div style={{ padding: "20px" }}>
                  {/* بيانات العميل */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", color: "#fff" }}>{order.customer?.name || 'عميل مجهول'}</h3>
                      <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>📍 {order.customer?.address || 'بدون عنوان'}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <a href={`tel:${order.customer?.phone}`} style={{ textDecoration: "none", backgroundColor: "#28a745", color: "#fff", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", fontSize: "18px" }}>📞</a>
                      {order.location && (
                        <a href={order.location} target="_blank" rel="noreferrer" style={{ textDecoration: "none", backgroundColor: "#007bff", color: "#fff", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", fontSize: "18px" }}>📍</a>
                      )}
                    </div>
                  </div>

        {/* 🛒 عرض الأصناف مقسمة حسب المحل */}
                  <div style={{ backgroundColor: "#0b0c0d", borderRadius: "20px", padding: "15px" }}>
                    {order.items && typeof order.items === 'object' ? (
                      Object.keys(order.items)
                        .filter(shopName => activeTab === "الكل" || shopName === activeTab)
                        .map((shopName) => {
                          const shopItems = Array.isArray(order.items[shopName]) ? order.items[shopName] : Object.values(order.items[shopName]);
                          // إيجاد الـ ID الخاص بالمحل من قائمة shops المستوردة
                          const currentShopObj = shops.find(s => s.name === shopName);
                          
                          return (
                            <div key={shopName} style={{ marginBottom: "15px", borderBottom: "1px solid #1e2022", paddingBottom: "10px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ fontWeight: "bold", color: "#FF6600", fontSize: "14px" }}>🏪 {shopName}</span>

      {/* ✅ زر جراحي مطور لفتح لوحة المتجر المستقلة - حل مشكلة الـ 404 */}
                                  {currentShopObj && (
                                    <a 
                                      href={`https://minitalabat-shops.vercel.app/shop-admin/${currentShopObj.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      style={{ 
                                        fontSize: "11px", 
                                        backgroundColor: "#1a1c1e", 
                                        color: "#4caf50", 
                                        padding: "4px 10px", 
                                        borderRadius: "8px", 
                                        textDecoration: "none", 
                                        border: "1px solid #2d3035",
                                        fontWeight: "bold",
                                        width: "fit-content"
                                      }}
                                    >
                    فتح لوحة المحل ↗
                                    </a>
                                  )}
                                </div>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button onClick={() => printOrder(order, shopName)} style={{ backgroundColor: "#333", color: "#fff", border: "1px solid #444", padding: "6px 10px", borderRadius: "8px", fontSize: "10px", cursor: "pointer" }}>🖨️ طباعة</button>
                                    <button onClick={() => distributeOrder(order, shopName)} style={{ backgroundColor: "#25d366", color: "#000", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "10px", fontWeight: "900", cursor: "pointer" }}>ارسال ✅</button>
                                </div>
                              </div>
                              {shopItems.map((item, i) => (
                                <div key={i} style={{ fontSize: "13px", color: "#ddd", display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                  <span>{item?.name} <b>×{item?.quantity || 1}</b></span>
                                  <span>{(item?.price || 0) * (item?.quantity || 1)} ج</span>
                                </div>
                              ))}
                              <div style={{ textAlign: "left", fontSize: "11px", color: "#4caf50", marginTop: "5px", fontWeight: "bold" }}>
                                إجمالي المتجر: {getShopTotal(shopName)} ج.م
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div style={{ color: "#555", textAlign: "center", fontSize: "12px" }}>لا توجد تفاصيل للأصناف</div>
                    )}
                  </div>

                  {/* إجمالي الفاتورة النهائي */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "18px", alignItems: "center" }}>
                    <span style={{ color: "#888", fontSize: "13px" }}>{activeTab === "الكل" ? "الإجمالي الكلي للفاتورة:" : `حساب ${activeTab}:`}</span>
                    <span style={{ fontSize: "22px", fontWeight: "900", color: "#FF6600" }}>
                        {activeTab === "الكل" ? (order.total || 0) : getShopTotal(activeTab)} ج.م
                    </span>
                  </div>
                </div>
{/* أزرار التحكم السفلية */}
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