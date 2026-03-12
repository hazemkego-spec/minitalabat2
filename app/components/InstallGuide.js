"use client";
import React from "react";

export default function InstallGuide({ setShowInstallGuide }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#1e1e1e', borderRadius: '20px', padding: '25px', border: '2px solid #FF6600', position: 'relative', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <button onClick={() => setShowInstallGuide(false)} style={{ position: 'absolute', top: '10px', left: '10px', background: 'none', border: 'none', color: '#FF6600', fontSize: '22px', fontWeight: 'bold' }}>✕</button>
        <h3 style={{ color: '#FF6600', marginBottom: '20px' }}>ثبت تطبيق ميني طلبات!</h3>
        <div style={{ textAlign: 'right', fontSize: '14px', lineHeight: '1.8', color: '#fff' }}>
          <p><b>🍎 آيفون:</b> مشاركة 📤 ثم "إضافة للشاشة الرئيسية" ➕</p>
          <p><b>🤖 أندرويد:</b> خيارات ⁝ ثم "تثبيت التطبيق" 📲</p>
        </div>
        <button onClick={() => setShowInstallGuide(false)} style={{ width: '100%', padding: '12px', backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '20px', fontWeight: 'bold' }}>ابدأ التسوق!</button>
      </div>
    </div>
  );
}
