"use client";
import { useState } from "react";
import ShopDetails from "./components/ShopDetails";
import Cart from "./components/Cart";
import NavBar from "./components/NavBar";
import ShopList from "./components/ShopList";

export default function Page() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedShop, setSelectedShop] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [itemNotes, setItemNotes] = useState({});
  const [customerInfo, setCustomerInfo] = useState({});
  const [locationUrl, setLocationUrl] = useState("");

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const updateItemNote = (index, note) => {
    setItemNotes({ ...itemNotes, [index]: note });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const getGroupedCart = () => {
    const grouped = {};
    cart.forEach((item) => {
      if (!grouped[item.shop]) grouped[item.shop] = [];
      grouped[item.shop].push(item);
    });
    return grouped;
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocationUrl(
          `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
        );
      });
    }
  };

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff", paddingBottom: "70px" }}>
{/* الصفحة الرئيسية */}
      {activeTab === "home" && !selectedShop && (
        <>
          {/* Cover */}
          <img
            src="/cover.png"
            alt="App Cover"
            style={{ width: "100%", height: "180px", objectFit: "cover" }}
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
            />
          </div>

          {/* عرض المتاجر */}
          <div style={{ padding: "15px" }}>
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
                    marginBottom: "10px"
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
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "-25px" }}>
                    <img
                      src={shop.logo}
                      alt="logo"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "2px solid #FF6600",
                        backgroundColor: "#fff"
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
              ))
            )}
          </div>
        </>
      )}

      {/* صفحة أضف متجرك */}
      {activeTab === "addShop" && (
        <>
          {/* Cover */}
          <img
            src="/cover.png"
            alt="App Cover"
            style={{ width: "100%", height: "180px", objectFit: "cover" }}
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

          {/* باقي كود صفحة أضف متجرك */}
          <div style={{ padding: "15px" }}>
            <p style={{ color: "#fff" }}>أدخل بيانات متجرك هنا...</p>
          </div>
        </>
      )}
{/* تفاصيل المتجر */}
      {activeTab === "home" && selectedShop && (
        <ShopDetails
          shop={selectedShop}
          onBack={() => setSelectedShop(null)}
          addToCart={addToCart}
        />
      )}

      {/* السلة */}
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
    </div>
  );
}