"use client";
import React, { useState } from 'react';

export default function Home() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("الكل");

  // قائمة الأقسام
  const categories = ["الكل", "سوبر ماركت", "صيدليات", "مطاعم", "عطارة", "منظفات", "خضروات وفواكه"];

  // قاعدة بيانات المحلات
  const shops = [
    { id: 1, category: "مطاعم", name: "مطعم السعادة", items: ["بيتزا", "كريب", "شاورما"], phone: "201000000000" },
    { id: 2, category: "خضروات وفواكه", name: "خضروات الطازج", items: ["طماطم", "خيار", "تفاح"], phone: "201000000000" },
    { id: 3, category: "صيدليات", name: "صيدلية الشفاء", items: ["بندول", "فيتامينات", "كمامات"], phone: "201000000000" },
    { id: 4, category: "سوبر ماركت", name: "ماركت الخير", items: ["أرز", "مكرونة", "زيت"], phone: "201000000000" },
    { id: 5, category: "عطارة", name: "عطارة مكة", items: ["فلفل أسود", "كمون", "بخور"], phone: "201000000000" },
    { id: 6, category: "منظفات", name: "منظفات النور", items: ["صابون", "كلور", "ديتول"], phone: "201000000000" },
  ];

  const addToCart = (shop, item) => {
    setCart([...cart, { shop, item }]);
    alert(`تم إضافة ${item} للسلة`);
  };

  const sendWhatsApp = (shopName, phone) => {
    const orders = cart.filter(o => o.shop === shopName).map(o => o.item).join(", ");
    if (!orders) return alert("السلة فارغة لهذا المحل!");
    const message = `طلب جديد من ${shopName}: ${orders}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  };

  // تصفية المحلات بناءً على القسم المختار
  const filteredShops = activeCategory === "الكل" 
    ? shops 
    : shops.filter(s => s.category === activeCategory);

  return (
    <div style={{ direction: 'rtl', padding: '15px', fontFamily: 'Arial', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#25D366', fontSize: '24px' }}>تطبيق ميني طلبات</h1>
      
      {/* شريط الأقسام */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', padding: '10px 0', marginBottom: '20px', whiteSpace: 'nowrap' }}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeCategory === cat ? '#25D366' : '#fff',
              color: activeCategory === cat ? '#fff' : '#333',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* عرض المحلات */}
      <div>
        {filteredShops.length > 0 ? filteredShops.map(s => (
          <div key={s.id} style={{ background: '#fff', padding: '15px', borderRadius: '15px', marginBottom: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: '0', fontSize: '18px' }}>{s.name}</h2>
              <span style={{ fontSize: '12px', color: '#888', background: '#eee', padding: '2px 8px', borderRadius: '10px' }}>{s.category}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '15px 0' }}>
              {s.items.map(i => (
                <button key={i} onClick={() => addToCart(s.name, i)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }}>
                  + {i}
                </button>
              ))}
            </div>

            <button 
              onClick={() => sendWhatsApp(s.name, s.phone)} 
              style={{ width: '100%', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}
            >
              طلب عبر واتساب ({cart.filter(o => o.shop === s.name).length})
            </button>
          </div>
        )) : <p style={{ textAlign: 'center' }}>قريباً في هذا القسم...</p>}
      </div>
    </div>
  );
}
