import React from "react";

export default function NavBar({ activeTab, setActiveTab, setSelectedShop, hasSelectedShop }) {
  
  // دالة موحدة للرجوع للرئيسية وتصفير المتجر
  const handleBackToHome = () => {
    setActiveTab("home");
    setSelectedShop(null);
  };

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
        borderTop: "2px solid #333",
        zIndex: 1000 // لضمان ظهور الشريط فوق أي محتوى
      }}
    >
      {/* زر الرجوع - يظهر فقط لو العميل داخل صفحة متجر أو في السلة */}
      {(hasSelectedShop || activeTab !== "home") && (
        <button
          onClick={handleBackToHome}
          style={{
            color: "#FF6600", // لون مميز للرجوع
            background: "none",
            border: "none",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          🔙 رجوع
        </button>
      )}

      <button
        onClick={handleBackToHome}
        style={{
          color: activeTab === "home" && !hasSelectedShop ? "#FF6600" : "#888",
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
