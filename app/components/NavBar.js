"use client";
import React from "react";

export default function NavBar({ activeTab, setActiveTab, cart, setSelectedShop }) {
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1e1e1e', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '2px solid #333', zIndex: 1000 }}>
      <button onClick={() => {setActiveTab('home'); setSelectedShop(null);}} style={{ background: 'none', border: 'none', color: (activeTab === 'home') ? '#FF6600' : '#888' }}>🏠 الرئيسية</button>
      <button onClick={() => setActiveTab('cart')} style={{ background: 'none', border: 'none', color: activeTab === 'cart' ? '#FF6600' : '#888' }}>
        🛒 السلة {Object.keys(cart).length > 0 && <span style={{ backgroundColor: '#FF6600', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' }}>{Object.keys(cart).length}</span>}
      </button>
      <button onClick={() => setActiveTab('addShop')} style={{ background: 'none', border: 'none', color: activeTab === 'addShop' ? '#FF6600' : '#888' }}>🏪 أضف متجرك</button>
    </nav>
  );
}
