// app/page.js
"use client";
import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Cart from "./components/Cart";
import InstallGuide from "./components/InstallGuide";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [activeTab, setActiveTab] = useState("home");

  // بيانات السلة (مؤقتاً فاضية لحد ما نكمل)
  const [cart, setCart] = useState({});
  const [itemNotes, setItemNotes] = useState({});
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [locationUrl, setLocationUrl] = useState("");

  // دوال السلة (مؤقتة للتجربة)
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
        message += `- ${item.name} (x${item.quantity}) = ${
          item.price * item.quantity
        } ج\n`;
        if (itemNotes[item.key]) {
          message += `  ملاحظات: ${itemNotes[item.key]}\n`;
        }
      });
      message += "\n";
    });

    message += `💰 الإجمالي: ${calculateTotal()} ج.م\n`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const categories = ["الكل", "مطاعم", "صيدليات", "سوبر ماركت", "عطارة"];

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff", paddingBottom: "70px" }}>
      
      {activeTab === "home" && (
        <>
          {/* Cover */}
          <img src="/cover.png" alt="App Cover" style={{ width: "100%", height: "180px", objectFit: "cover" }} />

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

          {/* هنا لاحقاً هنضيف عرض المتاجر حسب الفئة المختارة */}
        </>
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
        <InstallGuide onClose={() => setActiveTab("home")} />
      )}

      {/* NavBar */}
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} setSelectedShop={() => {}} />
    </div>
  );
}