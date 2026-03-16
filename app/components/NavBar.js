import React from "react";

export default function NavBar({ activeTab, setActiveTab, setSelectedShop, hasSelectedShop, totalPrice }) {
  
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
        height: "70px",
        backgroundColor: "#1e1e1e",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "0 10px",
        borderTop: "2px solid #333",
        zIndex: "999999",
        touchAction: "none",
        transform: "translateZ(0)",
      }}
    >
      {/* زر الرجوع */}
      {(hasSelectedShop || activeTab !== "home") && (
        <button
          onClick={handleBackToHome}
          style={{
            color: "#FF6600",
            background: "none",
            border: "none",
            fontSize: "14px",
            fontWeight: "bold",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <span>🔙</span>
          <span>رجوع</span>
        </button>
      )}

      {/* زر الرئيسية */}
      <button
        onClick={handleBackToHome}
        style={{
          color: activeTab === "home" && !hasSelectedShop ? "#FF6600" : "#888",
          background: "none",
          border: "none",
          fontSize: "14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <span>🏠</span>
        <span>الرئيسية</span>
      </button>

      {/* زر السلة مع الإجمالي المباشر */}
      <button
        onClick={() => setActiveTab("cart")}
        style={{
          color: activeTab === "cart" ? "#FF6600" : "#888",
          background: "none",
          border: "none",
          fontSize: "14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative" // ضروري لتحديد موقع فقاعة السعر
        }}
      >
        {/* فقاعة إجمالي السعر */}
        {totalPrice > 0 && (
          <div style={{
            position: "absolute",
            top: "-12px",
            backgroundColor: "#FF6600",
            color: "#fff",
            fontSize: "11px",
            fontWeight: "bold",
            padding: "2px 8px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
            border: "1px solid #1e1e1e",
            animation: "popIn 0.3s ease-out"
          }}>
            {totalPrice} ج
          </div>
        )}
        <span>🛒</span>
        <span>السلة</span>
      </button>

      {/* زر إضافة متجر */}
      <button
        onClick={() => setActiveTab("addShop")}
        style={{
          color: activeTab === "addShop" ? "#FF6600" : "#888",
          background: "none",
          border: "none",
          fontSize: "14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <span>🏪</span>
        <span>أضف متجرك</span>
      </button>

      {/* إضافة كود الأنميشن للفقاعة */}
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </nav>
  );
}
