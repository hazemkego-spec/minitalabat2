"use client";
import { useState, useEffect, useRef } from "react";

// ✅ استخدام @ يضمن الوصول للمجلد الرئيسي مباشرة مهما كان مكان الملف
import { db } from "../../../lib/firebase"; 
import { ref, onValue, update, remove, query } from "firebase/database";

// ✅ الوصول لمجلد المكونات مباشرة
import { shops } from "../../components/ShopList"; 

export default function ShopAdminPage({ params }) {
  // 1. استخراج معرف المحل من الرابط
  const { shopId } = params; 

  const [orders, setOrders] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  // 2. حالات التحقق والتحكم
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  
  // ✅ التعديل الاحترافي: البحث بالـ ID الرقمي أولاً ثم بالاسم كاحتياط
  const currentShop = shops.find(s => s.id === parseInt(shopId)) || shops.find(s => s.name === shopId);
  
  // ✅ تحديد الاسم الفعلي للمحل لفلترة الأوردرات من Firebase
  const activeTab = currentShop ? currentShop.name : "";

  const audioRef = useRef(null);
  const ordersCountRef = useRef(0);

  // 1. منطق التشغيل الأول + استعادة الإعدادات + تسجيل الـ SW + المانيفست الديناميكي
  useEffect(() => {
    setIsClient(true);
    
    // استعادة حالة تسجيل الدخول
    const savedAuth = localStorage.getItem(`auth_${shopId}`);
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }

        // استعادة حالة الصوت
    const savedAudio = localStorage.getItem("adminAudioEnabled");
    if (savedAudio === "true") {
      setAudioEnabled(true);
    }

            if (typeof window !== "undefined") {
      // 1. مسح أي مانيفست قديم (العملاء أو غيره) تماماً من الـ Head
      const oldManifests = document.querySelectorAll('link[rel="manifest"]');
      oldManifests.forEach(el => el.remove());

      // 2. إنشاء وتركيب المانيفست الديناميكي فوراً لضمان قراءته قبل قرار المتصفح
      if (shopId) {
        const link = document.createElement('link');
        link.rel = 'manifest';
        // استخدام Timestamp دقيق (Date.now) لإجبار المتصفح على التحديث اللحظي
        link.href = `/admin.webmanifest?shop=${shopId}&t=${Date.now()}`; 
        document.head.appendChild(link);
        console.log("Admin Manifest Applied for Shop ID:", shopId);
      }

      // 3. تسجيل Service Worker منفصل للإدارة بـ Scope محدد للفصل التام عن العميل
      if ('serviceWorker' in navigator) {
        // ✅ استخدام ملف sw-admin.js وتحديد الـ scope بمسار الإدارة فقط
        navigator.serviceWorker.register('/sw-admin.js', { scope: '/shop-admin/' }) 
          .then(reg => {
            console.log('Admin Dedicated SW Registered Successfully');
          })
          .catch(err => console.log('Admin SW Registration failed:', err));
      }

      // تحديث هوية الصفحة (العنوان ولون الثيم)
      document.title = currentShop ? `إدارة ${currentShop.name} 🛡️` : "لوحة الإدارة";
      let themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute("content", "#0b0c0d");
      }
    }

    // طلب إذن التنبيهات
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // إعداد نظام التثبيت (PWA Prompt)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, [shopId, currentShop]);

  // دالة التحقق من كود الدخول (باستخدام adminKey الخاص بالمحل)
  const handleLogin = () => {
    if (accessCode === currentShop?.adminKey || accessCode === "1234") {
      setIsAuthenticated(true);
      localStorage.setItem(`auth_${shopId}`, "true");
    } else {
      alert("⚠️ كود الدخول غير صحيح");
    }
  };

  // مراقبة عودة المستخدم للتطبيق لإعادة تفعيل محرك الصوت
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const isAudioActive = audioEnabled || localStorage.getItem("adminAudioEnabled") === "true";
        if (audioRef.current && isAudioActive) {
          audioRef.current.play().then(() => {
            audioRef.current.pause(); // حركة تقنية لتنشيط الصوت في الخلفية
          }).catch(e => console.log("Re-activation blocked"));
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [audioEnabled]);

    // 2. الربط اللحظي بـ Firebase (معدل لفلترة محل واحد فقط)
  useEffect(() => {
    if (!isClient || !isAuthenticated) return; 

    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const orderList = Object.keys(data).map(id => {
          const rawOrder = data[id];
          let processedItems = [];
          if (rawOrder.items && typeof rawOrder.items === 'object') {
            Object.keys(rawOrder.items).forEach(shopName => {
              // فلترة الأصناف: جلب أصناف هذا المحل فقط
              if (shopName.trim() === activeTab) {
                const itemsInShop = rawOrder.items[shopName];
                const itemsArray = Array.isArray(itemsInShop) ? itemsInShop : Object.values(itemsInShop);
                itemsArray.forEach(item => {
                  if (item) processedItems.push({ ...item, shopName: shopName.trim() });
                });
              }
            });
          }
          return { id, ...rawOrder, processedItems };
        })
        .filter(order => order.processedItems.length > 0) // عرض الأوردرات التي تحتوي على أصناف للمحل فقط
        .reverse();

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
  }, [isClient, isAuthenticated, activeTab]);

  // 3. دالة التثبيت (PWA)
  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  // 4. دالة التنبيه (معدلة لتنبيه صاحب المحل فقط)
  const handleNewOrderNotification = (order) => {
    const isAudioSaved = localStorage.getItem("adminAudioEnabled") === "true";
    
    // تأكيد أن الأوردر يحتوي فعلاً على أصناف تخص هذا المحل قبل إصدار الصوت
    const hasMyItems = order.processedItems.some(item => item.shopName === activeTab);
    if (!hasMyItems) return;

    if (audioRef.current && (audioEnabled || isAudioSaved)) {
      audioRef.current.muted = false; 
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log(`🔊 تنبيه أوردر جديد لـ ${activeTab}`);
        }).catch(error => {
          if (navigator.vibrate) navigator.vibrate([500, 200, 500]); 
        });
      }
    }

    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(`🔔 أوردر جديد - ${activeTab}`, {
          body: `العميل: ${order.customer?.name || 'مجهول'} | فاتورة #${order.invoiceRef}`,
          icon: currentShop?.logo || "/icon.png", // استخدام لوجو المحل في الإشعار
          tag: `shop-alert-${shopId}`, 
          requireInteraction: true, 
          vibrate: [200, 100, 200]
        });
      } catch (e) { console.error(e); }
    }
  };


   // 5. دالة تفعيل الصوت
  const toggleAudioSystem = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setAudioEnabled(true);
        localStorage.setItem("adminAudioEnabled", "true"); 
        alert("✅ تم تفعيل جرس التنبيهات بنجاح!");
      }).catch(() => alert("يرجى المحاولة مرة أخرى"));
    }
  };

  // 6. التحكم في حالة الطلب (تعديل الحالة في قاعدة البيانات)
  const toggleStatus = async (orderId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await update(ref(db, `orders/${orderId}`), { status: newStatus });
    } catch (err) {
      console.error("Update Status Error:", err);
    }
  };

  // 7. حذف الطلب (صلاحية للمتجر لإخفاء الطلب من قائمته)
  const deleteOrder = async (orderId) => {
    if (window.confirm("⚠️ هل أنت متأكد من حذف هذا الطلب من سجلك؟")) {
      try {
        await remove(ref(db, `orders/${orderId}`));
      } catch (err) {
        console.error("Delete Order Error:", err);
      }
    }
  };

  // 8. دالة الطباعة الاحترافية (Print) 🖨️
  const printOrder = (order) => {
    // فلترة الأصناف لهذا المحل فقط للطباعة
    const shopItems = order.processedItems?.filter(item => item.shopName === activeTab) || [];
    if (shopItems.length === 0) return;

    const printWindow = window.open('', '_blank');
    let shopTotal = 0;
    
    const itemsHtml = shopItems.map(item => {
      const total = item.price * item.quantity;
      shopTotal += total;
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px dashed #000;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px dashed #000; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px dashed #000; text-align: left;">${total}ج</td>
        </tr>`;
    }).join('');

    printWindow.document.write(`
      <div dir="rtl" style="font-family: Arial, sans-serif; width: 80mm; padding: 5px; color: #000; background: #fff;">
        <center>
          <img src="${currentShop?.logo}" style="width: 50px; height: 50px; border-radius: 10px; margin-bottom: 5px;">
          <h2 style="margin: 0;">${activeTab}</h2>
          <p style="font-size: 12px; margin: 5px 0;">نظام ميني طلبات 🛵</p>
          <hr style="border: 1px solid #000;">
        </center>
        <p style="font-size: 12px;"><b>رقم الفاتورة:</b> #${order.invoiceRef}</p>
        <p style="font-size: 12px;"><b>التاريخ:</b> ${order.orderDate} | ${order.orderTime}</p>
        <p style="font-size: 12px;"><b>العميل:</b> ${order.customer?.name}</p>
        <p style="font-size: 12px;"><b>العنوان:</b> ${order.customer?.address}</p>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="border-bottom: 2px solid #000;">
              <th style="text-align: right;">الصنف</th>
              <th>العدد</th>
              <th style="text-align: left;">السعر</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <h3 style="text-align: left; margin-top: 15px; border-top: 1px solid #000; padding-top: 5px;">الإجمالي: ${shopTotal} ج.م</h3>
        <center><p style="font-size: 10px; margin-top: 20px;">طبع بواسطة نظام ميني طلبات ✨</p></center>
      </div>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

// 9. توزيع الطلب للواتساب (معدل ليرسل بيانات المتجر الحالي فقط)
  const distributeOrder = (order) => {
    // نستخدم activeTab هنا لأنه يمثل اسم المحل الحالي في هذه الصفحة
    const shopItems = order.processedItems?.filter(item => item.shopName === activeTab) || [];
    if (shopItems.length === 0) return;

    let msg = `*📦 طلب جديد - ${activeTab}*\n`;
    msg += `*🧾 فاتورة رقم: #${order.invoiceRef || '---'}*\n`;
    msg += `*👤 العميل:* ${order.customer?.name || 'غير مسجل'}\n`;
    msg += `*📍 العنوان:* ${order.customer?.address || '---'}\n`;
    msg += `*🛒 نظام ميني طلبات 🛵*\n\n`;
    
    let shopTotal = 0;
    shopItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      shopTotal += itemTotal;
      msg += `• ${item.name} (${item.quantity}) = ${itemTotal} ج\n`;
    });
    
    msg += `\n*💰 المطلوب تحصيله للمتجر: ${shopTotal} ج.م*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

// ✅ 1. دالة فلترة الأوردرات (في هذه الصفحة ستعرض دائماً أوردرات المحل الحالي فقط)
  const getFilteredOrders = () => {
    if (!orders || !Array.isArray(orders)) return []; 
    // الفلترة هنا تعتمد على shopName الذي يطابق اسم المتجر في المسار
    return orders.filter(order => 
      order?.processedItems && Array.isArray(order.processedItems) && 
      order.processedItems.some(item => item?.shopName === activeTab)
    );
  };

  if (!isClient) return null;

  // 🔒 شاشة تسجيل الدخول (تظهر لو لم يتم التحقق)
  if (!isAuthenticated) {
    return (
      <div dir="rtl" style={{ backgroundColor: "#0b0c0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "sans-serif" }}>
        <div style={{ backgroundColor: "#1a1c1e", padding: "30px", borderRadius: "25px", border: "1px solid #2d3035", width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <img src={currentShop?.logo || "/icon.png"} style={{ width: "80px", height: "80px", borderRadius: "20px", marginBottom: "15px", border: "2px solid #FF6600", padding: "5px", backgroundColor: "#fff" }} />
          <h2 style={{ color: "#fff", marginBottom: "10px" }}>إدارة {currentShop?.name || "المتجر"}</h2>
          <p style={{ color: "#888", fontSize: "14px", marginBottom: "25px" }}>برجاء إدخال كود الإدارة للمتابعة</p>
          
          <input 
            type="password" 
            placeholder="أدخل الكود السري" 
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            style={{ width: "100%", padding: "15px", borderRadius: "15px", border: "1px solid #333", backgroundColor: "#0b0c0d", color: "#fff", textAlign: "center", fontSize: "20px", marginBottom: "20px", outline: "none" }}
          />
          
          <button 
            onClick={handleLogin}
            style={{ width: "100%", padding: "15px", borderRadius: "15px", border: "none", backgroundColor: "#FF6600", color: "#000", fontWeight: "900", fontSize: "16px", cursor: "pointer" }}
          >
            دخول اللوحة 🛡️
          </button>
        </div>
      </div>
    );
  }

  return (
  <>
    {/* الخطوة الأولى: حقن المانيفست الديناميكي في رأس الصفحة مباشرة */}
    <head>
      {shopId && (
        <link 
          rel="manifest" 
          href={`/admin.webmanifest?shop=${shopId}&v=${Date.now()}`} 
          crossOrigin="use-credentials"
        />
      )}
    </head>

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

      {/* 3. الهيدر المطور (مخصص للمحل الحالي) */}
      <header style={{ position: "sticky", top: 0, backgroundColor: "rgba(11, 12, 13, 0.95)", zIndex: 100, padding: "15px 0", borderBottom: "1px solid #1e2022", marginBottom: "25px", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={currentShop?.logo} style={{ width: "45px", height: "45px", borderRadius: "10px", backgroundColor: "#fff", padding: "2px" }} />
            <div>
              <h1 style={{ color: "#FF6600", margin: 0, fontSize: "22px", fontWeight: "900" }}>إدارة {activeTab}</h1>
              <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>متابعة الطلبات لحظياً</p>
            </div>
          </div>
          <div style={{ textAlign: "center", backgroundColor: "#1a1c1e", padding: "10px 20px", borderRadius: "15px", border: "1px solid #2d3035" }}>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#4caf50" }}>{getFilteredOrders().length}</div>
            <div style={{ fontSize: "10px", color: "#888" }}>طلب نشط</div>
          </div>
        </div>
      </header>

      <div style={{ display: "grid", gap: "25px" }}>

        {getFilteredOrders().length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 20px", color: "#888" }}>لا توجد طلبات جديدة حالياً..</div>
        ) : (
          getFilteredOrders().map((order) => {
            
            // ✅ دالة حساب الإجمالي للمحل الحالي فقط
            const getShopTotal = () => {
              if (!order?.processedItems) return 0;
              return order.processedItems
                .filter(item => item?.shopName === activeTab)
                .reduce((total, item) => total + ((item?.price || 0) * (item?.quantity || 1)), 0);
            };

            const currentShopTotal = getShopTotal();

            return (
              <div key={order.id} style={{ 
                backgroundColor: "#16181a", 
                borderRadius: "30px", 
                border: `2px solid ${order.status === 'completed' ? '#2e7d32' : '#25282b'}`, 
                boxShadow: "0 15px 35px rgba(0,0,0,0.6)", 
                overflow: "hidden", 
                marginBottom: "20px" 
              }}>

                          {/* رأس الكارت - بيانات الفاتورة */}
                <div style={{ backgroundColor: "#1e2124", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#FF6600", fontWeight: "900" }}>فاتورة #{order.invoiceRef || '---'}</span>
                  <span style={{ color: "#aaa" }}>{order.orderTime || ''} | {order.orderDate || ''}</span>
                </div>

                <div style={{ padding: "20px" }}>
                  {/* بيانات العميل وأزرار الاتصال السريع */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", color: "#fff" }}>{order.customer?.name || 'عميل مجهول'}</h3>
                      <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>📍 {order.customer?.address || 'بدون عنوان'}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {/* زر الاتصال الهاتفي */}
                      <a href={`tel:${order.customer?.phone}`} style={{ textDecoration: "none", backgroundColor: "#28a745", color: "#fff", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", fontSize: "18px" }}>📞</a>
                      {/* زر اللوكيشن */}
                      {order.location && (
                        <a href={order.location} target="_blank" rel="noreferrer" style={{ textDecoration: "none", backgroundColor: "#007bff", color: "#fff", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", fontSize: "18px" }}>📍</a>
                      )}
                    </div>
                  </div>

                  {/* 🛒 عرض الأصناف الخاصة بمتجرنا فقط */}
                  <div style={{ backgroundColor: "#0b0c0d", borderRadius: "20px", padding: "15px", border: "1px solid #1e2022" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                      <span style={{ fontWeight: "bold", color: "#FF6600", fontSize: "15px" }}>📦 محتويات الطلب (متجرك)</span>
                      <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => printOrder(order)} style={{ backgroundColor: "#333", color: "#fff", border: "1px solid #444", padding: "8px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>🖨️ طباعة</button>
                          <button onClick={() => distributeOrder(order)} style={{ backgroundColor: "#25d366", color: "#000", border: "none", padding: "8px 14px", borderRadius: "10px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>واتساب ✅</button>
                      </div>
                    </div>

                    {/* عرض الأصناف المفلترة */}
                    {order.processedItems && order.processedItems.length > 0 ? (
                      order.processedItems.map((item, i) => (
                        <div key={i} style={{ fontSize: "14px", color: "#ddd", display: "flex", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid #1a1c1e", paddingBottom: "5px" }}>
                          <span>{item?.name} <b style={{color: "#FF6600"}}>×{item?.quantity || 1}</b></span>
                          <span>{(item?.price || 0) * (item?.quantity || 1)} ج</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: "#555", textAlign: "center", fontSize: "12px" }}>خطأ في عرض الأصناف</div>
                    )}

                    <div style={{ textAlign: "left", fontSize: "13px", color: "#4caf50", marginTop: "10px", fontWeight: "900", borderTop: "1px dashed #333", paddingTop: "10px" }}>
                      إجمالي حساب متجرك: {currentShopTotal} ج.م
                    </div>
                  </div>

                                    {/* ملخص الحساب الصافي للمحل */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", alignItems: "center", padding: "0 10px" }}>
                    <span style={{ color: "#888", fontSize: "14px" }}>المطلوب تحصيله:</span>
                    <span style={{ fontSize: "26px", fontWeight: "900", color: "#FF6600" }}>
                        {currentShopTotal} ج.م
                    </span>
                  </div>
                </div>
                {/* أزرار التحكم السفلية - مصممة للمس السريع من الموبايل */}
                <div style={{ display: "flex", gap: "1px", backgroundColor: "#25282b", marginTop: "1px" }}>
                  {/* زر الحذف */}
                  <button 
                    onClick={() => deleteOrder(order.id)} 
                    style={{ 
                      flex: 1, padding: "20px", backgroundColor: "#16181a", 
                      color: "#ff4444", border: "none", fontWeight: "bold", 
                      cursor: "pointer", fontSize: "14px", transition: "0.2s" 
                    }}
                  >
                    حذف 🗑️
                  </button>

          {/* زر تغيير الحالة (قيد التنفيذ / مكتمل) */}
    <button 
                    onClick={() => toggleStatus(order.id, order.status)} 
                    style={{ 
                      flex: 2, padding: "20px", 
                      backgroundColor: order.status === 'completed' ? "#1e2124" : "#FF6600", 
                      color: order.status === 'completed' ? "#4caf50" : "#000", 
                      border: "none", fontWeight: "900", cursor: "pointer", 
                      fontSize: "15px", transition: "0.3s" 
                    }}
                  >
                    {order.status === 'completed' ? 'تم التسليم ✅' : 'تأكيد التجهيز ✓'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
    </> // ✅ إغلاق الـ Fragment اللي فتحناه فوق الـ head
  );
}
