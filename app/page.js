"use client";
import React, { useState, useEffect } from 'react';

export default function MiniTalabat() {
  const [cart, setCart] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const MAIN_PHONE = "201122947479"; 
  
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    const saved = localStorage.getItem('miniTalabat_user');
    if (saved) setCustomerInfo(JSON.parse(saved));
  }, []);

  // رجعتلك كل الأقسام بتاعتك هنا يا بطل
  const shops = [
    { id: 1, category: "مطاعم", name: "مطعم السعادة", items: [{ name: "بيتزا", price: 120 }, { name: "كريب", price: 80 }, { name: "شاورما", price: 60 }] },
    { id: 2, category: "سوبر ماركت", name: "سوبر ماركت الخير", items: [{ name: "لبن", price: 35 }, { name: "جبنة", price: 70 }, { name: "لانشون", price: 50 }] },
    { id: 3, category: "صيدليات", name: "صيدلية الشفاء", items: [{ name: "بندول", price: 30 }, { name: "كمامات", price: 5 }] },
    { id: 4, category: "عطارة", name: "عطارة مكة", items: [{ name: "فلفل أسود", price: 20 }, { name: "كمون", price: 15 }] },
    { id: 5, category: "منظفات", name: "عالم النظافة", items: [{ name: "مسحوق غسيل", price: 45 }, { name: "كلور", price: 15 }] },
    { id: 6, category: "خضروات وفواكه", name: "خضري العيلة", items: [{ name: "طماطم 1ك", price: 15 }, { name: "موز 1ك", price: 20 }] }
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
      const [shopName, itemName] = key.split('-');
      const shop = shops.find(s => s.name === shopName);
      const item = shop.items.find(i => i.name === itemName);
      total += item.price * cart[key];
    });
    return total;
  };

  const sendOrder = () => {
    if(!customerInfo.name || !customerInfo.phone) return alert("برجاء ملء البيانات");
    localStorage.setItem('miniTalabat_user', JSON.stringify(customerInfo));
    const orderList = Object.keys(cart).map(key => `• ${key.split('-')[1]} (${cart[key]} قطع)`).join('\n');
    const message = `*طلب جديد من Mini Talabat* 🚀\n---------------------------\n*👤 العميل:* ${customerInfo.name}\n*📞 الهاتف:* ${customerInfo.phone}\n*📍 العنوان:* ${customerInfo.address}\n\n*🛒 الطلبات:*\n${orderList}\n\n*💰 الإجمالي:* ${calculateTotal()} ج.م\n---------------------------\n_تم عبر ميني طلبات_ 🧡`;
    window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div dir="rtl" style={{ padding: '15px', fontFamily: 'sans-serif', backgroundColor: '#fdfdfd', paddingBottom: '120px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '70px' }} />
        <h1 style={{ color: '#FF6600', margin: '5px' }}>Mini Talabat</h1>
        <button onClick={() => window.location.href='/contact'} style={{ backgroundColor: '#eee', border: 'none', padding: '8px 15px', borderRadius: '20px', fontSize: '13px' }}>📞 تواصل معنا (الدعم الفني)</button>
      </header>

      {/* عرض المحلات حسب القسم */}
      {shops.map(shop => (
        <div key={shop.id} style={{ border: '1px solid #eee', borderRadius: '15px', padding: '15px', marginBottom: '20px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <h3 style={{ borderRight: '4px solid #FF6600', paddingRight: '10px', margin: 0 }}>{shop.name}</h3>
             <span style={{ fontSize: '12px', color: '#888', backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '10px' }}>{shop.category}</span>
          </div>
          {shop.items.map(item => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
              <span>{item.name} <b style={{color: '#FF6600'}}>{item.price} ج.م</b></span>
              <button onClick={() => addToCart(shop.name, item)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '8px', width: '35px', height: '35px', fontWeight: 'bold' }}>+</button>
            </div>
          ))}
        </div>
      ))}

      {calculateTotal() > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: '15px', borderTop: '2px solid #FF6600', zIndex: 1000 }}>
          {!showOrderForm ? (
            <button onClick={() => setShowOrderForm(true)} style={{ width: '100%', padding: '15px', backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px' }}>
              تأكيد الطلب ({calculateTotal()} ج.م)
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input placeholder="الاسم" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle} />
              <input placeholder="الموبايل" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} />
              <input placeholder="العنوان" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} />
              <button onClick={sendOrder} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>إرسال للواتساب ✅</button>
              <button onClick={() => setShowOrderForm(false)} style={{ color: '#888', fontSize: '12px', background: 'none', border: 'none' }}>إلغاء</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' };
