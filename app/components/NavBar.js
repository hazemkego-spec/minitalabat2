import React from "react";

export default function NavBar({ activeTab, setActiveTab, setSelectedShop, hasSelectedShop }) {
  
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
    height: "70px", // تثبيت الارتفاع
    backgroundColor: "#1e1e1e",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "0 10px",
    borderTop: "2px solid #333",
    zIndex: "999999", // أعلى درجة ظهور ممكنة
    touchAction: "none", // يمنع حركات اللمس المسببة للـ Zoom في الشريط
    transform: "translateZ(0)", // إجبار الموبايل على استخدام معالج الرسوم لثبات العنصر
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

      {/* زر السلة */}
      <button
        onClick={() => setActiveTab("cart")}
        style={{
          color: activeTab === "cart" ? "#FF6600" : "#888",
          background: "none",
          border: "none",
          fontSize: "14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
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
        <span>تعليمات/أضف متجرك</span>
      </button>
    </nav>
  );
}
