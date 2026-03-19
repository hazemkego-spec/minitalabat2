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

    // --- حساب التاريخ والوقت مرة واحدة بجودة عالية ---
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const dateStr = `${d}-${m}-${y}`;
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    // -----------------------------------------------

    setIsSending(true);

    try {
      const lastRef = typeof window !== 'undefined' ? (localStorage.getItem('invoice_ref') || 1000) : 1000;
      const newRef = parseInt(lastRef) + 1;
      if (typeof window !== 'undefined') localStorage.setItem('invoice_ref', newRef);

      const groupedCart = getGroupedCart();
      const totalAmount = calculateTotal();

      // حفظ في Firebase باستخدام نفس التاريخ والوقت
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
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderData);

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

      // تصفير البيانات وإغلاق النافذة
      setCart({});
      setItemNotes({});
      setShowMultiOrderModal({ isOpen: false });
      
      alert("تم إرسال طلبك بنجاح!");

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
            
            <div style={{ maxHeight: "250px", overflowY: "auto", marginBottom: "15px" }}>
              {Object.keys(getGroupedCart()).map((shopName, index) => {
                const shopData = shops.find(s => s.name === shopName);
                const itemsInShop = getGroupedCart()[shopName];

                const buildShopSpecificMessage = () => {
  const now = new Date();
  
  // 1. استخراج الأرقام يدوياً (أضمن طريقة في العالم)
  const day = now.getDate();
  const month = now.getMonth() + 1; // الشهور بتبدأ من 0
  const year = now.getFullYear();
  
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // تحويل الساعة لنظام 12 ساعة
  hours = hours % 12;
  hours = hours ? hours : 12; 
  
  // إضافة صفر على الشمال لو الرقم أقل من 10 (عشان الشكل يبقى نظيف)
  const cleanDay = day < 10 ? '0' + day : day;
  const cleanMonth = month < 10 ? '0' + month : month;
  const cleanMinutes = minutes < 10 ? '0' + minutes : minutes;
  const cleanHours = hours < 10 ? '0' + hours : hours;

  // 2. تجميع التاريخ والوقت كنص عادي (String)
  const finalDate = `${cleanDay}-${cleanMonth}-${year}`;
  const finalTime = `${cleanHours}:${cleanMinutes} ${ampm}`;

  let shopSubtotal = 0;
  let msg = `*📦 طلب جديد من ميني طلبات*\n`;
  msg += `*📅 التاريخ:* ${finalDate}\n`;
  msg += `*⏰ الوقت:* ${finalTime}\n`;
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
              onClick={() => sendOrder()}
              style={{ 
                width: "100%", padding: "15px", backgroundColor: "#FF6600", color: "#fff", 
                borderRadius: "15px", fontWeight: "bold", border: "none"
              }}
            >
              🏁 إتمام الأوردر وحفظ البيانات
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
          <img
            src="/cover.png"
            alt="App Cover"
            style={{ width: "100%", height: "165px", objectFit: "cover" }}
          />
          <div style={{ textAlign: "center", marginTop: "-40px" }}>
            <img
              src="/mall-logo.png"
              alt="Mall Logo"
              style={{
                width: "80px", height: "80px", borderRadius: "50%",
                border: "3px solid #FF6600", backgroundColor: "#fff"
              }}
            />
          </div>

        <div style={{ padding: "15px" }}>
          <input
            type="text"
            placeholder="ابحث عن متجر أو صنف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              border: "1px solid #333", backgroundColor: "#1e1e1e",
              color: "#fff", outline: "none"
            }}
          />
        </div>

        <div style={{ display: "flex", overflowX: "auto", padding: "10px", gap: "10px", scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                flex: "0 0 auto", padding: "8px 18px", borderRadius: "20px",
                border: "none", backgroundColor: selectedCategory === cat ? "#FF6600" : "#252525",
                color: "#fff", fontWeight: "bold", cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

             {/* عرض المتاجر المفلترة */}
        <div style={{ 
          padding: "15px", display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "15px" 
        }}>
          {filteredShops.length === 0 ? (
            <div style={{ textAlign: "center", width: "100%", padding: "40px 0" }}>
              <span style={{ fontSize: "40px" }}>🔍</span>
              <p style={{ color: "#888", marginTop: "10px" }}>لا توجد متاجر مطابقة لطلبك</p>
            </div>
          ) : (
            filteredShops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => setSelectedShop(shop)}
                style={{
                  backgroundColor: "#1e1e1e", borderRadius: "20px",
                  padding: "15px", textAlign: "center", cursor: "pointer",
                  border: "1px solid #252525", transition: "transform 0.2s",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                }}
              >
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    style={{
                      width: "75px", height: "75px", borderRadius: "18px",
                      border: "2px solid #FF6600", backgroundColor: "#fff",
                      marginBottom: "10px", objectFit: "contain", padding: "5px"
                    }}
                  />
                  {shop.isOpen && (
                    <span style={{
                      position: "absolute", top: "-5px", right: "-5px",
                      width: "12px", height: "12px", backgroundColor: "#4caf50",
                      borderRadius: "50%", border: "2px solid #1e1e1e"
                    }}></span>
                  )}
                </div>
                <h4 style={{ color: "#fff", margin: "2px 0", fontSize: "14px", fontWeight: "bold" }}>{shop.name}</h4>
                <span style={{ fontSize: "11px", color: shop.isOpen ? "#4caf50" : "#f44336" }}>
                  {shop.isOpen ? "مفتوح الآن" : "مغلق حالياً"}
                </span>
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
