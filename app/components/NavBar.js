// NavBar.js
import React from "react";

const NavBar = ({ activeTab, setActiveTab }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#121212",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0",
        borderTop: "1px solid #333",
        zIndex: 1000
      }}
    >
      <button
        onClick={() => setActiveTab("home")}
        style={{
          flex: 1,
          backgroundColor: activeTab === "home" ? "#FF6600" : "transparent",
          color: "#fff",
          border: "none",
          padding: "10px",
          cursor: "pointer"
        }}
      >
        🏠 الرئيسية
      </button>

      <button
        onClick={() => setActiveTab("shops")}
        style={{
          flex: 1,
          backgroundColor: activeTab === "shops" ? "#FF6600" : "transparent",
          color: "#fff",
          border: "none",
          padding: "10px",
          cursor: "pointer"
        }}
      >
        🛍️ المتاجر
      </button>

      <button
        onClick={() => setActiveTab("cart")}
        style={{
          flex: 1,
          backgroundColor: activeTab === "cart" ? "#FF6600" : "transparent",
          color: "#fff",
          border: "none",
          padding: "10px",
          cursor: "pointer"
        }}
      >
        🛒 السلة
      </button>

      <button
        onClick={() => setActiveTab("pharmacy")}
        style={{
          flex: 1,
          backgroundColor: activeTab === "pharmacy" ? "#FF6600" : "transparent",
          color: "#fff",
          border: "none",
          padding: "10px",
          cursor: "pointer"
        }}
      >
        💊 صيدلية د/ هاني فاروق
      </button>
    </div>
  );
};

export default NavBar;