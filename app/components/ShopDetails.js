// app/components/ShopDetails.js
import React from "react";

export default function ShopDetails({ shop, onBack, addToCart }) {
  return (
    <div style={{ padding: "10px" }}>
      {/* زر الرجوع فقط */}
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

      {/* عرض المنتجات مباشرة */}
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