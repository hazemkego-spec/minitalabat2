"use client";
import React, { useState, useEffect } from 'react';

export default function MiniTalabat() {
  const [cart, setCart] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('الكل'); 
  const MAIN_PHONE = "201122947479"; 
  
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    const saved = localStorage.getItem('miniTalabat_user');
    if (saved) setCustomerInfo(JSON.parse(saved));
  }, []);

  const categories = ["الكل", "مطاعم", "سوبر ماركت", "صيدليات", "عطارة", "منظفات", "خضروات وفواكه"];

  const shops = [
    { id: 1, category: "مطاعم", name: "مطعم السعادة", items: [{ name: "بيتزا", price: 120 }, { name: "كريب", price: 80 }] },
    { id: 2, category: "سوبر ماركت", name: "سوبر ماركت الخير", items: [{ name: "لبن", price: 35 }, { name: "جبنة", price: 70 }] },
    { id: 3, category: "صيدليات", name: "صيدلية الشفاء", items: [{ name: "بندول", price: 30 }] },
    { id: 4, category: "عطارة", name: "عطارة مكة", items: [{ name: "فلفل أسود", price: 20 }] },
    { id: 5, category: "منظفات", name: "عالم النظافة", items: [{ name: "مسحوق غسيل", price: 45 }] },
    { id: 6, category: "خضروات وفواكه", name: "خضري العيلة", items: [{ name: "طماطم 1ك", price: 15 }] }
  ];

  const filteredShops = activeCategory === 'الكل' ? shops : shops.filter(shop => shop.category === activeCategory);

  // وظيفة إضافة أو زيادة الكمية
  const addToCart = (shopName, item) => {
    const newCart = { ...cart };
    const key = `${shopName}-${item.name}`;
    newCart[key] = (newCart[key] || 0) + 1;
    setCart(newCart);
  };

  // وظيفة تقليل الكمية أو الحذف
  const removeFromCart = (key) => {
    const newCart = { ...cart };
    if (newCart[key] > 1) {
      newCart[key] -= 1;
    } else {
      delete newCart[key];
    }
    setCart(newCart);
  };

  const calculateTotal = () => {
    let total = 0;
    Object.keys(cart).forEach(key => {
      const [shopName, itemName] = key.split('-');
      const shop = shops.find(s => s.name === shopName);
      const item = shop.items?.find(i => i.name === itemName);
      if (item) total += item.price * cart[key];
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
    <div dir="rtl" style={{ padding: '10px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', paddingBottom: '180px' }}>
      <header style={{ textAlign: 'center', marginBottom: '10px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '60px' }} />
        <h1 style={{ color: '#FF6600', margin: '5px', fontSize: '22px' }}>Mini Talabat</h1>
        <button onClick={() => window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent("محتاج أضيف محلي")}`)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>🧡 ضيف محلك معنا</button>
      </header>

      <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', padding: '10px 0', marginBottom: '15px', whiteSpace: 'nowrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', backgroundColor: activeCategory === cat ? '#FF6600' : '#fff', color: activeCategory === cat ? '#fff' : '#555', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>{cat}</button>
        ))}
      </div>

      {filteredShops.map(shop => (
        <div key={shop.id} style={{ border: '1px solid #eee', borderRadius: '15px', padding: '15px', marginBottom: '15px', backgroundColor: '#fff' }}>
          <h3 style={{ borderRight: '4px solid #FF6600', paddingRight: '10px', margin: '0 0 10px 0' }}>{shop.name}</h3>
          {shop.items.map(item => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0' }}>
              <span>{item.name} <b style={{color: '#FF6600'}}>{item.price} ج.م</b></span>
              <button onClick={() => addToCart(shop.name, item)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '8px', width: '35px', height: '35px', fontWeight: 'bold' }}>+</button>
            </div>
          ))}
        </div>
      ))}

      {/* لوحة السلة الذكية والتحكم في الطلبات */}
      {calculateTotal() > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTop: '2px solid #FF6600', boxShadow: '0 -4px 15px rgba(0,0,0,0.1)', zIndex: 2000, padding: '15px', borderRadius: '20px 20px 0 0' }}>
          {!showOrderForm ? (
            <div>
              <div style={{ maxHeight: '120px', overflowY: 'auto', marginBottom: '10px' }}>
                {Object.keys(cart).map(key => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px dotted #eee' }}>
                    <span style={{ fontSize: '14px' }}>{key.split('-')[1]} ({cart[key]} قطعة)</span>
                    <button onClick={() => removeFromCart(key)} style={{ color: 'red', border: 'none', background: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowOrderForm(true)} style={{ width: '100%', padding: '15px', backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px' }}>
                تأكيد الطلب ({calculateTotal()} ج.م)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input placeholder="الاسم" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle} />
              <input placeholder="الموبايل" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} />
              <input placeholder="العنوان" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} />
              <button onClick={sendOrder} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>إرسال للواتساب ✅</button>
              <button onClick={() => setShowOrderForm(false)} style={{ color: '#888', background: 'none', border: 'none' }}>رجوع للسلة</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' };
