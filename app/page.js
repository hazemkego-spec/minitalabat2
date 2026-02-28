"use client";
import React, { useState } from 'react';

const colors = {
  primaryOrange: '#FF6600',
  darkBlue: '#001F3F',
  lightBg: '#F4F7F6',
  white: '#FFFFFF',
  successGreen: '#2ecc71'
};

export default function Home() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [showContact, setShowContact] = useState(false);

  const categories = ["الكل", "سوبر ماركت", "صيدليات", "مطاعم", "عطارة", "منظفات", "خضروات وفواكه"];

  const shops = [
    { id: 1, category: "مطاعم", name: "مطعم السعادة", items: [{n: "بيتزا", p: 120}, {n: "كريب", p: 80}, {n: "شاورما", p: 60}], phone: "201000000000" },
    { id: 2, category: "مطاعم", name: "برجر كينج العرب", items: [{n: "تشيكن برجر", p: 90}, {n: "بيف برجر", p: 110}, {n: "بطاطس", p: 30}], phone: "201011111111" },
  ];

  const addToCart = (shop, itemName, price) => {
    const uniqueItem = { id: Date.now(), shop, item: itemName, price: price };
    setCart([...cart, uniqueItem]);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(i => i.id !== itemId));
  };

  const calculateTotal = (shopName) => {
    return cart.filter(o => o.shop === shopName).reduce((sum, item) => sum + item.price, 0);
  };

  const sendWhatsApp = (shopName, phone) => {
    const shopOrders = cart.filter(o => o.shop === shopName);
    if (shopOrders.length === 0) return alert(`سلة ${shopName} فارغة!`);
    const itemsText = shopOrders.map(o => `- ${o.item} (${o.price} ج.م)`).join("\n");
    const total = calculateTotal(shopName);
    const message = `طلب جديد من Mini Talabat 🛒\nالمحل: ${shopName}\n---\n${itemsText}\n---\n💰 الإجمالي: ${total} ج.م`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  };

  const filteredShops = activeCategory === "الكل" ? shops : shops.filter(s => s.category === activeCategory);

  return (
    <div style={{ direction: 'rtl', padding: '15px', fontFamily: 'Arial', backgroundColor: colors.lightBg, minHeight: '100vh', paddingBottom: '150px' }}>
      
      {/* --- هيدر احترافي جديد يحل مشكلة اللوجو --- */}
      <div style={{ textAlign: 'center', marginBottom: '25px', backgroundColor: colors.white, padding: '25px 15px', borderRadius: '0 0 30px 30px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', marginTop: '-15px', marginRight: '-15px', marginLeft: '-15px' }}>
        <div style={{ 
          width: '90px', 
          height: '90px', 
          margin: '0 auto 15px', 
          borderRadius: '20px', 
          overflow: 'hidden', 
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `2px solid #eee`
        }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ fontWeight: 'bold', lineHeight: '1' }}>
          <span style={{ color: colors.primaryOrange, fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>Mini</span> <br/>
          <span style={{ color: colors.darkBlue, fontSize: '30px', fontWeight: '900' }}>Talabat</span>
        </div>
        <button 
          onClick={() => setShowContact(!showContact)}
          style={{ marginTop: '15px', backgroundColor: colors.primaryOrange, color: colors.white, border: 'none', padding: '8px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(255, 102, 0, 0.3)' }}
        >
          {showContact ? "العودة للتسوق" : "أضف محلك معنا 🤝"}
        </button>
      </div>

      {/* باقي الكود (المحلات والأقسام) */}
      {!showContact && (
        <>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '15px', marginBottom: '20px', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '12px 22px', borderRadius: '30px', border: 'none', backgroundColor: activeCategory === cat ? colors.primaryOrange : colors.white, color: activeCategory === cat ? colors.white : colors.darkBlue, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            {filteredShops.map(s => (
              <div key={s.id} style={{ background: colors.white, padding: '20px', borderRadius: '25px', border: `1px solid #eee` }}>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '20px', color: colors.darkBlue, borderRight: `4px solid ${colors.primaryOrange}`, paddingRight: '12px' }}>{s.name}</h2>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {s.items.map(i => (
                    <button key={i.n} onClick={() => addToCart(s.name, i.n, i.p)} style={{ padding: '10px 15px', borderRadius: '15px', border: `1px solid #eee`, backgroundColor: '#fcfcfc', fontSize: '14px', color: colors.darkBlue }}>
                      {i.n} <br/> <b style={{color: colors.primaryOrange}}>{i.p} ج.م</b>
                    </button>
                  ))}
                </div>
                <button onClick={() => sendWhatsApp(s.name, s.phone)} style={{ width: '100%', marginTop: '20px', padding: '15px', background: colors.primaryOrange, color: colors.white, border: 'none', borderRadius: '15px', fontWeight: 'bold' }}>
                  تأكيد طلب {s.name}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* السلة */}
      {cart.length > 0 && !showContact && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', background: colors.darkBlue, color: '#fff', padding: '18px', borderRadius: '25px', boxShadow: '0 -5px 25px rgba(0,0,0,0.4)', zIndex: 1000, border: `1px solid ${colors.primaryOrange}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${colors.primaryOrange}`, paddingBottom: '10px', marginBottom: '12px' }}>
            <span>🛒 العناصر: {cart.length}</span>
            <span style={{ color: colors.primaryOrange, fontWeight: 'bold' }}>{cart.reduce((a,b)=>a+b.price, 0)} ج.م</span>
          </div>
        </div>
      )}
    </div>
  );
}
