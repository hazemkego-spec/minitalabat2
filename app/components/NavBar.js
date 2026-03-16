import React from "react";

export default function NavBar({ activeTab, setActiveTab, setSelectedShop, hasSelectedShop }) {
  
  const handleBackToHome = () => {
    setActiveTab("home");
    setSelectedShop(null);
  };

  return (
    <nav
      style={{
        position: "fixed", // ثابت دائماً
        bottom: 0,        // في أقصى الأسفل
        left: 0,
        right: 0,
        height: "65px",   // تحديد طول ثابت للشريط
        backgroundColor: "#1e1e1e",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center", // توسيط العناصر رأسياً
        padding: "0 5px",
        borderTop: "2px solid #333",
        zIndex: 9999,      // رقم كبير جداً لضمان ظهوره فوق كل شيء
        touchAction: "none" // يمنع التفاعل مع الـ Zoom في منطقة الشريط
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
        <span>المتجر</span>
      </button>
    </nav>
  );
}
