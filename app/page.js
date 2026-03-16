
// app/page.js
"use client";
import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Cart from "./components/Cart";
import InstallGuide from "./components/InstallGuide";
import shops from "./components/ShopList"; // استدعاء قائمة المتاجر
import ShopDetails from "./components/ShopDetails";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");
const [selectedShop, setSelectedShop] = useState(null);

  // بيانات السلة (مؤقتاً)
  const [cart, setCart] = useState([]);
  const [itemNotes, setItemNotes] = useState({});
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [locationUrl, setLocationUrl] = useState("");

  // دوال السلة
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
    Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

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
        setLocationUrl(
          `https://www.google.com/maps?q=${latitude},${longitude}`
        );
      });
    }
  };

      const sendOrder = () => {
    // 1. نظام الترقيم التسلسلي (Invoice Number)
    const lastRef = typeof window !== 'undefined' ? (localStorage.getItem('invoice_ref') || 1000) : 1000;
    const newRef = parseInt(lastRef) + 1;
    if (typeof window !== 'undefined') localStorage.setItem('invoice_ref', newRef);

    // 2. توقيت الفاتورة
    const date = new Date().toLocaleDateString('ar-EG');
    const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    // 3. بناء الفاتورة بتنسيق احترافي
    let message = `*🧾 فاتورة طلب رقم: #${newRef}*\n`;
    message += `*━━━━━━━━━━━━━━*\n`;
    message += `*📅 التاريخ:* ${date}\n`;
    message += `*⏰ الوقت:* ${time}\n`;
    message += `*━━━━━━━━━━━━━━*\n\n`;

    message += `*👤 بيانات العميل:*\n`;
    message += `• الاسم: ${customerInfo.name || "غير مسجل"}\n`;
    message += `• الهاتف: ${customerInfo.phone || "غير مسجل"}\n`;
    message += `• العنوان: ${customerInfo.address || "غير مسجل"}\n`;
    
    if (locationUrl) {
      // تعديل صيغة اللوكيشن لتفتح مباشرة على خرائط جوجل
      const cleanLocation = locationUrl.includes("maps.google.com") ? locationUrl : `https://www.google.com/maps?q=${locationUrl}`;
      message += `📍 الموقع: ${cleanLocation}\n`;
    }
    
    message += `\n*🛒 الأصناف المطلوبة:*\n`;
    
    const groupedCart = getGroupedCart();
    Object.keys(groupedCart).forEach((shopName) => {
      message += `\n*🏪 متجر: ${shopName}*\n`;
      groupedCart[shopName].forEach((item) => {
        message += `• *${item.name}*\n`;
        message += `  الكمية: (${item.quantity}) ← *${item.price * item.quantity} ج*\n`;
        if (itemNotes[item.key]) {
          message += `  📝 ملاحظة: ${itemNotes[item.key]}\n`;
        }
      });
    });

    message += `\n*━━━━━━━━━━━━━━*\n`;
    message += `*💰 الإجمالي النهائي: ${calculateTotal()} ج.م*\n`;
    message += `*━━━━━━━━━━━━━━*\n\n`;
    message += `*تم الطلب عبر تطبيق مول اليمن ✨*`;

    // 4. إرسال الفاتورة لرقمك الخاص
    const myWhatsapp = "201122947479"; 
    const finalUrl = `https://wa.me/${myWhatsapp}?text=${encodeURIComponent(message)}`;
    window.open(finalUrl, "_blank");
  };

  const categories = ["الكل", "مطاعم", "صيدليات", "سوبر ماركت", "عطارة", "مصنعات اللحوم"];

  // فلترة المتاجر حسب الفئة والبحث
    const filteredShops = shops.filter((shop) => {
    // 1. التصفية حسب القسم المختارة (الكل، مطاعم، إلخ)
    const matchCategory = selectedCategory === "الكل" || shop.category === selectedCategory;

    // 2. التصفية حسب كلمة البحث (نحول النص لحروف صغيرة لضمان الدقة)
    const lowerSearch = searchTerm.toLowerCase();
    
    // البحث في اسم المحل
    const matchShopName = shop.name.toLowerCase().includes(lowerSearch);
    
    // البحث في أسماء الأصناف داخل المنيو
    const matchMenuItem = shop.menuCategories?.some(category => 
      category.items.some(item => item.name.toLowerCase().includes(lowerSearch))
    );

    return matchCategory && (matchShopName || matchMenuItem);
  });

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff", paddingBottom: "70px" }}>
     
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
          setCustomerInfo={setCustomerInfo}
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

      {/* NavBar */}
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} setSelectedShop={() => {}} />
    </div>
  );
}