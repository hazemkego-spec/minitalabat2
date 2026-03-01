"use client";
import React, { useState, useEffect } from 'react';

export default function MiniTalabat() {
  const [cart, setCart] = useState({});
  const [itemNotes, setItemNotes] = useState({}); 
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('الكل'); 
  
  // بيانات الربط الأساسية
  const MAIN_PHONE = "201122947479"; 
  const APP_URL = "https://minitalabat2.vercel.app";

  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    const saved = localStorage.getItem('miniTalabat_user');
    if (saved) setCustomerInfo(JSON.parse(saved));
  }, []);

  const categories = ["الكل", "مطاعم", "سوبر ماركت", "صيدليات", "عطارة", "منظفات", "خضروات وفواكه"];

  // قائمة المحلات (تعدل من هنا true للفتح و false للغلق)
  const shops = [
    { id: 1, category: "مطاعم", name: "مطعم السعادة", isOpen: true, items: [{ name: "بيتزا", price: 120 }, { name: "كريب", price: 80 }] },
    { id: 2, category: "سوبر ماركت", name: "سوبر ماركت الخير", isOpen: true, items: [{ name: "لبن", price: 35 }, { name: "جبنة", price: 70 }] },
    { id: 3, category: "صيدليات", name: "صيدلية الشفاء", isOpen: true, items: [{ name: "بندول", price: 30 }] },
    { id: 4, category: "عطارة", name: "عطارة مكة", isOpen: true, items: [{ name: "فلفل أسود", price: 20 }] },
    { id: 5, category: "منظفات", name: "عالم النظافة", isOpen: true, items: [{ name: "مسحوق غسيل", price: 45 }] },
    { id: 6, category: "خضروات وفواكه", name: "خضري العيلة", isOpen: true, items: [{ name: "طماطم 1ك", price: 15 }] }
  ];

  const filteredShops = activeCategory === 'الكل' ? shops : shops.filter(shop => shop.category === activeCategory);

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
    const item = shop?.items.find(i => i.name === itemName);
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
      grouped[shopName].push({
        key,
        name: itemName,
        quantity: cart[key],
        totalPrice: getItemPrice(key) * cart[key],
        note: itemNotes[key] || ""
      });
    });
    return grouped;
  };

  const sendOrder = () => {
    if(!customerInfo.name || !customerInfo.phone || !customerInfo.address) return alert("برجاء إكمال البيانات");
    localStorage.setItem('miniTalabat_user', JSON.stringify(customerInfo));
    
    const grouped = getGroupedCart();
    let orderDetails = "";
    for (const shop in grouped) {
      orderDetails += `\n*🏠 متجر: ${shop}*\n`;
      grouped[shop].forEach(item => {
        const noteText = item.note ? ` _(ملاحظة: ${item.note})_` : "";
        orderDetails += `  • ${item.name} [${item.quantity}ق]${noteText} = ${item.totalPrice}ج\n`;
      });
    }

    const message = `*طلب جديد - Mini Talabat* 🚀\n---------------------------\n*👤 العميل:* ${customerInfo.name}\n*📞 الهاتف:* ${customerInfo.phone}\n*📍 العنوان:* ${customerInfo.address}\n${orderDetails}\n*💰 الإجمالي النهائي:* ${calculateTotal()} ج.م\n---------------------------\n_تم الطلب عبر: ${APP_URL}_`;
    window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const groupedCart = getGroupedCart();

  return (
    <div dir="rtl" style={{ padding: '10px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', paddingBottom: '150px' }}>
      
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ color: '#FF6600', margin: '5px', fontSize: '22px', fontWeight: 'bold' }}>Mini Talabat</h1>
        <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px 0' }}>أسرع ديلفري في منطقتك 🛵</p>
        <button onClick={() => window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent("أريد إضافة متجري للمنصة")}`)} style={{ backgroundColor: '#1e1e1e', color: '#FF6600', border: '1px solid #FF6600', padding: '5px 15px', borderRadius: '20px', fontSize: '12px' }}>🧡 ضيف محلك معنا</button>
      </header>

      {/* Categories Horizontal Scroll */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', padding: '10px 0', marginBottom: '10px', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '6px 16px', borderRadius: '15px', border: 'none', backgroundColor: activeCategory === cat ? '#FF6600' : '#1e1e1e', color: activeCategory === cat ? '#fff' : '#bbb', fontSize: '13px', cursor: 'pointer', transition: '0.3s' }}>{cat}</button>
        ))}
      </div>

      {/* Shops List */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {filteredShops.map(shop => (
          <div key={shop.id} style={{ border: '1px solid #222', borderRadius: '15px', padding: '12px', backgroundColor: '#1e1e1e', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', opacity: shop.isOpen ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ borderRight: '4px solid #FF6600', paddingRight: '10px', margin: 0, fontSize: '16px', color: '#fff' }}>{shop.name}</h3>
              <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '10px', backgroundColor: shop.isOpen ? '#1b5e20' : '#b71c1c', color: '#fff' }}>
                {shop.isOpen ? '● مفتوح' : '○ مغلق'}
              </span>
            </div>
            {shop.items.map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0', borderBottom: '1px solid #2a2a2a', paddingBottom: '8px' }}>
                <span style={{ fontSize: '14px' }}>{item.name} <b style={{color: '#FF6600', marginRight: '5px'}}>{item.price} ج.م</b></span>
                {shop.isOpen && (
                  <button onClick={() => addToCart(shop.name, item)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '8px', width: '32px', height: '32px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>+</button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Compact Smart Cart Overlay */}
      {calculateTotal() > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1e1e1e', borderTop: '2px solid #FF6600', zIndex: 2000, padding: '12px 20px', borderRadius: '25px 25px 0 0', boxShadow: '0 -10px 25px rgba(0,0,0,0.6)' }}>
          {!showOrderForm ? (
            <div>
              <div style={{ maxHeight: '110px', overflowY: 'auto', marginBottom: '10px' }}>
                {Object.keys(groupedCart).map(shopName => (
                  <div key={shopName} style={{ marginBottom: '8px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                    <div style={{ color: '#FF6600', fontWeight: 'bold', fontSize: '12px', marginBottom: '3px' }}>📍 {shopName}</div>
                    {groupedCart[shopName].map(item => (
                      <div key={item.key} style={{ marginBottom: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px' }}>{item.name} ({item.totalPrice}ج)</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: '#aaa' }}>{item.quantity}ق</span>
                            <button onClick={() => removeFromCart(item.key)} style={{ color: '#ff4444', border: '1px solid #ff4444', background: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer' }}>-</button>
                          </div>
                        </div>
                        <input 
                          placeholder="أضف ملاحظة لهذا الصنف..." 
                          value={item.note}
                          onChange={(e) => updateItemNote(item.key, e.target.value)}
                          style={{ width: '100%', backgroundColor: '#121212', color: '#999', border: 'none', borderBottom: '1px solid #333', fontSize: '10px', padding: '4px 0', outline: 'none', marginTop: '3px' }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <button onClick={() => setShowOrderForm(true)} style={{ width: '100%', padding: '14px', backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 10px rgba(255, 102, 0, 0.3)' }}>
                تأكيد الطلب ({calculateTotal()} ج.م)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input placeholder="الاسم بالكامل" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle} />
              <input placeholder="رقم الموبايل" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} />
              <input placeholder="العنوان بالتفصيل" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} />
              <button onClick={sendOrder} style={{ width: '100%', padding: '14px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px' }}>إرسال الطلب للواتساب ✅</button>
              <button onClick={() => setShowOrderForm(false)} style={{ color: '#888', background: 'none', border: 'none', fontSize: '12px', marginTop: '5px' }}>العودة لتعديل السلة</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = { 
  width: '100%', 
  padding: '12px', 
  borderRadius: '10px', 
  border: '1px solid #444', 
  backgroundColor: '#121212', 
  color: '#fff', 
  fontSize: '14px',
  outline: 'none'
};
