"use client";
import React, { useState } from 'react';

// الألوان المستوحاة من اللوجو الجديد
const colors = {
  primaryOrange: '#FF6600', // اللون البرتقالي من سلة اللوجو
  darkBlue: '#001F3F',    // اللون الأزرق الداكن من كلمة "Talabat"
  lightBg: '#F4F7F6',     // خلفية رمادية فاتحة جداً مريحة للعين
  white: '#FFFFFF'
};

export default function Home() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("الكل");

  const categories = ["الكل", "سوبر ماركت", "صيدليات", "مطاعم", "عطارة", "منظفات", "خضروات وفواكه"];

  const shops = [
    { id: 1, category: "مطاعم", name: "مطعم السعادة", items: ["بيتزا", "كريب", "شاورما"], phone: "201000000000" },
    { id: 2, category: "مطاعم", name: "برجر كينج العرب", items: ["تشيكن برجر", "بيف برجر", "بطاطس"], phone: "201011111111" },
    { id: 4, category: "صيدليات", name: "صيدلية الشفاء", items: ["بندول", "فيتامينات"], phone: "201033333333" },
    { id: 6, category: "سوبر ماركت", name: "ماركت الخير", items: ["أرز", "مكرونة", "زيت"], phone: "201055555555" },
  ];

  const addToCart = (shop, item) => {
    const uniqueItem = { id: Date.now(), shop, item };
    setCart([...cart, uniqueItem]);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(i => i.id !== itemId));
  };

  const sendWhatsApp = (shopName, phone) => {
    const shopOrders = cart.filter(o => o.shop === shopName).map(o => o.item).join(", ");
    if (!shopOrders) return alert(`سلة ${shopName} فارغة!`);
    
    const message = `طلب جديد من ${shopName}:\nالمنتجات: ${shopOrders}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  };

  const filteredShops = activeCategory === "الكل" 
    ? shops 
    : shops.filter(s => s.category === activeCategory);

  return (
    <div style={{ direction: 'rtl', padding: '15px', fontFamily: 'Arial, sans-serif', backgroundColor: colors.lightBg, minHeight: '100vh', paddingBottom: '120px' }}>
      
      {/* --- الهيدر واللوجو الجديد --- */}
      <div style={{ textAlign: 'center', marginBottom: '30px', backgroundColor: colors.white, padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        {/* اللوجو مستوحى من صورة 15، السلة والسهام بالبرتقالي */}
        <div style={{ fontSize: '40px', color: colors.primaryOrange, marginBottom: '5px' }}>🛒</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: colors.primaryOrange, fontWeight: 'bold', marginBottom: '-5px' }}>Mini</span>
          <span style={{ fontSize: '32px', color: colors.darkBlue, fontWeight: 'bold' }}>Talabat</span>
        </div>
      </div>
      
      {/* شريط الأقسام - تم تعديل الألوان لتناسب اللوجو */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '15px', marginBottom: '25px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '12px 24px',
              borderRadius: '30px',
              border: activeCategory === cat ? 'none' : `1px solid ${colors.darkBlue}`,
              backgroundColor: activeCategory === cat ? colors.primaryOrange : colors.white,
              color: activeCategory === cat ? colors.white : colors.darkBlue,
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* المحلات - تم تعديل الألوان لتناسب اللوجو */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredShops.map(s => (
          <div key={s.id} style={{ background: colors.white, padding: '20px', borderRadius: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)', border: `1px solid #eee` }}>
            <h2 style={{ margin: '0 0 15px 0', fontSize: '22px', color: colors.darkBlue, borderRight: `4px solid ${colors.primaryOrange}`, paddingRight: '10px' }}>{s.name}</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {s.items.map(i => (
                <button 
                  key={i} 
                  onClick={() => addToCart(s.name, i)}
                  style={{ 
                    padding: '10px 18px', 
                    borderRadius: '15px', 
                    border: `1px solid ${colors.darkBlue}`, 
                    backgroundColor: colors.white,
                    color: colors.darkBlue,
                    fontSize: '14px'
                  }}
                >
                  + {i}
                </button>
              ))}
            </div>
            {/* زر الواتساب باللون البرتقالي الجديد */}
            <button 
              onClick={() => sendWhatsApp(s.name, s.phone)} 
              style={{ 
                width: '100%', 
                marginTop: '20px', 
                padding: '15px', 
                background: colors.primaryOrange, 
                color: colors.white, 
                border: 'none', 
                borderRadius: '15px', 
                fontWeight: 'bold',
                fontSize: '17px',
                boxShadow: '0 4px 10px rgba(255, 102, 0, 0.2)'
              }}
            >
              إرسال طلب {s.name} لـ "Talabat" ({cart.filter(o => o.shop === s.name).length})
            </button>
          </div>
        ))}
      </div>

      {/* --- السلة العائمة - تم تعديل الألوان لتناسب اللوجو --- */}
      {cart.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          background: colors.darkBlue, // الأزرق الداكن خلفية للسلة
          color: colors.white,
          padding: '18px',
          borderRadius: '25px',
          boxShadow: '0 -5px 25px rgba(0,0,0,0.3)',
          zIndex: 1000,
          border: `2px solid ${colors.primaryOrange}` // إطار برتقالي خفيف
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', borderBottom: `1px solid ${colors.primaryOrange}`, paddingBottom: '8px', color: colors.white }}>🛒 سلة "Mini Talabat":</h3>
          <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '15px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '10px' }}>
                <span>{item.item} <span style={{color: colors.primaryOrange, fontSize: '12px'}}>({item.shop})</span></span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: '#e74c3c', color: colors.white, border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: colors.white, fontWeight: 'bold' }}>
            إجمالي العناصر: {cart.length}
          </div>
        </div>
      )}
    </div>
  );
}
