"use client";
import React, { useState, useEffect } from 'react';

export default function MiniTalabat() {
  const [cart, setCart] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  // نظام "تذكر بيانات العميل"
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });

  // تحميل البيانات المحفوظة عند فتح التطبيق
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
    // حفظ البيانات للمرة الجاية
    localStorage.setItem('miniTalabat_user', JSON.stringify(customerInfo));

    const orderList = Object.keys(cart)
      .map(key => `• ${key.split('-')[1]} (${cart[key]} قطع)`)
      .join('\n');

    const message = `*طلب جديد من Mini Talabat* 🚀
---------------------------
*👤 بيانات العميل:*
• الاسم: ${customerInfo.name}
• الهاتف: ${customerInfo.phone}
• العنوان/اللوكيشن: ${customerInfo.address}
• ملاحظات: ${customerInfo.note || 'لا يوجد'}

*🛒 تفاصيل الطلب:*
${orderList}

*💰 الإجمالي:* ${calculateTotal()} ج.م
---------------------------
_تم الطلب عبر تطبيق ميني طلبات_ 🧡`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/201122947479?text=${encoded}`, '_blank');
  };

  return (
    <div dir="rtl" style={{ padding: '15px', fontFamily: 'sans-serif', paddingBottom: '100px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '80px' }} />
        <h1 style={{ color: '#FF6600', margin: '5px' }}>Mini Talabat</h1>
      </header>

      {shops.map(shop => (
        <div key={shop.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '10px', marginBottom: '15px' }}>
          <h3 style={{ borderRight: '4px solid #FF6600', paddingRight: '10px' }}>{shop.name}</h3>
          {shop.items.map(item => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
              <span>{item.name} ({item.price} ج.م)</span>
              <button onClick={() => addToCart(shop.name, item)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '5px', padding: '5px 15px' }}>+</button>
            </div>
          ))}
        </div>
      ))}

      {calculateTotal() > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: '15px', borderTop: '2px solid #FF6600' }}>
          {!showOrderForm ? (
            <button onClick={() => setShowOrderForm(true)} style={{ width: '100%', padding: '15px', backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
              تأكيد الطلب (${calculateTotal()} ج.م)
            </button>
          ) : (
            <div>
              <input placeholder="اسمك" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle} />
              <input placeholder="رقم موبايلك" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} />
              <input placeholder="العنوان أو رابط اللوكيشن" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} />
              <button onClick={sendOrder} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
                إرسال للواتساب ✅
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' };
