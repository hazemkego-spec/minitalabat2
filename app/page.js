"use client";
import React, { useState, useEffect } from 'react';

export default function MiniTalabat() {
  const [cart, setCart] = useState({});
  const [itemNotes, setItemNotes] = useState({}); // مخزن ملاحظات لكل منتج
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('الكل'); 
  const MAIN_PHONE = "201122947479"; 
  
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    const saved = localStorage.getItem('miniTalabat_user');
    if (saved) setCustomerInfo(JSON.parse(saved));
  }, []);

  const categories = ["الكل", "مطاعم", "سوبر ماركت", "صيدليات", "عطارة", "منظفات", "خضروات وفواكه"];

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
    if(!customerInfo.name || !customerInfo.phone) return alert("برجاء ملء البيانات");
    localStorage.setItem('miniTalabat_user', JSON.stringify(customerInfo));
    
    const grouped = getGroupedCart();
    let orderDetails = "";
    for (const shop in grouped) {
      orderDetails += `\n*🏠 متجر: ${shop}*\n`;
      grouped[shop].forEach(item => {
        const noteText = item.note ? ` [ملاحظة: ${item.note}]` : "";
        orderDetails += `  • ${item.name} (${item.quantity}ق)${noteText} - ${item.totalPrice}ج\n`;
      });
    }

    const message = `*طلب جديد من Mini Talabat* 🚀\n---------------------------\n*👤 العميل:* ${customerInfo.name}\n*📞 الهاتف:* ${customerInfo.phone}\n*📍 العنوان:* ${customerInfo.address}\n${orderDetails}\n*💰 الإجمالي النهائي:* ${calculateTotal()} ج.م\n---------------------------\n_تم عبر ميني طلبات_ 🧡`;
    window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const groupedCart = getGroupedCart();

  return (
    <div dir="rtl" style={{ padding: '10px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', paddingBottom: '140px' }}>
      <header style={{ textAlign: 'center', marginBottom: '10px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '45px', filter: 'drop-shadow(0 0 5px #FF6600)' }} />
        <h1 style={{ color: '#FF6600', margin: '3px', fontSize: '18px' }}>Mini Talabat</h1>
        <button onClick={() => window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent("محتاج أضيف محلي")}`)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>🧡 ضيف محلك معنا</button>
      </header>

      {/* الأقسام */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', padding: '5px 0', marginBottom: '10px', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '5px 12px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === cat ? '#FF6600' : '#1e1e1e', color: activeCategory === cat ? '#fff' : '#bbb', fontSize: '12px' }}>{cat}</button>
        ))}
      </div>

      {/* المحلات */}
      {filteredShops.map(shop => (
        <div key={shop.id} style={{ border: '1px solid #333', borderRadius: '12px', padding: '10px', marginBottom: '10px', backgroundColor: '#1e1e1e', opacity: shop.isOpen ? 1 : 0.7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <h3 style={{ borderRight: '3px solid #FF6600', paddingRight: '8px', margin: 0, fontSize: '15px' }}>{shop.name}</h3>
            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '8px', backgroundColor: shop.isOpen ? '#1b5e20' : '#b71c1c', color: '#fff' }}>
              {shop.isOpen ? '● مفتوح الآن' : '○ مغلق حالياً'}
            </span>
          </div>
          {shop.items.map(item => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
              <span style={{ fontSize: '13px' }}>{item.name} <b style={{color: '#FF6600'}}>{item.price} ج.م</b></span>
              {shop.isOpen && <button onClick={() => addToCart(shop.name, item)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '6px', width: '28px', height: '28px', fontWeight: 'bold' }}>+</button>}
            </div>
          ))}
        </div>
      ))}

      {/* السلة الرشيقة (Compact Cart) */}
      {calculateTotal() > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1e1e1e', borderTop: '2px solid #FF6600', zIndex: 2000, padding: '10px 15px', borderRadius: '15px 15px 0 0', boxShadow: '0 -5px 15px rgba(0,0,0,0.5)' }}>
          {!showOrderForm ? (
            <div>
              <div style={{ maxHeight: '120px', overflowY: 'auto', marginBottom: '8px' }}>
                {Object.keys(groupedCart).map(shopName => (
                  <div key={shopName} style={{ marginBottom: '5px', borderBottom: '1px solid #333', paddingBottom: '3px' }}>
                    <div style={{ color: '#FF6600', fontWeight: 'bold', fontSize: '11px' }}>📍 {shopName}</div>
                    {groupedCart[shopName].map(item => (
                      <div key={item.key} style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px' }}>{item.name} ({item.totalPrice}ج)</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '10px', color: '#aaa' }}>{item.quantity}ق</span>
                            <button onClick={() => removeFromCart(item.key)} style={{ color: '#ff4444', border: '1px solid #ff4444', background: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display:'flex', alignItems:'center', justifyContent:'center' }}>-</button>
                          </div>
                        </div>
                        {/* ملاحظة المنتج الصغير */}
                        <input 
                          placeholder="ملاحظة لهذا المنتج..." 
                          value={item.note}
                          onChange={(e) => updateItemNote(item.key, e.target.value)}
                          style={{ width: '100%', backgroundColor: '#121212', color: '#888', border: 'none', borderBottom: '1px solid #333', fontSize: '10px', padding: '2px 0', outline: 'none', marginTop: '2px' }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <button onClick={() => setShowOrderForm(true)} style={{ width: '100%', padding: '10px', backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px' }}>
                تأكيد الطلب ({calculateTotal()} ج.م)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <input placeholder="الاسم" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle} />
              <input placeholder="الموبايل" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} />
              <input placeholder="العنوان" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} />
              <button onClick={sendOrder} style={{ width: '100%', padding: '12px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>إرسال للواتساب ✅</button>
              <button onClick={() => setShowOrderForm(false)} style={{ color: '#aaa', background: 'none', border: 'none', fontSize: '11px' }}>رجوع للسلة</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#121212', color: '#fff', fontSize: '13px' };
