"use client";
import React, { useState } from 'react';

export default function Home() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("الكل");

  const categories = ["الكل", "سوبر ماركت", "صيدليات", "مطاعم", "عطارة", "منظفات", "خضروات وفواكه"];

  const shops = [
    { id: 1, category: "مطاعم", name: "مطعم السعادة", items: ["بيتزا", "كريب", "شاورما"], phone: "201000000000" },
    { id: 2, category: "مطاعم", name: "برجر كينج العرب", items: ["تشيكن برجر", "بيف برجر", "بطاطس"], phone: "201011111111" },
    { id: 4, category: "صيدليات", name: "صيدلية الشفاء", items: ["بندول", "فيتامينات", "كمامات"], phone: "201033333333" },
    { id: 6, category: "سوبر ماركت", name: "ماركت الخير", items: ["أرز", "مكرونة", "زيت"], phone: "201055555555" },
  ];

  const addToCart = (shop, item) => {
    // إضافة معرف فريد (timestamp) لكل قطعة لسهولة حذفها تحديداً
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
    <div style={{ direction: 'rtl', padding: '15px', fontFamily: 'Arial', backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '100px' }}>
      <h1 style={{ textAlign: 'center', color: '#2ecc71', fontSize: '28px', marginBottom: '20px' }}>ميني طلبات 🛍️</h1>
      
      {/* شريط الأقسام */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '15px', marginBottom: '20px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '12px 22px',
              borderRadius: '30px',
              border: 'none',
              backgroundColor: activeCategory === cat ? '#2ecc71' : '#fff',
              color: activeCategory === cat ? '#fff' : '#666',
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* المحلات */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredShops.map(s => (
          <div key={s.id} style={{ background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{s.name}</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {s.items.map(i => (
                <button 
                  key={i} 
                  onClick={() => addToCart(s.name, i)}
                  style={{ padding: '8px 14px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#fdfdfd' }}
                >
                  + {i}
                </button>
              ))}
            </div>
            <button 
              onClick={() => sendWhatsApp(s.name, s.phone)} 
              style={{ width: '100%', marginTop: '15px', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}
            >
              إرسال طلب {s.name} ({cart.filter(o => o.shop === s.name).length})
            </button>
          </div>
        ))}
      </div>

      {/* --- السلة العائمة --- */}
      {cart.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          background: '#34495e',
          color: '#fff',
          padding: '15px',
          borderRadius: '20px',
          boxShadow: '0 -5px 20px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', borderBottom: '1px solid #5d6d7e', paddingBottom: '5px' }}>🛒 السلة الحالية:</h3>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '14px' }}>
                <span>{item.item} ({item.shop})</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#bdc3c7' }}>
            إجمالي العناصر: {cart.length}
          </div>
        </div>
      )}
    </div>
  );
}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '12px 22px',
              borderRadius: '30px',
              border: 'none',
              backgroundColor: activeCategory === cat ? '#2ecc71' : '#fff',
              color: activeCategory === cat ? '#fff' : '#666',
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* المحلات */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredShops.map(s => (
          <div key={s.id} style={{ background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{s.name}</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {s.items.map(i => (
                <button 
                  key={i} 
                  onClick={() => addToCart(s.name, i)}
                  style={{ padding: '8px 14px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#fdfdfd' }}
                >
                  + {i}
                </button>
              ))}
            </div>
            <button 
              onClick={() => sendWhatsApp(s.name, s.phone)} 
              style={{ width: '100%', marginTop: '15px', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}
            >
              إرسال طلب {s.name} ({cart.filter(o => o.shop === s.name).length})
            </button>
          </div>
        ))}
      </div>

      {/* --- السلة العائمة --- */}
      {cart.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          background: '#34495e',
          color: '#fff',
          padding: '15px',
          borderRadius: '20px',
          boxShadow: '0 -5px 20px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', borderBottom: '1px solid #5d6d7e', paddingBottom: '5px' }}>🛒 السلة الحالية:</h3>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '14px' }}>
                <span>{item.item} ({item.shop})</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#bdc3c7' }}>
            إجمالي العناصر: {cart.length}
          </div>
        </div>
      )}
    </div>
  );
}

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
