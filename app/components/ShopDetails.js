import React, { useState } from "react";

// ضفنا setHasPrescription هنا عشان نقدر نغير حالتها من جوه المكون ده
export default function ShopDetails({ shop, onBack, addToCart, setHasPrescription }) {
  const [activeCategory, setActiveCategory] = useState(
    shop.menuCategories[0]?.title || ""
  );

  return (
    <div style={{ padding: "10px" }}>
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
        <h3 style={{ color: "#FF6600", marginBottom: "15px" }}>{shop.name}</h3>

        {/* --- [تعديل زرار تصوير الروشتة ليعمل بذكاء مع الرسالة] --- */}
        {shop.category === "الصيدليات" && (
          <div style={{
            margin: "0 10px 20px 10px",
            padding: "15px",
            backgroundColor: "#e6fcf5",
            borderRadius: "15px",
            border: "2px dashed #20c997",
            textAlign: "center"
          }}>
            <p style={{ color: "#087f5b", fontWeight: "bold", fontSize: "14px", marginBottom: "10px" }}>
              📷 هل لديك روشتة دواء؟
            </p>
            <label style={{
              backgroundColor: "#20c997",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "25px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "inline-block",
              fontSize: "14px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              تصوير الروشتة الآن
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                style={{ display: "none" }}
                onChange={(e) => {
                  if(e.target.files[0]) {
                    // 💡 هنا الذكاء: بنبلغ الصفحة الرئيسية إن فيه روشتة اتصورت
                    if (setHasPrescription) setHasPrescription(true);
                    
                    alert("✅ ممتاز! تم التقاط الصورة بنجاح. ستظهر ملاحظة (برجاء معاينة الروشتة) في رسالة الطلب لتنبيه الصيدلي.");
                  }
                }}
              />
            </label>
          </div>
        )}
        {/* --- [نهاية الإضافة] --- */}
      </div>

      {/* Categories Tabs */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "10px",
          marginBottom: "15px",
          paddingBottom: "5px"
        }}
      >
        {shop.menuCategories.map((cat) => (
          <button
            key={cat.title}
            onClick={() => setActiveCategory(cat.title)}
            style={{
              flex: "0 0 auto",
              padding: "8px 15px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: activeCategory === cat.title ? "#FF6600" : "#333",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Items of Active Category */}
      <div>
        {shop.menuCategories
          .find((cat) => cat.title === activeCategory)
          ?.items.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "10px",
                padding: "12px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #333"
              }}
            >
              <span style={{ color: "#fff", fontSize: "15px" }}>{item.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#FF6600", fontWeight: "bold" }}>{item.price} ج</span>
                <button
                  onClick={() => addToCart(shop.name, item)}
                  style={{
                    backgroundColor: "#25D366",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}
                >
                  ➕ أضف
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
