// app/components/ShopDetails.js
import React from "react";

export default function ShopDetails({ shop, onBack, addToCart }) {
  return (
    <div style={{ padding: "10px" }}>
      {/* زر الرجوع */}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={onBack}
          style={{
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer"
          }}
        >
          ⬅ رجوع
        </button>
      </div>

      {/* Cover الخاص بالمتجر */}
      {shop.cover && (
        <img
          src={shop.cover}
          alt={`${shop.name} Cover`}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "15px"
          }}
        />
      )}

      {/* Logo الخاص بالمتجر + الاسم */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src={shop.logo}
          alt={shop.name}
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            border: "3px solid #FF6600",
            backgroundColor: "#fff",
            marginBottom: "10px"
          }}
        />
        <h3 style={{ color: "#FF6600" }}>{shop.name}</h3>
      </div>

      {/* المنتجات */}
      <div>
        {shop.menuCategories.flatMap((cat) =>
          cat.items.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>{item.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#FF6600" }}>{item.price} ج</span>
                <button
                  onClick={() => addToCart(shop.name, item)}
                  style={{
                    backgroundColor: "#25D366",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "5px 10px",
                    cursor: "pointer"
                  }}
                >
                  ➕ أضف
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}