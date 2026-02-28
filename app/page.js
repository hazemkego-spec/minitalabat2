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
    { id: 4, category: "صيدليات", name: "صيدلية الشفاء", items: [{n: "بندول", p: 25}, {n: "فيتامينات", p: 150}], phone: "201033333333" },
    { id: 6, category: "سوبر ماركت", name: "ماركت الخير", items: [{n: "أرز", p: 35}, {n: "مكرونة", p: 15}, {n: "زيت", p: 70}], phone: "201055555555" },
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
      
      {/* --- الهيدر الاحترافي الموحد --- */}
      <div style={{ textAlign: 'center', marginBottom: '25px', backgroundColor: colors.white, padding: '25px 15px', borderRadius: '0 0 30px 30px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', marginTop: '-15px', marginRight: '-15px', marginLeft: '-15px' }}>
        <div style={{ 
          width: '90px', height: '90px', margin: '0 auto 15px', borderRadius: '20px', overflow: 'hidden', 
          backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid #eee`
        }}>
          <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ fontWeight: 'bold', lineHeight: '1' }}>
          <span style={{ color: colors.primaryOrange, fontSize: '12px', letterSpacing: '2px' }}>MINI</span> <br/>
          <span style={{ color: colors.darkBlue, fontSize: '30px', fontWeight: '900' }}>Talabat</span>
        </div>
        <button 
          onClick={() => setShowContact(!showContact)}
          style={{ marginTop: '15px', backgroundColor: showContact ? colors.darkBlue : colors.primaryOrange, color: colors.white, border: 'none', padding: '10px 25px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
        >
          {showContact ? "العودة للتسوق 🛒" : "أضف محلك معنا 🤝"}
        </button>
      </div>

      {showContact ? (
        /* --- استعادة صفحة اتصل بنا كاملة --- */
        <div style={{ background: colors.white, padding: '30px', borderRadius: '25px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: colors.darkBlue, marginBottom: '15px' }}>انضم لعائلة ميني طلبات 🚀</h2>
          <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px' }}>
            هل تمتلك مطعماً، صيدلية، أو سوبر ماركت؟ <br/>
            عايز مبيعاتك تزيد وتوصل لكل العملاء في منطقتك؟ <br/>
            ابعتلنا بياناتك دلوقتي وهنضيف محلك في أسرع وقت!
          </p>
          <div style={{ margin: '30px 0', fontSize: '60px' }}>🤝</div>
          <button 
            onClick={() => window.open(`https://wa.me/201234567890?text=${encodeURIComponent("مرحباً إدارة ميني طلبات، أريد إضافة محلي الخاص في التطبيق.")}`)}
            style={{ width: '100%', padding: '18px', background: colors.successGreen, color: colors.white, border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 5px 15px rgba(46, 204, 113, 0.3)' }}
          >
            تحدث معنا على واتساب
          </button>
          <p style={{ marginTop: '20px', color: '#999', fontSize: '12px' }}>جميع الحقوق محفوظة لـ Mini Talabat 2024</p>
        </div>
      ) : (
        <>
          {/* شريط الأقسام */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '15px', marginBottom: '20px', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '12px 22px', borderRadius: '30px', border: 'none', backgroundColor: activeCategory === cat ? colors.primaryOrange : colors.white, color: activeCategory === cat ? colors.white : colors.darkBlue, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* عرض المحلات */}
          <div style={{ display: 'grid', gap: '15px' }}>
            {filteredShops.map(s => (
              <div key={s.id} style={{ background: colors.white, padding: '20px', borderRadius: '25px', border: `1px solid #eee`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '20px', color: colors.darkBlue, borderRight: `4px solid ${colors.primaryOrange}`, paddingRight: '12px' }}>{s.name}</h2>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {s.items.map(i => (
                    <button key={i.n} onClick={() => addToCart(s.name, i.n, i.p)} style={{ padding: '10px 15px', borderRadius: '15px', border: `1px solid #eee`, backgroundColor: '#fcfcfc', fontSize: '14px', color: colors.darkBlue }}>
                      {i.n} <br/> <b style={{color: colors.primaryOrange}}>{i.p} ج.م</b>
                    </button>
                  ))}
                </div>
                <button onClick={() => sendWhatsApp(s.name, s.phone)} style={{ width: '100%', marginTop: '20px', padding: '15px', background: colors.primaryOrange, color: colors.white, border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px' }}>
                  تأكيد طلب {s.name} ({calculateTotal(s.name)} ج.م)
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* السلة العائمة */}
      {cart.length > 0 && !showContact && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', background: colors.darkBlue, color: '#fff', padding: '18px', borderRadius: '25px', boxShadow: '0 -5px 25px rgba(0,0,0,0.4)', zIndex: 1000, border: `1px solid ${colors.primaryOrange}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${colors.primaryOrange}`, paddingBottom: '10px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold' }}>🛒 العناصر: {cart.length}</span>
            <span style={{ color: colors.primaryOrange, fontWeight: 'bold' }}>الإجمالي: {cart.reduce((a,b)=>a+b.price, 0)} ج.م</span>
          </div>
          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '10px' }}>
                <span>{item.item} ({item.price}ج)</span>
                <button onClick={() => removeFromCart(item.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', fontWeight: 'bold' }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
