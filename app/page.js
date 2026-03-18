"use client";
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
  const [showMultiOrderModal, setShowMultiOrderModal] = useState({ isOpen: false });
   
  // تعريف حالة رسالة التثبيت
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
    setDeferredPrompt(null);
  };

  // بيانات السلة والعميل
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
  const sendOrder = () => {
    const lastRef = typeof window !== 'undefined' ? (localStorage.getItem('invoice_ref') || 1000) : 1000;
    const newRef = parseInt(lastRef) + 1;
    if (typeof window !== 'undefined') localStorage.setItem('invoice_ref', newRef);

    const date = new Date().toLocaleDateString('ar-EG');
    const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const groupedCart = getGroupedCart();
    const shopsInCart = Object.keys(groupedCart);

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
        groupedCart[targetShopName].forEach((item) => {
          msg += `• *${item.name}* (الكمية: ${item.quantity}) ← *${item.price * item.quantity} ج*\n`;
          if (itemNotes[item.key]) msg += `  📝 ملحوظة: ${itemNotes[item.key]}\n`;
        });
      } else {
        Object.keys(groupedCart).forEach((shop) => {
          msg += `*🏪 متجر: ${shop}*\n`;
          groupedCart[shop].forEach((item) => {
            msg += `• *${item.name}* (${item.quantity}) ← *${item.price * item.quantity} ج*\n`;
          });
        });
        msg += `\n*💰 الإجمالي الكلي: ${calculateTotal()} ج.م*\n`;
      }
      msg += `\n*عبر تطبيق Mini Talabat 🚀*`;
      return msg;
    };

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
      
      {/* بانر التثبيت للأندرويد */}
      {deferredPrompt && activeTab === "home" && !selectedShop && (
        <div style={{ backgroundColor: "#FF6600", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "12px", margin: "15px", boxShadow: "0 4px 15px rgba(255,102,0,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>📲</span>
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>ثبت التطبيق لطلب أسرع!</span>
          </div>
          <button onClick={handleInstallClick} style={{ backgroundColor: "#fff", color: "#FF6600", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px" }}>تثبيت الآن</button>
        </div>
      )}

      {/* دليل التثبيت للآيفون */}
      {showIosPrompt && activeTab === "home" && !selectedShop && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", color: "#333", padding: "20px", borderRadius: "20px 20px 0 0", zIndex: 10000, boxShadow: "0 -5px 25px rgba(0,0,0,0.4)", textAlign: "center", borderTop: "5px solid #FF6600" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#FF6600", fontSize: "18px" }}>ثبت تطبيق "ميني طلبات" 🚀</h3>
          <p style={{ fontSize: "14px", marginBottom: "15px", color: "#555" }}>1️⃣ اضغط مشاركة ⎋ | 2️⃣ إضافة للشاشة الرئيسية ➕</p>
          <button onClick={() => setShowIosPrompt(false)} style={{ width: "100%", padding: "12px", backgroundColor: "#FF6600", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "bold" }}>حسناً، فهمت</button>
        </div>
      )}

      {/* نافذة توزيع الطلبات المتعددة */}
      {showMultiOrderModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.95)", zIndex: 20000, display: "flex", alignItems: "center", justifyContent: "center", padding: "15px" }}>
          <div style={{ backgroundColor: "#1e1e1e", padding: "20px", borderRadius: "25px", width: "100%", maxWidth: "400px", textAlign: "center", border: "2px solid #FF6600" }}>
            <h3 style={{ color: "#FF6600", marginBottom: "10px" }}>تقسيم الطلبات 📦</h3>
            <div style={{ maxHeight: "250px", overflowY: "auto", marginBottom: "15px" }}>
              {Object.keys(getGroupedCart()).map((shopName, index) => {
                const shopData = shops.find(s => s.name === shopName);
                return (
                  <button key={index} onClick={() => window.open(`https://wa.me/${shopData?.whatsapp}?text=${encodeURIComponent(showMultiOrderModal.buildMessage(shopName))}`, "_blank")}
                    style={{ width: "100%", padding: "12px", backgroundColor: "#fff", color: "#000", borderRadius: "12px", fontWeight: "bold", marginBottom: "8px", border: "none", display: "flex", justifyContent: "space-between" }}>
                    <span>✅ طلب {shopName}</span> <span>➔</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => { window.open(`https://wa.me/201122947479?text=${encodeURIComponent(showMultiOrderModal.buildMessage())}`, "_blank"); setShowMultiOrderModal({ isOpen: false }); }}
              style={{ width: "100%", padding: "15px", backgroundColor: "#FF6600", color: "#fff", borderRadius: "15px", fontWeight: "bold", border: "none" }}>🏁 إرسال التقرير للمدير</button>
          </div>
        </div>
      )}

      {/* الصفحة الرئيسية */}
      {activeTab === "home" && !selectedShop && (
        <>
          <img src="/cover.png" alt="Cover" style={{ width: "100%", height: "165px", objectFit: "cover" }} />
          <div style={{ textAlign: "center", marginTop: "-40px" }}>
            <img src="/mall-logo.png" alt="Logo" style={{ width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #FF6600", backgroundColor: "#fff" }} />
          </div>
          <div style={{ padding: "15px" }}>
            <input type="text" placeholder="ابحث عن متجر أو صنف..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #333", backgroundColor: "#1e1e1e", color: "#fff", outline: "none" }} />
          </div>
          <div style={{ display: "flex", overflowX: "auto", padding: "10px", gap: "10px" }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                style={{ flex: "0 0 auto", padding: "8px 15px", borderRadius: "20px", border: "none", backgroundColor: selectedCategory === cat ? "#FF6600" : "#333", color: "#fff", fontWeight: "bold" }}>{cat}</button>
            ))}
          </div>
          <div style={{ padding: "15px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "15px" }}>
            {filteredShops.map((shop) => (
              <div key={shop.id} onClick={() => setSelectedShop(shop)} style={{ backgroundColor: "#1e1e1e", borderRadius: "15px", padding: "10px", textAlign: "center" }}>
                <img src={shop.logo} alt={shop.name} style={{ width: "70px", height: "70px", borderRadius: "20%", border: "2px solid #FF6600", backgroundColor: "#fff", marginBottom: "10px" }} />
                <h4 style={{ color: "#fff", margin: "2px 0" }}>{shop.name}</h4>
                <span style={{ fontSize: "12px", color: shop.isOpen ? "#4caf50" : "#f44336" }}>{shop.isOpen ? "● مفتوح" : "● مغلق"}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* تفاصيل المتجر والسلة والتبويبات الأخرى */}
      {activeTab === "home" && selectedShop && <ShopDetails shop={selectedShop} onBack={() => setSelectedShop(null)} addToCart={addToCart} />}
      {activeTab === "cart" && <Cart cart={cart} itemNotes={itemNotes} removeFromCart={removeFromCart} updateItemNote={updateItemNote} calculateTotal={calculateTotal} getGroupedCart={getGroupedCart} customerInfo={customerInfo} setCustomerInfo={updateCustomerInfo} locationUrl={locationUrl} handleGetLocation={handleGetLocation} sendOrder={sendOrder} />}
      {activeTab === "addShop" && <InstallGuide onClose={() => setActiveTab("home")} />}

      <NavBar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); if (tab === "home") setSelectedShop(null); }} onBack={() => { setSelectedShop(null); setActiveTab("home"); }} hasSelectedShop={!!selectedShop} totalPrice={calculateTotal()} />
    </div>
  );
}
