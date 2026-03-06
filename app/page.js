"use client";
import React, { useState, useEffect } from 'react';

export default function MiniTalabat() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');

  const categories = ['الكل', 'مطاعم', 'سوبر ماركت', 'صيدليات', 'عطارة'];
  const shops = [
    { id: 1, name: 'مطعم السعادة', category: 'مطاعم', items: [{ name: 'بيتزا', price: 120 }, { name: 'كريب', price: 80 }] },
    { id: 2, name: 'سوبر ماركت الخير', category: 'سوبر ماركت', items: [{ name: 'لبن', price: 35 }] }
  ];

  const addToCart = (item, shopName) => {
    setCart([...cart, { ...item, shopName }]);
  };

  const sendOrder = () => {
    if (!customerName || !customerAddress) return alert("برجاء ملء البيانات");
    const orderText = cart.map(i => `- ${i.name} (${i.price} ج.م) من ${i.shopName}`).join('\n');
    const fullMsg = `طلب جديد:\nالاسم: ${customerName}\nالعنوان: ${customerAddress}\n\nالطلبات:\n${orderText}\n\n${notes}`;
    window.open(`https://wa.me/201014167905?text=${encodeURIComponent(fullMsg)}`);
  };

  return (
    <div dir="rtl" style={{ padding: '10px', fontFamily: 'Arial, sans-serif', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      
      {activeTab === 'home' && (
        <>
          <header style={{ position: 'relative', width: '100%', marginBottom: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', height: '150px', backgroundImage: 'url("/cover.png")', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '0 0 20px 20px', position: 'relative', marginBottom: '45px' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0 0 20px 20px' }}></div>
            </div>
            <div style={{ position: 'absolute', top: '120px', zIndex: 2 }}>
              <img src="/mall-logo.png" alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #121212', filter: 'drop-shadow(0 0 10px #FF6600)' }} />
            </div>
            <div style={{ position: 'relative', margin: '50px 5px 15px 5px', width: '95%', zIndex: 1 }}>
              <input 
                type="text" placeholder="ابحث عن محل أو منتج..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '25px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff', outline: 'none' }}
              />
            </div>
          </header>

          <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', marginBottom: '20px', paddingBottom: '5px' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSearchQuery(cat === 'الكل' ? '' : cat)} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', backgroundColor: searchQuery === cat ? '#FF6600' : '#252525', color: 'white', whiteSpace: 'nowrap' }}>{cat}</button>
            ))}
          </div>

          {shops.map(shop => (
            <div key={shop.id} style={{ backgroundColor: '#1e1e1e', borderRadius: '15px', padding: '15px', marginBottom: '15px', borderRight: '4px solid #FF6600' }}>
              <h3 style={{ color: '#FF6600', marginBottom: '10px' }}>{shop.name}</h3>
              {shop.items.map(item => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span>{item.name} <small style={{ color: '#FF6600' }}>{item.price} ج.م</small></span>
                  <button onClick={() => addToCart(item, shop.name)} style={{ backgroundColor: '#FF6600', border: 'none', color: 'white', borderRadius: '8px', width: '30px', height: '30px' }}>+</button>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <button onClick={() => setIsCartOpen(false)} style={{ color: '#FF6600', background: 'none', border: 'none', fontSize: '20px' }}>✕ إغلاق</button>
          <h2 style={{ textAlign: 'center', color: '#FF6600' }}>سلة المشتريات</h2>
          <input placeholder="الاسم" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
          <input placeholder="العنوان" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
          
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  const link = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
                  setNotes(prev => prev + "\n📍 الموقع: " + link);
                  alert("تم تحديد موقعك ✅");
                }, () => alert("برجاء تفعيل GPS"));
              }
            }}
            style={{ width: '100%', padding: '12px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '8px', marginBottom: '10px', fontWeight: 'bold' }}
          >
            📍 تحديد موقعي الحالي
          </button>

          <button onClick={sendOrder} style={{ width: '100%', padding: '15px', backgroundColor: '#FF6600', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold' }}>
            إتمام الطلب (واتساب)
          </button>
        </div>
      )}

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1e1e1e', display: 'flex', justifyContent: 'space-around', padding: '10px', borderTop: '1px solid #333' }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#FF6600' : '#fff' }}>🏠 الرئيسية</button>
        <button onClick={() => setIsCartOpen(true)} style={{ background: 'none', border: 'none', color: '#fff' }}>🛒 السلة ({cart.length})</button>
      </nav>
    </div>
  );
}
