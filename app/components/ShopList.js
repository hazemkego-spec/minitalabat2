"use client";
import React from "react";

export default function ShopList({ categories, activeCategory, setActiveCategory, filteredShops, setSelectedShop }) {
  return (
    <>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', marginBottom: '20px', paddingBottom: '5px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)} 
            style={{ padding: '8px 18px', borderRadius: '20px', border: 'none', backgroundColor: activeCategory === cat ? '#FF6600' : '#1e1e1e', color: '#fff', whiteSpace: 'nowrap', fontSize: '13px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '5px' }}>
        {filteredShops.map(shop => (
          <div key={shop.id} onClick={() => {setSelectedShop(shop);}} style={{ backgroundColor: '#1e1e1e', borderRadius: '15px', padding: '20px 10px', textAlign: 'center', border: '1px solid #333', cursor: 'pointer' }}>
            {typeof shop.icon === 'string' ? (
              <div style={{ fontSize: '35px', marginBottom: '10px' }}>{shop.icon}</div>
            ) : (
              <div style={{ marginBottom: '10px' }}>{shop.icon}</div>
            )}
            <h4 style={{ margin: '5px 0', fontSize: '14px' }}>{shop.name}</h4>
            <span style={{ fontSize: '10px', color: shop.isOpen ? '#4caf50' : '#f44336' }}>{shop.isOpen ? '● مفتوح الآن' : '● مغلق'}</span>
          </div>
        ))}
      </div>
    </>
  );
}
