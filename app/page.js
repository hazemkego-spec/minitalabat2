"use client";
import React, { useState, useEffect } from 'react';

export default function MiniTalabat() {
  const [cart, setCart] = useState({});
  const [itemNotes, setItemNotes] = useState({}); 
  const [activeCategory, setActiveCategory] = useState('الكل'); 
  const [activeTab, setActiveTab] = useState('home'); 
  const MAIN_PHONE = "201122947479"; 
  
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    const saved = localStorage.getItem('miniTalabat_user');
    if (saved) setCustomerInfo(JSON.parse(saved));
  }, []);

  const categories = ["الكل", "مطاعم", "سوبر ماركت", "صيدليات", "عطارة", "منظفات", "خضروات وفواكه"];

  const shops = [
    { id: 1, category: "مطاعم", name: "مطعم السعادة", isOpen: true, items: [{ name: "بيتزا", price: 120 }, { name: "كريب", price: 80 }] },
    { id: 2, category: "سوبر ماركت", name: "سوبر ماركت الخير", isOpen: true, items: [{ name: "لبن", price: 35 }, { name: "جبنة", price: 70 }] },
    { id: 3, category: "صيدليات", name: "صيدلية الشفاء", isOpen: true, items: [{ name: "بندول", price: 30 }] },
    { id: 4, category: "عطارة", name: "عطارة مكة", isOpen: true, items: [{ name: "فلفل أسود", price: 20 }] },
    { id: 5, category: "منظفات", name: "عالم النظافة", isOpen: true, items: [{ name: "مسحوق غسيل", price: 45 }] },
    { id: 6, category: "خضروات وفواكه", name: "خضري العيلة", isOpen: true, items: [{ name: "طماطم 1ك", price: 15 }] }
  ];

  const addToCart = (shopName, item) => {
    const newCart = { ...cart };
    const key = `${shopName}-${item.name}`;
    newCart[key] = (newCart[key] || 0) + 1;
    setCart(newCart);
  };

  const removeFromCart = (key) => {
    const newCart = { ...cart };
    if (newCart[key] > 1) {
      newCart[key] -= 1;
    } else {
      delete newCart[key];
      const newNotes = { ...itemNotes };
      delete newNotes[key];
      setItemNotes(newNotes);
    }
    setCart(newCart);
  };

  const updateItemNote = (key, note) => {
    setItemNotes({ ...itemNotes, [key]: note });
  };

  const calculateTotal = () => {
    let total = 0;
    Object.keys(cart).forEach(key => {
      const [shopName, itemName] = key.split('-');
      const shop = shops.find(s => s.name === shopName);
      const item = shop?.items.find(i => i.name === itemName);
      total += (item?.price || 0) * cart[key];
    });
    return total;
  };

  const sendOrder = () => {
    if(!customerInfo.name || !customerInfo.phone || !customerInfo.address) return alert("برجاء ملء بيانات التوصيل");
    localStorage.setItem('miniTalabat_user', JSON.stringify(customerInfo));
    
    let orderDetails = "";
    Object.keys(cart).forEach(key => {
      const [shopName, itemName] = key.split('-');
      const noteText = itemNotes[key] ? ` [ملاحظة: ${itemNotes[key]}]` : "";
      orderDetails += `\n• ${itemName} من ${shopName} (${cart[key]}ق)${noteText}`;
    });

    const message = `*طلب جديد من Mini Talabat* 🚀\n👤 العميل: ${customerInfo.name}\n📞 هاتف: ${customerInfo.phone}\n📍 عنوان: ${customerInfo.address}\n${orderDetails}\n💰 الإجمالي: ${calculateTotal()} ج.م`;
    window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div dir="rtl" style={{ padding: '10px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {activeTab === 'home' && (
        <>
          <header style={{ textAlign: 'center', marginBottom: '15px' }}>
            <img src="/mall-logo.png" alt="Logo" style={{ width: '70px', height: '70px', borderRadius: '50%', filter: 'drop-shadow(0 0 8px #FF6600)' }} />
            <h1 style={{ color: '#FF6600', margin: '5px 0', fontSize: '22px' }}>Mini Talabat</h1>
            <p style={{ fontSize: '13px', color: '#aaa' }}>أكبر مول تجاري رقمي في جيبك</p>
          </header>

          <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', marginBottom: '15px', paddingBottom: '5px' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 18px', borderRadius: '20px', border: activeCategory === cat ? 'none' : '1px solid #333', backgroundColor: activeCategory === cat ? '#FF6600' : '#1e1e1e', color: '#fff', whiteSpace: 'nowrap' }}>{cat}</button>
            ))}
          </div>

          {shops.filter(s => activeCategory === 'الكل' || s.category === activeCategory).map(shop => (
            <div key={shop.id} style={{ border: '1px solid #333', borderRadius: '15px', padding: '15px', marginBottom: '15px', backgroundColor: '#1e1e1e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#FF6600' }}>{shop.name}</h3>
                <span style={{ fontSize: '11px', color: shop.isOpen ? '#4caf50' : '#f44336' }}>{shop.isOpen ? '● مفتوح' : '○ مغلق'}</span>
              </div>
              {shop.items.map(item => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                  <span>{item.name} <b style={{color: '#FF6600'}}>{item.price}ج</b></span>
                  <button onClick={() => addToCart(shop.name, item)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '8px', width: '35px', height: '35px' }}>+</button>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {activeTab === 'cart' && (
        <div style={{ padding: '5px' }}>
          <h2 style={{ color: '#FF6600', textAlign: 'center' }}>سلة المشتريات 🛒</h2>
          <hr style={{ borderColor: '#333', margin: '15px 0' }} />
          
          {Object.keys(cart).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>السلة فارغة حالياً</p>
          ) : (
            <>
              {Object.keys(cart).map(key => (
                <div key={key} style={{ backgroundColor: '#1e1e1e', padding: '12px', borderRadius: '12px', marginBottom: '12px', border: '1px solid #333' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{fontWeight: 'bold'}}>{key.split('-')[1]} ({cart[key]}ق)</span>
                    <button onClick={() => removeFromCart(key)} style={{ color: '#ff4444', background: 'none', border: '1px solid #ff4444', borderRadius: '5px', padding: '2px 8px', fontSize: '12px' }}>إزالة</button>
                  </div>
                  {/* رجوع حقل الملاحظات لكل صنف */}
                  <input 
                    placeholder="إضافة ملاحظة لهذا الصنف..." 
                    value={itemNotes[key] || ""}
                    onChange={(e) => updateItemNote(key, e.target.value)}
                    style={{ width: '100%', backgroundColor: '#121212', color: '#bbb', border: 'none', borderBottom: '1px solid #FF6600', fontSize: '12px', padding: '5px 0', outline: 'none' }}
                  />
                </div>
              ))}
              
              <div style={{ marginTop: '20px', backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '15px', border: '1px solid #444' }}>
                <h4 style={{ marginBottom: '15px', color: '#FF6600' }}>📍 بيانات التوصيل:</h4>
                <input placeholder="الاسم" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle} />
                <input placeholder="الموبايل" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} />
                <input placeholder="العنوان بالتفصيل" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} />
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#FF6600' }}>الإجمالي النهائي: {calculateTotal()} ج.م</div>
                <button onClick={sendOrder} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '15px', fontWeight: 'bold', fontSize: '16px' }}>إرسال للواتساب ✅</button>
              </div>
            </>
          )}
        </div>
      )}

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1e1e1e', display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: '2px solid #333', zIndex: 1000 }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#FF6600' : '#888', textAlign: 'center', transition: '0.3s' }}>
          <div style={{ fontSize: '24px' }}>🏠</div>
          <div style={{ fontSize: '12px', marginTop: '2px' }}>الرئيسية</div>
        </button>
        <button onClick={() => setActiveTab('cart')} style={{ background: 'none', border: 'none', color: activeTab === 'cart' ? '#FF6600' : '#888', textAlign: 'center', position: 'relative', transition: '0.3s' }}>
          <div style={{ fontSize: '24px' }}>🛒</div>
          <div style={{ fontSize: '12px', marginTop: '2px' }}>السلة</div>
          {Object.keys(cart).length > 0 && (
            <span style={{ position: 'absolute', top: '-2px', right: '5px', backgroundColor: '#FF6600', color: '#fff', borderRadius: '50%', padding: '2px 7px', fontSize: '11px', fontWeight: 'bold' }}>{Object.keys(cart).length}</span>
          )}
        </button>
      </nav>
    </div>
  );
}
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#121212', color: '#fff', marginBottom: '12px', outline: 'none' };
