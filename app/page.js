"use client";
import { db } from "./lib/firebase"; // استدعاء ملف الربط اللي عملناه
import { ref, push, set } from "firebase/database"; // دوال التعامل مع السيرفر
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
  
  // حالة نافذة توزيع الطلبات المتعددة
  const [showMultiOrderModal, setShowMultiOrderModal] = useState({ isOpen: false });
   
  // 1. تعريف حالة رسالة التثبيت الأصلية
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  // 2. مراقبة حدث التثبيت من المتصفح
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e); 
    };

    // --- الجزء الخاص بالآيفون ---
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || window.navigator.standalone === true;

    if (isIos && !isStandalone) {
      setShowIosPrompt(true);
    }
    // ----------------------------

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // 3. دالة تنفيذ التثبيت عند ضغط الزر
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); 
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null); 
  };

  // بيانات السلة
  const [cart, setCart] = useState({});
  const [itemNotes, setItemNotes] = useState({});
  
  // بيانات العميل المحفوظة
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

    const sendOrder = async () => { // أضفنا async هنا للتعامل مع السيرفر
    // 1. تحديث رقم الفاتورة (نفس منطقك القديم)
    const lastRef = typeof window !== 'undefined' ? (localStorage.getItem('invoice_ref') || 1000) : 1000;
    const newRef = parseInt(lastRef) + 1;
    if (typeof window !== 'undefined') localStorage.setItem('invoice_ref', newRef);

    const date = new Date().toLocaleDateString('ar-EG');
    const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const groupedCart = getGroupedCart();
    const shopsInCart = Object.keys(groupedCart);

    // --- [بداية الجزء الجديد: الإرسال لـ Firebase] ---
    try {
      const orderData = {
        invoiceRef: newRef,
        customer: customerInfo,
        items: groupedCart,
        total: calculateTotal(),
        location: locationUrl,
        status: "pending", // حالة أولية للطلب
        timestamp: new Date().toISOString()
      };

      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderData);
      console.log("✅ Order saved to Firebase!");
    } catch (error) {
      console.error("❌ Firebase Error:", error);
    }
    // --- [نهاية الجزء الجديد] ---

    // دالة بناء الرسالة (كما هي بدون تغيير)
    const buildMessage = (targetShopName = null) => {
      let msg = `*🧾 فاتورة رقم: #${newRef}*\n`;
      msg += `*━━━━━━━━━━━━━━*\n`;
      msg += `*📅 ${date} | ⏰ ${time}*\n`;
      msg += `*👤 العميل:* ${customerInfo.name}\n`;
      msg += `*📞 الهاتف:* ${customerInfo.phone}\n`;
      if (locationUrl) msg += `📍 الموقع: ${locationUrl}\n`;
      msg += `*━━━━━━━━━━━━━━*\n\n`;

      if (targetShopName) {
        msg += `*🛒 طلبات متجر: ${targetShopName}*\n`;
        let shopTotal = 0;
        groupedCart[targetShopName].forEach((item) => {
          const itemTotal = item.price * item.quantity;
          shopTotal += itemTotal;
          msg += `• *${item.name}* (${item.quantity}) ← *${itemTotal} ج*\n`;
          if (itemNotes[item.key]) msg += `  📝 ملحوظة: ${itemNotes[item.key]}\n`;
        });
        msg += `\n*💰 إجمالي المتجر: ${shopTotal} ج.م*`;
      } else {
        Object.keys(groupedCart).forEach((shop) => {
          msg += `*🏪 متجر: ${shop}*\n`;
          let shopSubTotal = 0;
          groupedCart[shop].forEach((item) => {
            const itemTotal = item.price * item.quantity;
            shopSubTotal += itemTotal;
            msg += `• *${item.name}* (${item.quantity}) ← *${itemTotal} ج*\n`;
          });
          msg += `*Subtotal: ${shopSubTotal} ج.م*\n`;
          msg += `*──────────────*\n`;
        });
        msg += `\n*🏆 الإجمالي الكلي للمطلوب: ${calculateTotal()} ج.م*`;
      }
      msg += `\n\n*عبر تطبيق Mini Talabat 🚀*`;
      return msg;
    };

    // المنطق الذكي للتوزيع (كما هو بدون تغيير)
    if (shopsInCart.length === 1) {
      const shopName = shopsInCart[0];
      const shopData = shops.find(s => s.name === shopName);
      const shopWhatsapp = shopData?.whatsapp || "201122947479"; 
      
      window.open(`https://wa.me/${shopWhatsapp}?text=${encodeURIComponent(buildMessage(shopName))}`, "_blank");
      
      setTimeout(() => {
        window.open(`https://wa.me/201122947479?text=${encodeURIComponent(buildMessage())}`, "_blank");
      }, 1500);

    } else {
      setShowMultiOrderModal({
        isOpen: true,
        ref: newRef,
        date,
        time,
        buildMessage 
      });
    }
  };

   const categories = ["الكل", "مطاعم", "صيدليات", "سوبر ماركت", "عطارة", "مصنعات اللحوم"];

  const filteredShops = shops.filter((shop) => {
    const matchCategory = selectedCategory === "الكل" || shop.category === selectedCategory;
    const lowerSearch = searchTerm.toLowerCase();
    const matchShopName = shop.name.toLowerCase().includes(lowerSearch);
    const matchMenuItem = shop.menuCategories?.some(category => 
      category.items.some(item => item.name.toLowerCase().includes(lowerSearch))
    );
    return matchCategory && (matchShopName || matchMenuItem);
  });

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff", paddingBottom: "80px", overflowX: "hidden" }}>
      
      {/* نافذة توزيع الطلبات الذكية (تظهر فقط عند الحاجة) */}
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
                return (
                  <button
                    key={index}
                    onClick={() => {
                      const msg = showMultiOrderModal.buildMessage(shopName);
                      window.open(`https://wa.me/${shopData?.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
                    }}
                    style={{
                      width: "100%", padding: "12px", backgroundColor: "#fff", color: "#000",
                      borderRadius: "12px", fontWeight: "bold", marginBottom: "8px", border: "none",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                  >
                    <span>✅ طلب {shopName}</span>
                    <span style={{ fontSize: "16px" }}>➔</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                const adminMsg = showMultiOrderModal.buildMessage();
                window.open(`https://wa.me/201122947479?text=${encodeURIComponent(adminMsg)}`, "_blank");
                setShowMultiOrderModal({ isOpen: false });
              }}
              style={{ 
                width: "100%", padding: "15px", backgroundColor: "#FF6600", color: "#fff", 
                borderRadius: "15px", fontWeight: "bold", border: "none"
              }}
            >
              🏁 إتمام وإرسال التقرير للمدير
            </button>
          </div>
        </div>
      )}

      {/* عرض بانر التثبيت للأندرويد */}
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

      {/* رسالة مخصصة لمستخدمي الآيفون */}
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

      {/* المحتوى الرئيسي */}
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

        {/* شريط البحث */}
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

        {/* شريط التصنيفات السريع */}
        <div style={{ display: "flex", overflowX: "auto", padding: "10px", gap: "10px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                flex: "0 0 auto", padding: "8px 15px", borderRadius: "20px",
                border: "none", backgroundColor: selectedCategory === cat ? "#FF6600" : "#333",
                color: "#fff", fontWeight: "bold", cursor: "pointer"
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
            <p style={{ textAlign: "center", width: "100%", color: "#888" }}>لا توجد متاجر مطابقة 🔍</p>
          ) : (
            filteredShops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => setSelectedShop(shop)}
                style={{
                  backgroundColor: "#1e1e1e", borderRadius: "15px",
                  padding: "10px", textAlign: "center", cursor: "pointer",
                  border: "1px solid #222"
                }}
              >
                <img
                  src={shop.logo}
                  alt={shop.name}
                  style={{
                    width: "70px", height: "70px", borderRadius: "20%",
                    border: "2px solid #FF6600", backgroundColor: "#fff",
                    marginBottom: "10px", objectFit: "contain"
                  }}
                />
                <h4 style={{ color: "#fff", margin: "2px 0", fontSize: "14px" }}>{shop.name}</h4>
                <span
                  style={{
                    fontSize: "11px",
                    color: shop.isOpen ? "#4caf50" : "#f44336"
                  }}
                >
                  {shop.isOpen ? "● مفتوح الآن" : "● مغلق"}
                </span>
              </div>
            ))
          )}
        </div>
      </>
    )}

      {/* صفحة المتجر منفصلة */}
      {activeTab === "home" && selectedShop && (
        <ShopDetails
          shop={selectedShop}
          onBack={() => setSelectedShop(null)}
          addToCart={addToCart}
        />
      )}

      {/* صفحة السلة */}
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

      {/* صفحة إضافة متجر ودليل التثبيت */}
      {activeTab === "addShop" && (
        <>
          <InstallGuide onClose={() => setActiveTab("home")} />
          <div style={{ padding: "15px", marginTop: "20px" }}>
            <h3 style={{ color: "#fff", marginBottom: "15px" }}>أدخل بيانات متجرك الجديد:</h3>
            <input
              type="text"
              placeholder="اسم المتجر"
              style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#1e1e1e", color: "#fff" }}
            />
            <input
              type="text"
              placeholder="الفئة (مطعم، صيدلية...)"
              style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#1e1e1e", color: "#fff" }}
            />
            <button style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#FF6600", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
              حفظ المتجر
            </button>
          </div>
          <div style={{ padding: "15px", marginTop: "20px", textAlign: "center" }}>
            <p style={{ color: "#888", fontSize: "14px" }}>للتواصل معنا مباشرة:</p>
            <strong style={{ color: "#FF6600", fontSize: "18px" }}>01122947479</strong>
          </div>
        </>
      )}

      {/* NavBar المطور مع عرض الإجمالي وزر الرجوع */}
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
