
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
  let message = `طلب جديد من ${customerInfo.name}\n📞 ${customerInfo.phone}\n🏠 ${customerInfo.address}\n`;
  if (locationUrl) message += `📍 الموقع: ${locationUrl}\n\n`;

  Object.keys(getGroupedCart()).forEach((shopName) => {
    message += `🛍️ متجر: ${shopName}\n`;
    getGroupedCart()[shopName].forEach((item) => {
      message += `- ${item.name} (x${item.quantity}) = ${item.price * item.quantity} ج\n`;
      if (itemNotes[item.key]) {
        message += `  ملاحظات: ${itemNotes[item.key]}\n`;
      }
    });
    message += "\n";
  });

  message += `💰 الإجمالي: ${calculateTotal()} ج.م\n`;
  message += `📞 للتواصل: 01122947479\n`;   // ← هنا أضفنا رقم الواتساب

  const url = `https://wa.me/201122947479?text=${encodeURIComponent(message)}`; // ← هنا غيرنا الرابط ليبعت على رقمك مباشرة
  window.open(url, "_blank");
};

  const categories = ["الكل", "مطاعم", "صيدليات", "سوبر ماركت", "عطارة"];

  // فلترة المتاجر حسب الفئة والبحث
  const filteredShops = shops.filter((shop) => {
    const matchCategory =
      selectedCategory === "الكل" || shop.category === selectedCategory;
    const matchSearch =
      shop.name.includes(searchTerm) ||
      (shop.items &&
        shop.items.some((item) => item.name.includes(searchTerm))) ||
      (shop.menuCategories &&
        shop.menuCategories.some((cat) =>
          cat.items.some((item) => item.name.includes(searchTerm))
        ));
    return matchCategory && matchSearch;
  });

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff", paddingBottom: "70px" }}>

{/* السعر الإجمالي يظهر دايمًا */}
<div style={{
  backgroundColor: "#FF6600",
  color: "#fff",
  padding: "10px",
  textAlign: "center",
  fontWeight: "bold",
  borderRadius: "8px",
  margin: "10px"
}}>
  الإجمالي: {totalPrice} ج
</div>
      
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