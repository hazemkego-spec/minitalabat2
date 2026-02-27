"use client";
import React, { useState } from 'react';

export default function Home() {
  const [cart, setCart] = useState([]);

  const shops = [
    { id: 1, name: "مطعم السعادة", items: ["بيتزا", "كريب", "شاورما"], phone: "201000000000" },
    { id: 2, name: "خضروات الطازج", items: ["طماطم", "خيار", "بطاطس"], phone: "201000000000" },
    { id: 3, name: "صيدلية الشفاء", items: ["مسكن", "فيتامينات"], phone: "201000000000" }
  ];

  const addToCart = (shop, item) => {
    setCart([...cart, { shop, item }]);
    alert("تم الإضافة للسلة!");
  };

  const sendWhatsApp = (shopName, phone) => {
    const orders = cart.filter(o => o.shop === shopName).map(o => o.item).join(", ");
    if (!orders) return alert("السلة فارغة!");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent("طلب جديد: " + orders)}`);
  };

  return (
    <div style={{ direction: 'rtl', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#25D366' }}>تطبيق طلباتي</h1>
      {shops.map(s => (
        <div key={s.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px', marginBottom: '10px' }}>
          <h2>{s.name}</h2>
          {s.items.map(i => (
            <button key={i} onClick={() => addToCart(s.name, i)} style={{ margin: '5px', padding: '10px' }}>+ {i}</button>
          ))}
          <button onClick={() => sendWhatsApp(s.name, s.phone)} style={{ display: 'block', width: '100%', marginTop: '10px', background: '#25D366', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px' }}>
            طلب عبر واتساب ({cart.filter(o => o.shop === s.name).length})
          </button>
        </div>
      ))}
    </div>
  );
}
