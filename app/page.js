// app/page.js
"use client";
import React, { useState } from "react";
import shops from "./components/ShopList";
import ShopDetails from "./components/ShopDetails";
import Cart from "./components/Cart";
import NavBar from "./components/NavBar";
import InstallGuide from "./components/InstallGuide";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedShop, setSelectedShop] = useState(null);
  const [cart, setCart] = useState({});
  const [itemNotes, setItemNotes] = useState({});
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [locationUrl, setLocationUrl] = useState("");

  // إضافة صنف للسلة
  const addToCart = (shopName, item) => {
    const key = `${shopName}-${item.name}`;
    setCart((prev) => ({
      ...prev,
      [key]: prev[key]
        ? { ...prev[key], quantity: prev[key].quantity + 1 }
        : { ...item, quantity: 1, key }
    }));
  };

  // إزالة صنف من السلة
  const removeFromCart = (key) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[key];
      return newCart;
    });
  };

  // تحديث ملاحظات الصنف
  const updateItemNote = (key, note) => {
    setItemNotes((prev) => ({ ...prev, [key]: note }));
  };

  // حساب الإجمالي
  const calculateTotal = () =>
    Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

  // تجميع السلة حسب المتجر
  const getGroupedCart = () => {
    const grouped = {};
    Object.values(cart).forEach((item) => {
      const shopName = item.key.split("-")[0];
      if (!grouped[shopName]) grouped[shopName] = [];
      grouped[shopName].push(item);
    });
    return grouped;
  };

  // تحديد الموقع
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

  // إرسال الطلب عبر واتساب
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
return (
    <div style={{ paddingBottom: "70px" }}>
      {activeTab === "home" && !selectedShop && (
        <div style={{ padding: "10px" }}>
          <h2 style={{ color: "#FF6600" }}>🛍️ المتاجر</h2>
          {shops.map((shop) => (
            <div
              key={shop.id}
              onClick={() => setSelectedShop(shop)}
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "15px",
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer"
              }}
            >
              <img
                src={shop.cover}
                alt="cover"
                style={{
                  width: "100%",
                  height: "120px",
                  borderRadius: "10px",
                  objectFit: "cover"
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={shop.logo}
                  alt={shop.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    border: "2px solid #FF6600",
                    marginTop: "-25px"
                  }}
                />
                <h4 style={{ color: "#fff" }}>{shop.name}</h4>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: shop.isOpen ? "#4caf50" : "#f44336"
                }}
              >
                {shop.isOpen ? "● مفتوح الآن" : "● مغلق"}
              </span>
            </div>
          ))}
        </div>
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
          setCustomerInfo={setCustomerInfo}
          locationUrl={locationUrl}
          handleGetLocation={handleGetLocation}
          sendOrder={sendOrder}
        />
      )}

      {activeTab === "addShop" && (
        <InstallGuide onClose={() => setActiveTab("home")} />
      )}

      <NavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedShop={setSelectedShop}
      />
    </div>
  );
}