"use client";
import React, { useState, useEffect } from 'react';

export default function MiniTalabat() {
  const [cart, setCart] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
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
    // حفظ البيانات
    localStorage.setItem('miniTalabat_user', JSON.stringify(customerInfo));

    const orderList = Object.keys(cart)
      .map(key => `• ${key.split('-')[1]} (${cart[key]} قطع)`)
      .join('\n');

    // تصحيح الرابط والرسالة
    const message = `*طلب جديد من Mini Talabat* 🚀
---------------------------
*👤 بيانات العميل:*
• الاسم: ${customerInfo.name}
• الهاتف: ${customerInfo.phone}
• العنوان: ${customerInfo.address}

*🛒 تفاصيل الطلب:*
${orderList}

*💰 الإجمالي:* ${calculateTotal()} ج.م
---------------------------
_تم عبر ميني طلبات_ 🧡`;

    const encoded = encodeURIComponent(message);
    // تأكدنا من الرقم 01122947479
    const whatsappUrl = "https://wa.me/201122947479?text=" + encoded;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div dir="rtl" style={{ padding: '15px', fontFamily: 'sans-serif', paddingBottom: '120px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '80px' }} />
        <h1 style={{ color: '#FF6600', margin: '5px' }}>Mini Talabat</h1>
      </header>

      {shops.map(shop => (
        <div key={shop.id} style={{ border: '1px solid #eee', borderRadius: '15px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderRight: '4px solid #FF6600', paddingRight: '10px', color: '#333' }}>{shop.name}</h3>
          {shop.items.map(item => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ color: '#FF6600', fontSize: '14px' }}>{item.price} ج.م</div>
              </div>
              <button onClick={() => addToCart(shop.name, item)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '20px', cursor: 'pointer' }}>+</button>
            </div>
          ))}
        </div>
      ))}

      {calculateTotal() > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: '15px', borderTop: '2px solid #FF6600', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          {!showOrderForm ? (
            <button onClick={() => setShowOrderForm(true)} style={{ width: '100%', padding: '15px', backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px' }}>
              تأكيد الطلب ({calculateTotal()} ج.م)
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input placeholder="اسمك الثنائي" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle} />
              <input placeholder="رقم الموبايل" type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} />
              <input placeholder="العنوان بالتفصيل" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} />
              <button onClick={sendOrder} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px' }}>
                إرسال للواتساب ✅
              </button>
              <button onClick={() => setShowOrderForm(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '14px' }}>إلغاء</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' };
