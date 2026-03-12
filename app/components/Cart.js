"use client";
import React from "react";

export default function Cart({ cart, getGroupedCart, removeFromCart, updateItemNote, customerInfo, setCustomerInfo, locationUrl, handleGetLocation, calculateTotal, sendOrder }) {
  const inputStyle = { 
    width: '100%', 
    padding: '12px', 
    borderRadius: '10px', 
    border: '1px solid #333', 
    backgroundColor: '#121212', 
    color: '#fff', 
    marginBottom: '10px', 
    outline: 'none' 
  };

  return (
    <div style={{ padding: '5px' }}>
      <h2 style={{ color: '#FF6600', textAlign: 'center' }}>سلة المشتريات 🛒</h2>
      {Object.keys(cart).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>السلة فارغة حالياً 🧡</p>
      ) : (
        <>
          {Object.keys(getGroupedCart()).map(shopName => (
            <div key={shopName} style={{ marginBottom: '15px', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#333', padding: '8px 15px', color: '#FF6600', fontWeight: 'bold' }}>📍 متجر: {shopName}</div>
              {getGroupedCart()[shopName].map(item => (
                <div key={item.key} style={{ padding: '12px', borderBottom: '1px solid #222', backgroundColor: '#1e1e1e' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{item.name} <small style={{color: '#888'}}>(الكمية: {item.quantity})</small></span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <b style={{color: '#FF6600'}}>{item.price * item.quantity}ج</b>
                      <button onClick={() => removeFromCart(item.key)} style={{ color: '#ff4444', background: 'none', border: '1px solid #ff4444', borderRadius: '50%', width: '22px', height: '22px' }}>-</button>
                    </div>
                  </div>
                  <input 
                    placeholder="أضف ملاحظة..." 
                    value={item.note} 
                    onChange={(e) => updateItemNote(item.key, e.target.value)} 
                    style={{ width: '100%', backgroundColor: 'transparent', color: '#aaa', border: 'none', borderBottom: '1px solid #444', fontSize: '12px', marginTop: '8px', outline: 'none' }} 
                  />
                </div>
              ))}
            </div>
          ))}
          <div style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '15px', border: '1px solid #FF6600' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#FF6600' }}>🛵 بيانات التوصيل:</h4>
            <input placeholder="الاسم" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle} />
            <input placeholder="الموبايل" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} />
            <input placeholder="العنوان بالتفصيل" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} />
            <button onClick={handleGetLocation} style={{ width: '100%', padding: '10px', backgroundColor: locationUrl ? '#1b5e20' : '#444', color: '#fff', border: 'none', borderRadius: '10px', marginBottom: '10px' }}>
              {locationUrl ? "✅ تم تحديد موقعك" : "📍 تحديد موقعي تلقائياً (GPS)"}
            </button>
            <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>إجمالي الحساب: {calculateTotal()} ج.م</div>
            <button onClick={sendOrder} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '15px', fontWeight: 'bold' }}>إرسال للواتساب ✅</button>
          </div>
        </>
      )}
    </div>
  );
}
