"use client";
import React, { useState, useEffect } from "react"; // أضفنا useEffect هنا
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
  
    // 1. تعريف الحالة (State)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // 2. الكود السحري اللي بيفحص الحالة في كل مرة الصفحة تفتح
  useEffect(() => {
    const checkPWA = () => {
      // فحص هل العميل فاتح من الأيقونة (Standalone) أم من المتصفح؟
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                           || window.navigator.standalone === true; 

      if (!isStandalone) {
        // لو مش مثبت، أظهر رسالة التعليمات فوراً ودائماً
        setShowInstallPrompt(true);
      }
    };

    checkPWA();
    // زيادة تأكيد: بنفحص تاني لو حصل تغيير في الشاشة
    window.addEventListener('resize', checkPWA);
    return () => window.removeEventListener('resize', checkPWA);
  }, []);

  // بيانات السلة
  const [cart, setCart] = useState([]);
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

  const sendOrder = () => {
    const lastRef = typeof window !== 'undefined' ? (localStorage.getItem('invoice_ref') || 1000) : 1000;
    const newRef = parseInt(lastRef) + 1;
    if (typeof window !== 'undefined') localStorage.setItem('invoice_ref', newRef);

    const date = new Date().toLocaleDateString('ar-EG');
    const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    let message = `*🧾 فاتورة طلب رقم: #${newRef}*\n`;
    message += `*━━━━━━━━━━━━━━*\n`;
    message += `*📅 التاريخ:* ${date}\n`;
    message += `*⏰ الوقت:* ${time}\n`;
    message += `*━━━━━━━━━━━━━━*\n\n`;
    message += `*👤 بيانات العميل (محفوظة):*\n`;
    message += `• الاسم: ${customerInfo.name}\n`;
    message += `• الهاتف: ${customerInfo.phone}\n`;
    message += `• العنوان: ${customerInfo.address}\n`;
    
    if (locationUrl) message += `📍 الموقع: ${locationUrl}\n`;
    
    message += `\n*🛒 الأصناف المطلوبة:*\n`;
    const groupedCart = getGroupedCart();
    Object.keys(groupedCart).forEach((shopName) => {
      message += `\n*🏪 متجر: ${shopName}*\n`;
      groupedCart[shopName].forEach((item) => {
        message += `• *${item.name}*\n`;
        message += `  الكمية: (${item.quantity}) ← *${item.price * item.quantity} ج*\n`;
        if (itemNotes[item.key]) message += `  📝 ملاحظة: ${itemNotes[item.key]}\n`;
      });
    });

    message += `\n*━━━━━━━━━━━━━━*\n`;
    message += `*💰 الإجمالي النهائي: ${calculateTotal()} ج.م*\n`;
    message += `*━━━━━━━━━━━━━━*\n\n`;
    message += `*تم الطلب عبر تطبيق Mini Talabat 🚀*`;

    const myWhatsapp = "201122947479"; 
    window.open(`https://wa.me/${myWhatsapp}?text=${encodeURIComponent(message)}`, "_blank");
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
      
      {/* رسالة التثبيت الإجبارية - تظهر دائماً في المتصفح */}
      {showInstallPrompt && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.98)', // تعتيم شبه كامل للتركيز على التثبيت
          zIndex: 100000, // رقم فائق القوة
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          {/* مكون التعليمات */}
          <InstallGuide onClose={() => setShowInstallPrompt(false)} />
          
          <button 
            onClick={() => setShowInstallPrompt(false)}
            style={{
              marginTop: '30px',
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #555',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            إغلاق ومتابعة من المتصفح مؤقتاً
          </button>
        </div>
      )}
     
      {/* الرئيسية فقط */}
{activeTab === "home" && !selectedShop && (
  <>
    {/* Cover */}
    <img
      src="/cover.png"
      alt="App Cover"
      style={{ width: "100%", height: "165px", objectFit: "cover" }}
    />

    {/* Logo */}
    <div style={{ textAlign: "center", marginTop: "-40px" }}>
      <img
        src="/mall-logo.png"
        alt="Mall Logo"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "3px solid #FF6600",
          backgroundColor: "#fff"
        }}
      />
    </div>

    {/* Search Bar */}
    <div style={{ padding: "15px" }}>
      <input
        type="text"
        placeholder="ابحث عن متجر أو صنف..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #333",
          backgroundColor: "#1e1e1e",
          color: "#fff",
          outline: "none"
        }}
      />
    </div>

    {/* Categories Scroll */}
    <div style={{ display: "flex", overflowX: "auto", padding: "10px", gap: "10px" }}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          style={{
            flex: "0 0 auto",
            padding: "8px 15px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: selectedCategory === cat ? "#FF6600" : "#333",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* عرض المتاجر */}
    <div style={{ 
      padding: "15px", 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
      gap: "15px" 
    }}>
      {filteredShops.length === 0 ? (
        <p>لا توجد متاجر مطابقة 🔍</p>
      ) : (
        filteredShops.map((shop) => (
          <div
            key={shop.id}
            onClick={() => setSelectedShop(shop)}
            style={{
              backgroundColor: "#1e1e1e",
              borderRadius: "15px",
              padding: "10px",
              textAlign: "center",
              cursor: "pointer"
            }}
          >
            <img
              src={shop.logo}
              alt={shop.name}
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "20%",
                border: "2px solid #FF6600",
                backgroundColor: "#fff",
                marginBottom: "10px"
              }}
            />
            <h4 style={{ color: "#fff", margin: "2px 0" }}>{shop.name}</h4>
            <span
              style={{
                fontSize: "12px",
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
  <>

    {/* InstallGuide الأصلي */}
    <InstallGuide onClose={() => setActiveTab("home")} />

    {/* الجزء الجديد لإضافة متجر */}
    <div style={{ padding: "15px", marginTop: "20px" }}>
      <h3 style={{ color: "#fff" }}>أدخل بيانات متجرك الجديد:</h3>
      <input
        type="text"
        placeholder="اسم المتجر"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #333",
          backgroundColor: "#1e1e1e",
          color: "#fff"
        }}
      />
      <input
        type="text"
        placeholder="الفئة (مطعم، صيدلية...)"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #333",
          backgroundColor: "#1e1e1e",
          color: "#fff"
        }}
      />
      <button
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#FF6600",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        حفظ المتجر
      </button>
    </div>

    {/* رقم الواتساب للتواصل */}
    <div style={{ padding: "15px", marginTop: "20px", textAlign: "center" }}>
      <p style={{ color: "#fff" }}>
        للتواصل معنا مباشرة: <strong>01122947479</strong>
      </p>
    </div>
  </>
)}

      {/* NavBar المطور مع خاصية الرجوع */}
<NavBar 
  activeTab={activeTab} 
  setActiveTab={(tab) => {
    setActiveTab(tab);
    if (tab === "home") setSelectedShop(null);
  }} 
  // دالة الرجوع للرئيسية
  onBack={() => {
    setSelectedShop(null);
    setActiveTab("home");
  }}
  // نمرر حالة إذا كان هناك متجر مختار حالياً ليظهر زر الرجوع
  hasSelectedShop={!!selectedShop} 
/>
    </div>
  );
}