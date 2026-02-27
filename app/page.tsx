'use client';
import React, { useState } from 'react';

export default function Home() {
  const [cart, setCart] = useState([]);

  const shops = [
    {
      id: 1,
      name: 'مطعم السعادة',
      items: ['بيتزا', 'كريب', 'شاورما'],
      phone: '201000000000',
    },
    {
      id: 2,
      name: 'خضروات الطازج',
      items: ['طماطم', 'خيار', 'بطاطس'],
      phone: '201000000000',
    },
  ];

  const addToCart = (shopName, item) => {
    setCart([...cart, { shopName, item }]);
    alert(`تم إضافة ${item} للسلة!`);
  };

  const sendWhatsApp = (shop) => {
    const shopOrders = cart.filter((order) => order.shopName === shop.name);
    if (shopOrders.length === 0) return alert('السلة فاضية!');

    const itemsText = shopOrders.map((o) => o.item).join(', ');
    const message = `أهلاً ${shop.name}، أريد طلب: ${itemsText}`;
    window.open(
      `https://wa.me/${shop.phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div
      style={{
        direction: 'rtl',
        padding: '20px',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#25D366' }}>
        طلبات الموبايل السريعة
      </h1>

      {shops.map((shop) => (
        <div
          key={shop.id}
          style={{
            background: 'white',
            padding: '15px',
            borderRadius: '15px',
            marginBottom: '15px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{shop.name}</h2>
          <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
            {shop.items.map((item) => (
              <button
                key={item}
                onClick={() => addToCart(shop.name, item)}
                style={{
                  backgroundColor: '#e7f3ff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                }}
              >
                + {item}
              </button>
            ))}
          </div>
          <button
            onClick={() => sendWhatsApp(shop)}
            style={{
              width: '100%',
              backgroundColor: '#25D366',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '10px',
              fontWeight: 'bold',
            }}
          >
            إرسال الطلب عبر واتساب (
            {cart.filter((o) => o.shopName === shop.name).length})
          </button>
        </div>
      ))}
    </div>
  );
}
