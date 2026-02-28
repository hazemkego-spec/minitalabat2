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

  // إضافة الأسعار للمنتجات (أمثلة تقريبية)
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
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '25px', backgroundColor: colors.white, padding: '15px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '35px' }}>🛒</div>
        <div style={{ fontWeight: 'bold' }}>
          <span style={{ color: colors.primaryOrange }}>Mini</span> <span style={{ color: colors.darkBlue, fontSize: '24px' }}>Talabat</span>
        </div>
        <button 
          onClick={() => setShowContact(!showContact)}
          style={{ marginTop: '10px', background: 'none', border: `1px solid ${colors.primaryOrange}`, color: colors.primaryOrange, padding: '5px 15px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}
        >
          {showContact ? "العودة للتسوق" : "أضف محلك معنا 🤝"}
        </button>
      </div>

      {showContact ? (
        /* صفحة اتصل بنا */
        <div style={{ background: colors.white, padding: '25px', borderRadius: '25px', textAlign: 'center' }}>
          <h2 style={{ color: colors.darkBlue }}>انضم لعائلة ميني طلبات</h2>
          <p style={{ color: '#666', lineHeight: '1.6' }}>هل تمتلك محلاً وتريد زيادة مبيعاتك؟ انضم إلينا الآن واعرض منتجاتك مجاناً!</p>
          <div style={{ margin: '30px 0', fontSize: '50px' }}>📱</div>
          <button 
            onClick={() => window.open(`https://wa.me/201234567890?text=${encodeURIComponent("أريد إضافة محلي في تطبيق ميني طلبات")}`)}
            style={{ width: '100%', padding: '15px', background: colors.successGreen, color: colors.white, border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px' }}
          >
            تواصل مع الإدارة (واتساب)
          </button>
        </div>
      ) : (
        <>
          {/* شريط الأقسام */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '15px', marginBottom: '20px', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', backgroundColor: activeCategory === cat ? colors.primaryOrange : colors.white, color: activeCategory === cat ? colors.white : colors.darkBlue, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* عرض المحلات */}
          <div style={{ display: 'grid', gap: '15px' }}>
            {filteredShops.map(s => (
              <div key={s.id} style={{ background: colors.white, padding: '20px', borderRadius: '25px', border: `1px solid #eee` }}>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '20px', color: colors.darkBlue, borderRight: `4px solid ${colors.primaryOrange}`, paddingRight: '10px' }}>{s.name}</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {s.items.map(i => (
                    <button key={i.n} onClick={() => addToCart(s.name, i.n, i.p)} style={{ padding: '10px', borderRadius: '12px', border: `1px solid #ddd`, backgroundColor: '#fff', fontSize: '13px' }}>
                      {i.n} <br/> <b style={{color: colors.primaryOrange}}>{i.p}ج</b>
                    </button>
                  ))}
                </div>
                <button onClick={() => sendWhatsApp(s.name, s.phone)} style={{ width: '100%', marginTop: '15px', padding: '12px', background: colors.primaryOrange, color: colors.white, border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
                  تأكيد الطلب ({calculateTotal(s.name)} ج.م)
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* السلة المطورة */}
      {cart.length > 0 && !showContact && (
        <div style={{ position: 'fixed', bottom: '15px', left: '15px', right: '15px', background: colors.darkBlue, color: '#fff', padding: '15px', borderRadius: '20px', boxShadow: '0 -5px 20px rgba(0,0,0,0.3)', zIndex: 1000 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #444', paddingBottom: '8px', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>🛒 الأصناف مختارة: {cart.length}</span>
            <span style={{ color: colors.primaryOrange, fontWeight: 'bold' }}>الإجمالي: {cart.reduce((a,b)=>a+b.price, 0)} ج.م</span>
          </div>
          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '5px' }}>
                <span>{item.item} - {item.price}ج</span>
                <button onClick={() => removeFromCart(item.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px' }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
