"use client";
import React, { useState, useEffect } from 'react';

export default function MiniTalabat() {
  const [cart, setCart] = useState({});
  const [itemNotes, setItemNotes] = useState({}); 
  const [activeCategory, setActiveCategory] = useState('الكل'); 
  const [activeTab, setActiveTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [locationUrl, setLocationUrl] = useState(''); 
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [orderCount, setOrderCount] = useState(0); 
  const [selectedShop, setSelectedShop] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(""); 

  const MAIN_PHONE = "201122947479"; 
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  const SAWAN_LOGO_URL = "/sawan-logo.png";

  useEffect(() => {
    const saved = localStorage.getItem('miniTalabat_user');
    if (saved) setCustomerInfo(JSON.parse(saved));
    const savedCount = localStorage.getItem('miniTalabat_orderCount');
    if (savedCount) setOrderCount(parseInt(savedCount));

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || window.navigator.standalone 
                         || document.referrer.includes('android-app://');

    if (!isStandalone) {
      const timer = setTimeout(() => setShowInstallGuide(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const categories = ["الكل", "مطاعم", "سوبر ماركت", "صيدليات", "عطارة", "منظفات", "خضروات وفواكه"];

  const shops = [
    { id: 1, category: "مطاعم", name: "جزارة ومشويات محمد صوان", isOpen: true,
      icon: <img src={SAWAN_LOGO_URL} alt="صوان" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #FF6600', objectFit: 'cover' }} />,
      menuCategories: [
        { title: "قسم المشويات 🍗", items: [{ name: "كفتة بلدي (كيلو)", price: 400 }] }
      ]
    },
    { id: 2, category: "سوبر ماركت", name: "سوبر ماركت الخير", isOpen: true, items: [{ name: "لبن", price: 35 }, { name: "جبنة", price: 70 }], icon: "🛒" },
    { id: 3, category: "صيدليات", name: "صيدلية الشفاء", isOpen: true, items: [{ name: "بندول", price: 30 }], icon: "💊" }
  ];

  const filteredShops = shops.filter(shop => {
    const matchesCategory = activeCategory === 'الكل' || shop.category === activeCategory;
    const matchesSearch = shop.name.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const addToCart = (shopName, item) => {
    const newCart = { ...cart };
    const key = `${shopName}-${item.name}`;
    newCart[key] = (newCart[key] || 0) + 1;
    setCart(newCart);
  };

  const removeFromCart = (key) => {
    const newCart = { ...cart };
    if (newCart[key] > 1) {
      newCart[key] -= 1;
    } else {
      delete newCart[key];
      const newNotes = { ...itemNotes };
      delete newNotes[key];
      setItemNotes(newNotes);
    }
    setCart(newCart);
  };

  const updateItemNote = (key, note) => {
    setItemNotes({ ...itemNotes, [key]: note });
  };

  const getItemPrice = (key) => {
    const [shopName, itemName] = key.split('-');
    const shop = shops.find(s => s.name === shopName);
    if (!shop) return 0;
    const currentItemName = (typeof itemName === 'string') ? itemName : itemName?.props?.alt;
    if (shop.menuCategories) {
      let foundPrice = 0;
      shop.menuCategories.forEach(cat => {
        const item = cat.items.find(i => i.name === currentItemName);
        if (item) foundPrice = item.price;
      });
      return foundPrice;
    }
    const item = shop.items?.find(i => i.name === currentItemName);
    return item ? item.price : 0;
  };

  const calculateTotal = () => {
    let total = 0;
    Object.keys(cart).forEach(key => {
      total += getItemPrice(key) * cart[key];
    });
    return total;
  };

  const getGroupedCart = () => {
    const grouped = {};
    Object.keys(cart).forEach(key => {
      const [shopName, itemName] = key.split('-');
      if (!grouped[shopName]) grouped[shopName] = [];
      const displayName = (typeof itemName === 'string') ? itemName : itemName?.props?.alt;
      grouped[shopName].push({
        key, name: displayName, quantity: cart[key], price: getItemPrice(key), note: itemNotes[key] || ""
      });
    });
    return grouped;
  };

  const sendOrder = () => {
    if(!customerInfo.name || !customerInfo.phone || !customerInfo.address) return alert("برجاء ملء بيانات التوصيل");
    const newOrderNum = orderCount + 1;
    setOrderCount(newOrderNum);
    localStorage.setItem('miniTalabat_orderCount', newOrderNum.toString());
    localStorage.setItem('miniTalabat_user', JSON.stringify(customerInfo));
    const message = `🧾 فاتورة رقم: #${newOrderNum}\nالإجمالي: ${calculateTotal()} ج.م`;
    window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const url = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        setLocationUrl(url);
        alert("تم تحديد موقعك بنجاح ✅");
      }, () => alert("برجاء تفعيل الـ GPS"));
    }
  };

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#121212', color: '#fff', marginBottom: '10px', outline: 'none' };

  return (
    <div dir="rtl" style={{ padding: '10px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', paddingBottom: '110px' }}>
      
      {showInstallGuide && (
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
      )}
{activeTab === 'home' && (
        <>
          {!selectedShop ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                <input 
                  type="text" 
                  placeholder="ابحث عن متجر..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '25px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', marginBottom: '20px' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 18px', borderRadius: '20px', border: 'none', backgroundColor: activeCategory === cat ? '#FF6600' : '#1e1e1e', color: '#fff' }}>{cat}</button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {filteredShops.map(shop => (
                  <div key={shop.id} onClick={() => {setSelectedShop(shop); setActiveSubTab("");}} style={{ backgroundColor: '#1e1e1e', borderRadius: '15px', padding: '20px 10px', textAlign: 'center', border: '1px solid #333', cursor: 'pointer' }}>
                    {typeof shop.icon === 'string' ? <div style={{ fontSize: '35px' }}>{shop.icon}</div> : shop.icon}
                    <h4>{shop.name}</h4>
                    <span style={{ fontSize: '10px', color: shop.isOpen ? '#4caf50' : '#f44336' }}>{shop.isOpen ? '● مفتوح الآن' : '● مغلق'}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: '10px' }}>
              <button onClick={() => setSelectedShop(null)} style={{ backgroundColor: '#333', color: '#fff', borderRadius: '50%', width: '40px', height: '40px' }}>←</button>
              <h2 style={{ color: '#FF6600' }}>{selectedShop.name}</h2>
              {(selectedShop.items || []).map(item => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
                  <span>{item.name} - {item.price} ج.م</span>
                  <button onClick={() => addToCart(selectedShop.name, item)} style={{ backgroundColor: '#FF6600', color: '#fff', borderRadius: '5px' }}>+</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'cart' && (
        <div style={{ padding: '10px' }}>
          <h2 style={{ color: '#FF6600' }}>سلة المشتريات 🛒</h2>
          {Object.keys(cart).length === 0 ? (
            <p>السلة فارغة حالياً 🧡</p>
          ) : (
            <>
              {Object.keys(getGroupedCart()).map(shopName => (
                <div key={shopName}>
                  <h3 style={{ color: '#FF6600' }}>📍 متجر: {shopName}</h3>
                  {getGroupedCart()[shopName].map(item => (
                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>{item.name} (x{item.quantity})</span>
                      <span>{item.price * item.quantity} ج</span>
                      <button onClick={() => removeFromCart(item.key)}>-</button>
                    </div>
                  ))}
                </div>
              ))}
              <input placeholder="الاسم" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle} />
              <input placeholder="الموبايل" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} />
              <input placeholder="العنوان" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} />
              <button onClick={handleGetLocation}>{locationUrl ? "✅ تم تحديد موقعك" : "📍 تحديد موقعي"}</button>
              <h3>الإجمالي: {calculateTotal()} ج.م</h3>
              <button onClick={sendOrder} style={{ backgroundColor: '#25D366', color: '#fff', padding: '10px', borderRadius: '10px' }}>إرسال للواتساب ✅</button>
            </>
          )}
        </div>
      )}

      {activeTab === 'addShop' && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2 style={{ color: '#FF6600' }}>خليك شريك في النجاح!</h2>
          <p>انضم لـ Mini Talabat واوصل لعملاء أكتر.</p>
          <button onClick={() => window.open(`https://wa.me/${MAIN_PHONE}?text=حابب أضيف محلي في التطبيق`)} style={{ backgroundColor: '#FF6600', color: '#fff', padding: '10px', borderRadius: '10px' }}>تواصل معنا واتساب 📲</button>
        </div>
      )}

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1e1e1e', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '2px solid #333' }}>
        <button onClick={() => {setActiveTab('home'); setSelectedShop(null);}} style={{ color: activeTab === 'home' ? '#FF6600' : '#888' }}>🏠 الرئيسية</button>
        <button onClick={() => setActiveTab('cart')} style={{ color: activeTab === 'cart' ? '#FF6600' : '#888' }}>🛒 السلة</button>
        <button onClick={() => setActiveTab('addShop')} style={{ color: activeTab === 'addShop' ? '#FF6600' : '#888' }}>🏪 أضف متجرك</button>
      </nav>
    </div>
  );
}