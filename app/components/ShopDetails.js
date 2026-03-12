// app/components/ShopDetails.js
import React from "react";

export default function ShopDetails({ shop, onBack, addToCart }) {
  if (!shop) return null;

  return (
    <div style={{ padding: "10px" }}>
      {/* زر الرجوع */}
      <button
        onClick={onBack}
        style={{
          backgroundColor: "#333",
          color: "#fff",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          marginBottom: "10px"
        }}
      >
        ←
      </button>

      {/* صورة الـ cover */}
      <img
        src={shop.cover}
        alt="cover"
        style={{
          width: "100%",
          height: "150px",
          borderRadius: "10px",
          objectFit: "cover",
          marginBottom: "10px"
        }}
      />

      {/* اللوجو واسم المتجر */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={shop.logo}
          alt={shop.name}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "2px solid #FF6600"
          }}
        />
        <h2 style={{ color: "#FF6600" }}>{shop.name}</h2>
      </div>

      {/* حالة المتجر */}
      <span
        style={{
          fontSize: "12px",
          color: shop.isOpen ? "#4caf50" : "#f44336",
          marginBottom: "15px",
          display: "block"
        }}
      >
        {shop.isOpen ? "● مفتوح الآن" : "● مغلق"}
      </span>

      {/* عرض الأصناف */}
      {shop.menuCategories ? (
        shop.menuCategories.map((cat, idx) => (
          <div key={idx} style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#FF6600" }}>{cat.title}</h3>
            {cat.items.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#1e1e1e",
                  padding: "10px",
                  borderRadius: "10px",
                  marginBottom: "10px"
                }}
              >
                <span>
                  {item.name} - {item.price} ج.م
                </span>
                <button
                  onClick={() => addToCart(shop.name, item)}
                  style={{
                    backgroundColor: "#FF6600",
                    color: "#fff",
                    borderRadius: "5px",
                    padding: "5px 10px"
                  }}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        ))
      ) : (
        (shop.items || []).map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#1e1e1e",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "10px"
            }}
          >
            <span>
              {item.name} - {item.price} ج.م
            </span>
            <button
              onClick={() => addToCart(shop.name, item)}
              style={{
                backgroundColor: "#FF6600",
                color: "#fff",
                borderRadius: "5px",
                padding: "5px 10px"
              }}
            >
              +
            </button>
          </div>
        ))
      )}
    </div>
  );
}