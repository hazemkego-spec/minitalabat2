"use client";
import React, { useState, useEffect } from 'react';

export default function MiniTalabat() {
  const [cart, setCart] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const MAIN_PHONE = "201122947479"; // رقمك العالمي الموحد
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('miniTalabat_user');
    if (saved) setCustomerInfo(JSON.parse(saved));
  }, []);

  const shops = [
    { id: 1, name: "مطعم السعادة", items: [{ name: "بيتزا", price: 120 }, { name: "كريب", price: 80 }] },
    { id: 2, name: "سوبر ماركت الخير", items: [{ name: "لبن", price: 35 }, { name: "جبنة", price: 70 }] }
  ];

  const addToCart = (shopName, item) => {
    const newCart = { ...cart };
    const key = `${shopName}-${item.name}`;
    newCart[key] = (newCart[key] || 0) + 1;
    setCart(newCart);
  };

  const calculateTotal = () => {
    let total = 0;
    Object.keys(cart).forEach(key => {
      const shopName = key.split('-')[0];
      const itemName = key.split('-')[1];
      const shop = shops.find(s => s.name === shopName);
      const item = shop.items.find(i => i.name === itemName);
      total += item.price * cart[key];
    });
    return total;
  };

  const sendOrder = () => {
    localStorage.setItem('miniTalabat_user', JSON.stringify(customerInfo));
    const orderList = Object.keys(cart).map(key => `• ${key.split('-')[1]} (${cart[key]} قطع)`).join('\n');

    const message = `*طلب جديد من Mini Talabat* 🚀\n---------------------------\n*👤 العميل:* ${customerInfo.name}\n*📞 الهاتف:* ${customerInfo.phone}\n*📍 العنوان:* ${customerInfo.address}\n\n*🛒 الطلبات:*\n${orderList}\n\n*💰 الإجمالي:* ${calculateTotal()} ج.م\n---------------------------\n_تم عبر ميني طلبات_ 🧡`;
    
    window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div dir="rtl" style={{ padding: '15px', fontFamily: 'sans-serif', backgroundColor: '#fdfdfd' }}>
      {/* هيدر التطبيق مع زرار تواصل معنا المباشر */}
      <header style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '70px' }} />
        <h1 style={{ color: '#FF6600', margin: '5px', fontSize: '24px' }}>Mini Talabat</h1>
        <button 
          onClick={() => window.open(`https://wa.me/${MAIN_PHONE}`, '_blank')}
          style={{ backgroundColor: '#eee', border: 'none', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', cursor: 'pointer' }}
        >
          📞 تواصل معنا (الدعم الفني)
        </button>
      </header>

      {shops.map(shop => (
        <div key={shop.id} style={{ border: '1px solid #eee', borderRadius: '15px', padding: '15px', marginBottom: '15px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderRight: '4px solid #FF6600', paddingRight: '10px', marginBottom: '15px' }}>{shop.name}</h3>
          {shop.items.map(item => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>{item.name} ({item.price} ج.م)</span>
              <button onClick={() => addToCart(shop.name, item)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 15px', fontWeight: 'bold' }}>+</button>
            </div>
          ))}
        </div>
      ))}

      {calculateTotal() > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: '20px', borderTop: '2px solid #FF6600', boxShadow: '0 -4px 10px rgba(0,0,0,0.1)' }}>
          {!showOrderForm ? (
            <button onClick={() => setShowOrderForm(true)} style={{ width: '100%', padding: '15px', backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px' }}>
              تأكيد الطلب ({calculateTotal()} ج.م)
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input placeholder="الاسم" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle} />
              <input placeholder="الموبايل" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} />
              <input placeholder="العنوان" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} />
              <button onClick={sendOrder} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px' }}>
                إرسال للواتساب ✅
              </button>
              <button onClick={() => setShowOrderForm(false)} style={{ color: '#888', background: 'none', border: 'none' }}>إلغاء</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px' };
