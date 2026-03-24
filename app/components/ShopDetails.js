import React, { useState } from "react";

export default function ShopDetails({ shop, onBack, addToCart }) {
  const [activeCategory, setActiveCategory] = useState(
    shop.menuCategories[0]?.title || ""
  );

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      
      {/* 🖼️ Cover Section مع تأثير التدرج */}
      <div style={{ position: "relative", width: "100%", height: "200px" }}>
        {shop.cover && (
          <img
            src={shop.cover}
            alt={shop.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "100px", background: "linear-gradient(to top, #121212, transparent)"
        }}></div>
      </div>

      {/* 🏪 Shop Info المحسن */}
      <div style={{ textAlign: "center", marginTop: "-50px", position: "relative", padding: "0 15px" }}>
        <img
          src={shop.logo}
          alt={shop.name}
          style={{
            width: "100px", height: "100px", borderRadius: "25px",
            border: "4px solid #121212", backgroundColor: "#fff",
            boxShadow: "0 10px 20px rgba(0,0,0,0.5)", objectFit: "contain", padding: "5px"
          }}
        />
        <h2 style={{ color: "#fff", marginTop: "10px", fontSize: "22px", fontWeight: "900" }}>{shop.name}</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "5px" }}>
           <span style={{ fontSize: "12px", color: "#4caf50", backgroundColor: "rgba(76,175,80,0.1)", padding: "4px 10px", borderRadius: "10px" }}>✓ متجر موثق</span>
           <span style={{ fontSize: "12px", color: "#FF6600", backgroundColor: "rgba(255,102,0,0.1)", padding: "4px 10px", borderRadius: "10px" }}>⚡ سريع التوصيل</span>
        </div>
      </div>

      {/* 📑 Categories Tabs (Sticky) */}
      <div style={{
        position: "sticky", top: "0", zIndex: 100,
        backgroundColor: "rgba(18,18,18,0.95)", backdropFilter: "blur(10px)",
        display: "flex", overflowX: "auto", gap: "8px", padding: "15px",
        marginTop: "15px", borderBottom: "1px solid #252525", scrollbarWidth: "none"
      }}>
        {shop.menuCategories.map((cat) => (
          <button
            key={cat.title}
            onClick={() => setActiveCategory(cat.title)}
            style={{
              flex: "0 0 auto", padding: "10px 20px", borderRadius: "15px",
              border: "none", transition: "0.3s",
              backgroundColor: activeCategory === cat.title ? "#FF6600" : "#252525",
              color: activeCategory === cat.title ? "#000" : "#fff",
              fontWeight: "900", cursor: "pointer", fontSize: "13px"
            }}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* 🍔 Items List */}
      <div style={{ padding: "15px", display: "grid", gap: "15px" }}>
        {shop.menuCategories
          .find((cat) => cat.title === activeCategory)
          ?.items.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#1e1e1e", borderRadius: "20px",
                padding: "15px", display: "flex", gap: "15px",
                alignItems: "center", border: "1px solid #252525",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
            >
              {/* تفاصيل الصنف */}
              <div style={{ flex: 1 }}>
                <h4 style={{ color: "#fff", margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" }}>{item.name}</h4>
                {item.desc && (
                  <p style={{ color: "#888", fontSize: "12px", margin: "0 0 10px 0", lineHeight: "1.4" }}>
                    {item.desc}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#FF6600", fontWeight: "900", fontSize: "18px" }}>{item.price} <small style={{ fontSize: "10px" }}>ج.م</small></span>
                  {item.tag && (
                    <span style={{ fontSize: "10px", backgroundColor: "#333", color: "#FF6600", padding: "2px 8px", borderRadius: "5px" }}>{item.tag}</span>
                  )}
                </div>
              </div>

              {/* زر الإضافة السريع */}
              <button
                onClick={() => addToCart(shop.name, item)}
                style={{
                  width: "45px", height: "45px", borderRadius: "15px",
                  backgroundColor: "#FF6600", color: "#000", border: "none",
                  fontSize: "22px", fontWeight: "bold", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(255,102,0,0.3)", transition: "0.2s"
                }}
                onPointerDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
                onPointerUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                +
              </button>
            </div>
          ))}
      </div>

      {/* رسالة توضيحية في النهاية */}
      <div style={{ textAlign: "center", padding: "40px 20px", color: "#444", fontSize: "12px" }}>
        جميع الأسعار تشمل ضريبة القيمة المضافة لمتجر {shop.name}
      </div>
    </div>
  );
}
