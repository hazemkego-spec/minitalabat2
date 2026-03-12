"use client";
import React from "react";

export default function ShopDetails({ selectedShop, activeSubTab, setActiveSubTab, addToCart, setSelectedShop }) {
  return (
    <div style={{ padding: '0 5px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setSelectedShop(null)} style={{ backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px' }}>→</button>
        <small style={{ color: '#888' }}>{selectedShop.menuCategories ? "اختر من الأقسام بالأسفل" : "قائمة المنتجات"}</small>
      </div>

      {selectedShop.menuCategories && (
        <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '15px', marginBottom: '15px', scrollbarWidth: 'none' }}>
          {selectedShop.menuCategories.map((cat, i) => (
            <button key={i} onClick={() => setActiveSubTab(cat.title)} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', backgroundColor: (activeSubTab === cat.title || (!activeSubTab && i === 0)) ? '#FF6600' : '#1e1e1e', color: '#fff', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 'bold' }}>
              {cat.title}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gap: '10px' }}>
        {(selectedShop.menuCategories ? (selectedShop.menuCategories.find(c => c.title === activeSubTab) || selectedShop.menuCategories[0]).items : selectedShop.items).map(item => (
          <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '15px', border: '1px solid #222' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold' }}>{item.name}</span>
              <span style={{ color: '#FF6600', fontSize: '14px', marginTop: '4px' }}>{item.price} ج.م</span>
            </div>
            {selectedShop.isOpen && (
              <button onClick={() => addToCart(selectedShop.name, item)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '10px', width: '40px', height: '40px', fontSize: '20px', fontWeight: 'bold' }}>+</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
