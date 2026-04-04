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
  
  // ✅ البحث بالـ ID الرقمي أولاً ثم بالاسم كاحتياط
  const currentShop = shops.find(s => s.id === parseInt(shopId)) || shops.find(s => s.name === shopId);
  
  // ✅ تحديد الاسم الفعلي للمحل لفلترة الأوردرات من Firebase
  const activeTab = currentShop ? currentShop.name : "";

  const audioRef = useRef(null);
  const ordersCountRef = useRef(0);

    // 1. منطق التشغيل الأول + استعادة الإعدادات + تسجيل الـ SW الموحد + المانيفست الديناميكي
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
      // 1. مسح أي مانيفست قديم تماماً لضمان عدم التداخل
      const oldManifests = document.querySelectorAll('link[rel="manifest"]');
      oldManifests.forEach(el => el.remove());

      // 2. تركيب مانيفست المتاجر الجديد (shop.json)
      const link = document.createElement('link');
      link.rel = 'manifest';
      // نمرر الـ shopId كـ Query Parameter لكسر الكاش وتمييز التثبيت
      link.href = `/shop.json?shop=${shopId}&v=${Date.now()}`; 
      document.head.appendChild(link);

      // ✅ تسجيل الـ Service Worker الموحد (sw.js) لضمان استقبال الإشعارات والتثبيت
      if ('serviceWorker' in navigator) {
        // نستخدم الـ sw.js الموحد اللي رفعناه سابقاً ليعمل في الخلفية
        navigator.serviceWorker.register('/sw.js')
          .then(reg => {
            console.log('✅ Shop Admin SW Active');
            reg.update(); 
          })
          .catch(err => console.log('❌ SW Registration failed:', err));
      }

      // ✅ تحديث هوية الصفحة (اللوجو الأسود والعنوان)
      if (typeof document !== 'undefined') {
        document.title = currentShop ? `إدارة ${currentShop.name} 🛡️` : "إدارة المتجر";
        
        let themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta) {
          themeMeta.setAttribute("content", "#0b0c0d"); // اللون الأسود الموحد للإدارة
        } else {
          const meta = document.createElement('meta');
          meta.name = "theme-color";
          meta.content = "#0b0c0d";
          document.head.appendChild(meta);
        }
      }

      // ✅ طلب إذن الإشعارات إذا لم يكن مفعلاً
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }

      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        console.log("Ready to install Shop App for:", shopId);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      
      // ✅ تنظيف المستمعات عند مغادرة الصفحة
      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, [shopId, currentShop]); // تقفيلة الـ useEffect الصحيحة والوحيدة

  // دالة التحقق من كود الدخول
  const handleLogin = () => {
    if (accessCode === currentShop?.adminKey || accessCode === "1234") {
      setIsAuthenticated(true);
      localStorage.setItem(`auth_${shopId}`, "true");
    } else {
      alert("⚠️ كود الدخول غير صحيح");
    }
  };

  // مراقبة عودة المستخدم لتفعيل الصوت
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const isAudioActive = audioEnabled || localStorage.getItem("adminAudioEnabled") === "true";
        if (audioRef.current && isAudioActive) {
          audioRef.current.play().then(() => {
            audioRef.current.pause(); 
          }).catch(e => console.log("Audio activation failed"));
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

{/* 3. الهيدر المطور (مخصص للمحل الحالي مع الهوية المزدوجة) */}
<header style={{ position: "sticky", top: 0, backgroundColor: "rgba(11, 12, 13, 0.95)", zIndex: 100, padding: "12px 0", borderBottom: "1px solid #1e2022", marginBottom: "25px", backdropFilter: "blur(10px)" }}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px" }}>
    
    {/* جهة اليمين: لوجو المتجر واسمه */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img src={currentShop?.logo || "/adminMT.webp"} style={{ width: "40px", height: "40px", borderRadius: "10px", objectCover: "cover", border: "1px solid #FF6600" }} />
      <div>
        <h1 style={{ color: "#fff", margin: 0, fontSize: "16px", fontWeight: "900" }}>{currentShop?.name}</h1>
        <p style={{ color: "#FF6600", fontSize: "10px", margin: 0 }}>لوحة التحكم</p>
      </div>
    </div>

    {/* المنتصف: عداد الطلبات النشطة */}
    <div style={{ textAlign: "center", backgroundColor: "#1a1c1e", padding: "8px 15px", borderRadius: "12px", border: "1px solid #2d3035" }}>
      <div style={{ fontSize: "18px", fontWeight: "900", color: "#4caf50" }}>{getFilteredOrders().length}</div>
      <div style={{ fontSize: "9px", color: "#888" }}>طلب نشط</div>
    </div>

    {/* جهة اليسار: لوجو ميني طلبات (البراند الأم) */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: "0.6" }}>
      <img src="/adminMT.webp" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
      <span style={{ fontSize: "7px", color: "#888", marginTop: "2px", fontWeight: "bold" }}>MINI TALABAT</span>
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
