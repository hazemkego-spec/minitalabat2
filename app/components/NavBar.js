// app/components/NavBar.js
import React from "react";

export default function NavBar({ activeTab, setActiveTab, setSelectedShop }) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1e1e1e",
        display: "flex",
        justifyContent: "space-around",
        padding: "12px 0",
        borderTop: "2px solid #333"
      }}
    >
      <button
        onClick={() => {
          setActiveTab("home");
          setSelectedShop(null);
        }}
        style={{
          color: activeTab === "home" ? "#FF6600" : "#888",
          background: "none",
          border: "none",
          fontSize: "16px"
        }}
      >
        🏠 الرئيسية
      </button>

      <button
        onClick={() => setActiveTab("cart")}
        style={{
          color: activeTab === "cart" ? "#FF6600" : "#888",
          background: "none",
          border: "none",
          fontSize: "16px"
        }}
      >
        🛒 السلة
      </button>

      <button
        onClick={() => setActiveTab("addShop")}
        style={{
          color: activeTab === "addShop" ? "#FF6600" : "#888",
          background: "none",
          border: "none",
          fontSize: "16px"
        }}
      >
        🏪 أضف متجرك
      </button>
    </nav>
  );
}