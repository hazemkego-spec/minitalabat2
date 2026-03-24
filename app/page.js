"use client";
import { db } from "../lib/firebase"; 
import { ref, push, set, serverTimestamp } from "firebase/database"; 
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Cart from "./components/Cart";
import InstallGuide from "./components/InstallGuide";
import shops from "./components/ShopList"; 
import ShopDetails from "./components/ShopDetails";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedShop, setSelectedShop] = useState(null);
  const [isSending, setIsSending] = useState(false); 
  
  const [showMultiOrderModal, setShowMultiOrderModal] = useState({ isOpen: false });
   
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e); 
    };

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || window.navigator.standalone === true;

    if (isIos && !isStandalone) {
      setShowIosPrompt(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); 
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null); 
  };

  const [cart, setCart] = useState({});
  const [itemNotes, setItemNotes] = useState({});
  
  const [customerInfo, setCustomerInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customer_data');
      return saved ? JSON.parse(saved) : { name: "", phone: "", address: "" };
    }
    return { name: "", phone: "", address: "" };
  });

  const updateCustomerInfo = (newData) => {
    setCustomerInfo(newData);
    localStorage.setItem('customer_data', JSON.stringify(newData));
  };

  const [locationUrl, setLocationUrl] = useState("");

  const addToCart = (shopName, item) => {
    const key = `${shopName}-${item.name}`;
    setCart((prev) => ({
      ...prev,
      [key]: prev[key]
        ? { ...prev[key], quantity: prev[key].quantity + 1 }
        : { ...item, quantity: 1, key }
    }));
  };

  const removeFromCart = (key) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[key];
      return newCart;
    });
  };

  const updateItemNote = (key, note) => {
    setItemNotes((prev) => ({ ...prev, [key]: note }));
  };

  const calculateTotal = () =>
    Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getGroupedCart = () => {
    const grouped = {};
    Object.values(cart).forEach((item) => {
      const shopName = item.key.split("-")[0];
      if (!grouped[shopName]) grouped[shopName] = [];
      grouped[shopName].push(item);
    });
    return grouped;
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationUrl(`https://www.google.com/maps?q=${latitude},${longitude}`);
      });
    }
  };     
  
  const sendOrder = async () => {
    if (isSending) return; 
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("يرجى إكمال بيانات العميل (الاسم، الهاتف، العنوان) أولاً");
      return;
    }

    if (Object.keys(cart).length === 0) {
      alert("السلة فارغة!");
      return;
    }

    // --- حساب التاريخ والوقت يدوياً لضمان الدقة المطلقة ---
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const dateStr = `${d}-${m}-${y}`;
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    // --------------------------------------------------

    setIsSending(true);

    try {
      const lastRef = typeof window !== 'undefined' ? (localStorage.getItem('invoice_ref') || 1000) : 1000;
      const newRef = parseInt(lastRef) + 1;
      if (typeof window !== 'undefined') localStorage.setItem('invoice_ref', newRef);

      const groupedCart = getGroupedCart();
      const totalAmount = calculateTotal();

      // حفظ في Firebase
      const orderData = {
        invoiceRef: newRef,
        customer: customerInfo,
        items: groupedCart,
        total: totalAmount,
        location: locationUrl,
        status: "pending",
        orderDate: dateStr,
        orderTime: timeStr,
        createdAt: serverTimestamp() 
      };

      const ordersRef = ref(db, 'orders');
      await set(push(ordersRef), orderData);

      // --- الضربة القاضية: تمرير البيانات المحسوبة للـ Modal ---
      setShowMultiOrderModal({ 
        isOpen: true, 
        fixedDate: dateStr, 
        fixedTime: timeStr,
        fixedRef: newRef 
      });

      // بناء رسالة المدير المجمعة
      const buildFullDetailMessage = () => {
        let msg = `*🚀 طلب جديد - فاتورة رقم: #${newRef}*\n`;
        msg += `*📅 التاريخ:* ${dateStr}\n`;
        msg += `*⏰ الوقت:* ${timeStr}\n`;
        msg += `*━━━━━━━━━━━━━━*\n`;
        msg += `*👤 العميل:* ${customerInfo.name}\n`;
        msg += `*📞 الهاتف:* ${customerInfo.phone}\n`;
        msg += `*📍 العنوان:* ${customerInfo.address}\n`;
        if (locationUrl) msg += `*🗺️ الموقع:* ${locationUrl}\n`;
        msg += `*━━━━━━━━━━━━━━*\n\n`;

        Object.keys(groupedCart).forEach((shopName) => {
          let shopSubtotal = 0;
          msg += `*🏪 متجر: ${shopName}*\n`;
          groupedCart[shopName].forEach((item) => {
            const itemTotal = item.quantity * item.price;
            shopSubtotal += itemTotal;
            const note = itemNotes[item.key] ? `\n   📝 ملاحظة: ${itemNotes[item.key]}` : "";
            msg += `• ${item.name} (${item.quantity} × ${item.price} ج.م) = ${itemTotal} ج.م${note}\n`;
          });
          msg += `*💰 إجمالي المتجر:* ${shopSubtotal} ج.م\n`;
          msg += `*--------------------*\n\n`;
        });

        msg += `*━━━━━━━━━━━━━━*\n`;
        msg += `*💵 الإجمالي الكلي: ${totalAmount} ج.م*\n`;
        msg += `*━━━━━━━━━━━━━━*\n`;
        return msg;
      };

      const adminWhatsapp = "201122947479"; 
      window.open(`https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(buildFullDetailMessage())}`, "_blank");

      // تصفير بيانات السلة فقط (النافذة ستظل مفتوحة ببياناتها الثابتة)
      setCart({});
      setItemNotes({});
      
    } catch (error) {
      console.error("❌ Error:", error);
      alert("حدث خطأ في الاتصال.");
    } finally {
      setIsSending(false);
    }
  };

  // --- تحديث الفلاتر ونافذة توزيع الطلبات ---
  const categories = ["الكل", "مطاعم", "صيدليات", "سوبر ماركت", "عطارة", "مصنعات اللحوم"];

  const filteredShops = shops.filter((shop) => {
    const matchCategory = selectedCategory === "الكل" || shop.category === selectedCategory;
    const lowerSearch = searchTerm.toLowerCase();
    const matchShopName = shop.name.toLowerCase().includes(lowerSearch);
    const matchMenuItem = shop.menuCategories?.some(cat => 
      cat.items.some(item => item.name.toLowerCase().includes(lowerSearch))
    );
    return matchCategory && (matchShopName || matchMenuItem);
  });

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff", paddingBottom: "80px", overflowX: "hidden" }}>
      
            {showMultiOrderModal.isOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.95)", zIndex: 20000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "15px"
        }}>
          <div style={{ 
            backgroundColor: "#1e1e1e", padding: "20px", borderRadius: "25px", 
            width: "100%", maxWidth: "400px", textAlign: "center", border: "2px solid #FF6600" 
          }}>
            <h3 style={{ color: "#FF6600", marginBottom: "10px" }}>تقسيم الطلبات 📦</h3>
            <p style={{ color: "#eee", fontSize: "13px", marginBottom: "15px" }}>يرجى إرسال كل طلب لمكانه المخصص:</p>
            
            <div style={{ maxHeight: "250px", overflowY: "auto", marginBottom: "15px" }}>
              {Object.keys(getGroupedCart()).map((shopName, index) => {
                const shopData = shops.find(s => s.name === shopName);
                const itemsInShop = getGroupedCart()[shopName];

                const buildShopSpecificMessage = () => {
                  // الضربة القاضية: سحب التاريخ والوقت الثابتين من الـ State
                  // دي البيانات اللي حسبناها في دالة sendOrder وبعتناها هنا
                  const { fixedDate, fixedTime, fixedRef } = showMultiOrderModal;

                  let shopSubtotal = 0;
                  let msg = `*📦 طلب جديد - فاتورة #${fixedRef || '---'}*\n`;
                  msg += `*📅 التاريخ:* ${fixedDate || '---'}\n`; 
                  msg += `*⏰ الوقت:* ${fixedTime || '---'}\n`;   
                  msg += `*━━━━━━━━━━━━━━*\n`;
                  msg += `*👤 العميل:* ${customerInfo.name}\n`;
                  msg += `*📍 العنوان:* ${customerInfo.address}\n`;
                  if (locationUrl) msg += `*🗺️ الموقع:* ${locationUrl}\n`;
                  msg += `*━━━━━━━━━━━━━━*\n\n`;
                  msg += `*الأصناف المطلوبة:*\n`;
                  
                  itemsInShop.forEach(item => {
                    const itemTotal = item.quantity * item.price;
                    shopSubtotal += itemTotal;
                    const note = itemNotes[item.key] ? `\n   📝 ملاحظة: ${itemNotes[item.key]}` : "";
                    msg += `• ${item.name} (${item.quantity} × ${item.price} ج.م) = ${itemTotal} ج.م${note}\n`;
                  });

                  msg += `\n*💰 إجمالي الحساب:* ${shopSubtotal} ج.م\n`;
                  return msg;
                };

                return (
                  <button
                    key={index}
                    onClick={() => {
                      const msg = buildShopSpecificMessage();
                      window.open(`https://wa.me/${shopData?.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
                    }}
                    style={{
                      width: "100%", padding: "12px", backgroundColor: "#fff", color: "#000",
                      borderRadius: "12px", fontWeight: "bold", marginBottom: "8px", border: "none",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                  >
                    <span>✅ إرسال لـ {shopName}</span>
                    <span style={{ fontSize: "16px" }}>➔</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                // إغلاق النافذة وتصفير السلة نهائياً
                setShowMultiOrderModal({ isOpen: false });
                setCart({});
                setItemNotes({});
              }}
              style={{ 
                width: "100%", padding: "15px", backgroundColor: "#FF6600", color: "#fff", 
                borderRadius: "15px", fontWeight: "bold", border: "none"
              }}
            >
              🏁 إنهاء وإغلاق القائمة
            </button>
          </div>
        </div>
      )}


      {deferredPrompt && activeTab === "home" && !selectedShop && (
        <div style={{
          backgroundColor: "#FF6600", padding: "12px 20px", display: "flex",
          justifyContent: "space-between", alignItems: "center", borderRadius: "12px",
          margin: "15px", boxShadow: "0 4px 15px rgba(255,102,0,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>📲</span>
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>ثبت التطبيق لطلب أسرع!</span>
          </div>
          <button 
            onClick={handleInstallClick}
            style={{
              backgroundColor: "#fff", color: "#FF6600", border: "none",
              padding: "8px 16px", borderRadius: "8px", fontWeight: "bold",
              fontSize: "13px", cursor: "pointer"
            }}
          >
            تثبيت الآن
          </button>
        </div>
      )}

      {showIosPrompt && activeTab === "home" && !selectedShop && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          backgroundColor: "#fff", color: "#333", padding: "20px",
          borderRadius: "20px 20px 0 0", zIndex: 10000,
          boxShadow: "0 -5px 25px rgba(0,0,0,0.4)", textAlign: "center",
          borderTop: "5px solid #FF6600"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#FF6600", fontSize: "18px" }}>ثبت تطبيق "ميني طلبات" 🚀</h3>
          <p style={{ fontSize: "14px", marginBottom: "15px", color: "#555" }}>اضغط مشاركة ⎋ ثم "إضافة للشاشة الرئيسية" ➕</p>
          <button 
            onClick={() => setShowIosPrompt(false)}
            style={{
              marginTop: "10px", width: "100%", padding: "12px",
              backgroundColor: "#FF6600", color: "#fff", border: "none",
              borderRadius: "12px", fontWeight: "bold"
            }}
          >
            حسناً، فهمت
          </button>
        </div>
      )}

  {activeTab === "home" && !selectedShop && (
  <>
    {/* 🖼️ 1. الـ Cover Section */}
    <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden" }}>
      <img
        src="/cover.png"
        alt="App Cover"
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "cover", 
          filter: "brightness(1) contrast(1.1)" 
        }}
      />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "40px", background: "linear-gradient(to top, #121212, transparent)"
      }}></div>
    </div>

    {/* 🎡 2. شعار المول مع إضاءة خلفية */}
    <div style={{ textAlign: "center", marginTop: "-45px", position: "relative", zIndex: 5 }}>
      <div style={{
        display: "inline-block",
        borderRadius: "50%",
        boxShadow: "0 0 25px 8px rgba(255,102,0,0.35)" 
      }}>
        <img
          src="/mall-logo.png"
          alt="Mall Logo"
          style={{
            width: "85px", height: "85px", borderRadius: "50%",
            border: "4px solid #121212", backgroundColor: "#fff"
          }}
        />
      </div>
    </div>

    {/* 🔍 3. شريط البحث (العدسة على اليسار + منع الزوم) */}
    <div style={{ padding: "5px 5px 3px" }}>
      <div style={{ position: "relative", width: "85%" }}>
        {/* ⬅️ العدسة الآن في أقصى اليسار */}
        <span style={{ 
          position: "absolute", 
          left: "12px", 
          top: "50%", 
          transform: "translateY(-50%)", 
          color: "#888", 
          fontSize: "14px",
          zIndex: 2 
        }}>🔍</span>
        
        <input
          type="text"
          placeholder="ابحث عن متجر أو صنف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%", 
            // padding-left كبير للعدسة، و padding-right عادي للنص العربي
            padding: "12px 15px 12px 40px", 
            borderRadius: "15px",
            border: "1px solid #333", 
            backgroundColor: "#1e1e1e",
            color: "#fff", 
            outline: "none", 
            fontSize: "16px", // 🛡️ يمنع الـ Zoom In التلقائي في الموبايل
            textAlign: "right" 
          }}
        />
      </div>
    </div>

    {/* 📑 4. شريط التصنيفات (Categories) */}
    <div style={{ 
      display: "flex", overflowX: "auto", padding: "10px 15px", gap: "8px", 
      scrollbarWidth: "none", position: "sticky", top: "0", zIndex: 10,
      backgroundColor: "#121212", borderBottom: "1px solid #252525" 
    }}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          style={{
            flex: "0 0 auto", padding: "8px 16px", borderRadius: "18px",
            border: "none", backgroundColor: selectedCategory === cat ? "#FF6600" : "#252525",
            color: selectedCategory === cat ? "#000" : "#fff",
            fontWeight: "bold", cursor: "pointer",
            transition: "all 0.3s ease", fontSize: "12px"
          }}
        >
          {cat}
        </button>
      ))}
    </div>

{/* عرض المتاجر المفلترة - نظام الزوجي المحسن (2 في كل صف) */}
<div style={{ 
  padding: "15px", 
  display: "grid", 
  gridTemplateColumns: "repeat(2, 1fr)", // عرض متجرين جنب بعض
  gap: "12px" // مسافة متوازنة بين الكروت
}}>
  {filteredShops.length === 0 ? (
    <div style={{ textAlign: "center", gridColumn: "span 2", padding: "40px 0" }}>
      <span style={{ fontSize: "40px" }}>🔍</span>
      <p style={{ color: "#888", marginTop: "10px" }}>لا توجد متاجر مطابقة لطلبك</p>
    </div>
  ) : (
    filteredShops.map((shop) => (
      <div
        key={shop.id}
        onClick={() => setSelectedShop(shop)}
        style={{
          position: "relative",
          height: "180px", // ارتفاع مناسب للمربع ليبرز تفاصيل الغلاف
          borderRadius: "20px",
          overflow: "hidden",
          cursor: "pointer",
          backgroundColor: "#1e1e1e",
          border: "1px solid #252525",
          boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
          transition: "transform 0.2s ease"
        }}
        onPointerDown={(e) => e.currentTarget.style.transform = "scale(0.96)"}
        onPointerUp={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {/* 🖼️ صورة الغلاف كخلفية كارت المتجر */}
        <img
          src={shop.cover || shop.logo} 
          alt={shop.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: "0.5",
            filter: "brightness(0.7)"
          }}
        />

        {/* 🌑 طبقة تدريج أسود لضمان وضوح البيانات */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.4) 50%, transparent 100%)"
        }}></div>

        {/* 🏷️ محتوى الكارت (اللوجو والاسم في المنتصف) */}
        <div style={{
          position: "absolute",
          bottom: "12px",
          right: "10px",
          left: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}>
          {/* اللوجو بحجم متناسق */}
          <div style={{ position: "relative", marginBottom: "8px" }}>
            <img
              src={shop.logo}
              alt={shop.name}
              style={{
                width: "48px", height: "48px", borderRadius: "12px",
                border: "2px solid #FF6600", backgroundColor: "#fff",
                objectFit: "contain", padding: "2px"
              }}
            />
            {shop.isOpen && (
              <span style={{
                position: "absolute", top: "-3px", left: "-3px",
                width: "10px", height: "10px", backgroundColor: "#4caf50",
                borderRadius: "50%", border: "2px solid #000"
              }}></span>
            )}
          </div>
          
          {/* اسم المحل - تصغير الخط وحمايته من التداخل */}
          <h4 style={{ 
            color: "#fff", 
            margin: "0", 
            fontSize: "13px", 
            fontWeight: "bold",
            lineHeight: "1.2",
            display: "-webkit-box",
            WebkitLineClamp: "1", // يظهر الاسم في سطر واحد فقط
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {shop.name}
          </h4>

          {/* حالة المحل */}
          <div style={{ marginTop: "4px" }}>
             <span style={{ 
               fontSize: "9px", 
               color: shop.isOpen ? "#4caf50" : "#f44336",
               fontWeight: "bold",
               backgroundColor: "rgba(0,0,0,0.3)",
               padding: "2px 6px",
               borderRadius: "4px"
             }}>
               {shop.isOpen ? "● مفتوح الآن" : "○ مغلق حالياً"}
             </span>
          </div>
        </div>
      </div>
    ))
  )}
</div>
      </>
    )}

      {activeTab === "home" && selectedShop && (
        <ShopDetails
          shop={selectedShop}
          onBack={() => setSelectedShop(null)}
          addToCart={addToCart}
        />
      )}

      {activeTab === "cart" && (
        <Cart
          cart={cart}
          itemNotes={itemNotes}
          removeFromCart={removeFromCart}
          updateItemNote={updateItemNote}
          calculateTotal={calculateTotal}
          getGroupedCart={getGroupedCart}
          customerInfo={customerInfo}
          setCustomerInfo={updateCustomerInfo}
          locationUrl={locationUrl}
          handleGetLocation={handleGetLocation}
          sendOrder={sendOrder} 
        />
      )}

      {activeTab === "addShop" && (
        <div style={{ paddingBottom: "20px" }}>
          <InstallGuide onClose={() => setActiveTab("home")} />
          <div style={{ padding: "20px", marginTop: "10px", backgroundColor: "#1e1e1e", margin: "15px", borderRadius: "15px", border: "1px solid #333" }}>
            <h3 style={{ color: "#FF6600", marginBottom: "15px", fontSize: "18px" }}>🚀 سجل متجرك معنا</h3>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "20px" }}>انضم لمنصة ميني طلبات وابدأ في استقبال أوردراتك إلكترونياً</p>
            
            <input
              type="text"
              placeholder="اسم المتجر"
              style={{ width: "100%", padding: "14px", marginBottom: "12px", borderRadius: "10px", border: "1px solid #333", backgroundColor: "#121212", color: "#fff", outline: "none" }}
            />
            <button 
              onClick={() => window.open(`https://wa.me/201122947479?text=${encodeURIComponent("أريد تسجيل متجر جديد في نظام ميني طلبات")}`)}
              style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "none", backgroundColor: "#FF6600", color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "15px" }}
            >
              إرسال طلب الانضمام
            </button>
          </div>
          <div style={{ padding: "15px", textAlign: "center" }}>
            <p style={{ color: "#888", fontSize: "13px" }}>للدعم الفني المباشر:</p>
            <a href="tel:201122947479" style={{ color: "#FF6600", fontSize: "20px", fontWeight: "bold", textDecoration: "none" }}>01122947479</a>
          </div>
        </div>
      )}

      <NavBar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === "home") setSelectedShop(null);
        }} 
        onBack={() => {
          setSelectedShop(null);
          setActiveTab("home");
        }}
        hasSelectedShop={!!selectedShop} 
        totalPrice={calculateTotal()} 
      />
    </div>
  );
}