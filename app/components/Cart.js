// app/components/Cart.js
import React from "react";

export default function Cart({
  cart,
  itemNotes,
  removeFromCart,
  updateItemNote,
  calculateTotal,
  getGroupedCart,
  customerInfo,
  setCustomerInfo,
  locationUrl,
  handleGetLocation,
  sendOrder
}) {
  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #333",
    backgroundColor: "#121212",
    color: "#fff",
    marginBottom: "10px",
    outline: "none"
  };

  return (
    <div style={{ padding: "10px" }}>
      <h2 style={{ color: "#FF6600" }}>سلة المشتريات 🛒</h2>

      {Object.keys(cart).length === 0 ? (
        <p>السلة فارغة حالياً 🧡</p>
      ) : (
        <>
          {Object.keys(getGroupedCart()).map((shopName) => (
            <div key={shopName}>
              <h3 style={{ color: "#FF6600" }}>📍 متجر: {shopName}</h3>
              {getGroupedCart()[shopName].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#1e1e1e",
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "10px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px"
                    }}
                  >
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>{item.price * item.quantity} ج</span>
                  </div>

                  {/* ملاحظات على الصنف */}
                  <input
                    type="text"
                    placeholder="ملاحظات على الطلب (اختياري)"
                    value={itemNotes[item.key] || ""}
                    onChange={(e) =>
                      updateItemNote(item.key, e.target.value)
                    }
                    style={inputStyle}
                  />

                  <button
                    onClick={() => removeFromCart(item.key)}
                    style={{
                      backgroundColor: "#f44336",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "5px",
                      marginTop: "5px"
                    }}
                  >
                    - إزالة
                  </button>
                </div>
              ))}
            </div>
          ))}

          {/* بيانات العميل */}
          <input
            placeholder="الاسم"
            value={customerInfo.name}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, name: e.target.value })
            }
            style={inputStyle}
          />
          <input
            placeholder="الموبايل"
            value={customerInfo.phone}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, phone: e.target.value })
            }
            style={inputStyle}
          />
          <input
            placeholder="العنوان"
            value={customerInfo.address}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, address: e.target.value })
            }
            style={inputStyle}
          />

          {/* تحديد الموقع */}
          <button
            onClick={handleGetLocation}
            style={{
              backgroundColor: "#333",
              color: "#fff",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            {locationUrl ? "✅ تم تحديد موقعك" : "📍 تحديد موقعي"}
          </button>

          {/* الإجمالي */}
          <h3>الإجمالي: {calculateTotal()} ج.م</h3>

          {/* إرسال الطلب */}
          <button
  onClick={handleSendOrder}
  style={{
    backgroundColor: "#25D366",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer"
  }}
>
  📲 إرسال الطلب
</button>
        </>
      )}
    </div>
  );
}