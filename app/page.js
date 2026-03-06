"use client";
import React, { useState, useEffect } from 'react';

export default function MiniTalabat() {
  const [cart, setCart] = useState({});
  const [itemNotes, setItemNotes] = useState({}); 
  const [activeCategory, setActiveCategory] = useState('الكل'); 
  const [activeTab, setActiveTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
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
    { id: 4, category: "عطارة", name: "عطارة مكة", isOpen: false, items: [{ name: "فلفل أسود", price: 20 }] },
    { id: 5, category: "منظفات", name: "عالم النظافة", isOpen: true, items: [{ name: "مسحوق غسيل", price: 45 }] },
    { id: 6, category: "خضروات وفواكه", name: "خضري العيلة", isOpen: true, items: [{ name: "طماطم 1ك", price: 15 }] }
  ];

  const filteredShops = shops.filter(shop => {
    const matchesCategory = activeCategory === 'الكل' || shop.category === activeCategory;
    const matchesSearch = shop.name.includes(searchQuery) || 
                         shop.items.some(item => item.name.includes(searchQuery));
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
        key, name: itemName, quantity: cart[key], price: getItemPrice(key), note: itemNotes[key] || ""
      });
    });
    return grouped;
  };

  const sendOrder = () => {
    if(!customerInfo.name || !customerInfo.phone || !customerInfo.address) return alert("برجاء ملء بيانات التوصيل");
    localStorage.setItem('miniTalabat_user', JSON.stringify(customerInfo));
    const grouped = getGroupedCart();
    let orderDetails = "";
    for (const shop in grouped) {
      orderDetails += `\n*🏠 متجر: ${shop}*\n`;
      grouped[shop].forEach(item => {
        const noteText = item.note ? ` [ملاحظة: ${item.note}]` : "";
        orderDetails += `  • ${item.name} (${item.quantity}ق)${noteText} - ${item.price * item.quantity}ج\n`;
      });
    }
    const message = `*طلب جديد من Mini Talabat* 🚀\n👤 *العميل:* ${customerInfo.name}\n📞 *الهاتف:* ${customerInfo.phone}\n📍 *العنوان:* ${customerInfo.address}\n${orderDetails}\n💰 *الإجمالي النهائي:* ${calculateTotal()} ج.م`;
    window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div dir="rtl" style={{ padding: '10px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', paddingBottom: '110px' }}>
      
      {activeTab === 'home' && (
        <>
          {/* بداية قسم الهيدر المطور بصورة الكفر */}
          <header style={{ 
            position: 'relative', 
            width: '100%', 
            marginBottom: '20px', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* صورة الكفر الخلفية */}
            <div style={{ 
              width: '100%', 
              height: '150px', 
              backgroundImage: 'url("/cover.png")', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              borderRadius: '0 0 20px 20px',
              position: 'relative',
              marginBottom: '45px' 
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0 0 20px 20px' }}></div>
            </div>

            {/* اللوجو والبيانات */}
            <div style={{ 
              position: 'absolute', 
              top: '120px', 
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <img src="/mall-logo.png" alt="Logo" style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                border: '4px solid #121212',
                filter: 'drop-shadow(0 0 10px #FF6600)' 
              }} />
          
            </div>

            {/* خانة البحث */}
            <div style={{ position: 'relative', margin: '30px 5px 15px 5px', width: '95%', zIndex: 1 }}>
              <input 
                type="text" 
                placeholder="ابحث عن محل أو منتج..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '25px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff', outline: 'none', fontSize: '14px' }}
              />
              <span style={{ position: 'absolute', left: '15px', top: '10px' }}>🔍</span>
            </div>
          </header>
          {/* نهاية قسم الهيدر */}


          <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', marginBottom: '15px', paddingBottom: '5px', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 18px', borderRadius: '20px', border: activeCategory === cat ? 'none' : '1px solid #333', backgroundColor: activeCategory === cat ? '#FF6600' : '#1e1e1e', color: '#fff', whiteSpace: 'nowrap', fontSize: '13px' }}>{cat}</button>
            ))}
          </div>

          {filteredShops.map(shop => (
            <div key={shop.id} style={{ border: '1px solid #333', borderRadius: '15px', padding: '15px', marginBottom: '15px', backgroundColor: '#1e1e1e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#FF6600', borderRight: '3px solid #FF6600', paddingRight: '8px' }}>{shop.name}</h3>
                <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '10px', backgroundColor: shop.isOpen ? '#1b5e20' : '#b71c1c', color: '#fff' }}>{shop.isOpen ? 'مفتوح' : 'مغلق'}</span>
              </div>
              {shop.items.map(item => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0' }}>
                  <span>{item.name} <b style={{color: '#FF6600'}}>{item.price} ج.م</b></span>
                  {shop.isOpen && <button onClick={() => addToCart(shop.name, item)} style={{ backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '8px', width: '38px', height: '38px', fontWeight: 'bold' }}>+</button>}
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {activeTab === 'cart' && (
        <div style={{ padding: '5px' }}>
          <h2 style={{ color: '#FF6600', textAlign: 'center' }}>سلة المشتريات 🛒</h2>
          {Object.keys(cart).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>السلة فارغة حالياً.. املأها بالخير! 🧡</p>
          ) : (
            <>
              {Object.keys(getGroupedCart()).map(shopName => (
                <div key={shopName} style={{ marginBottom: '20px', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#333', padding: '8px 15px', color: '#FF6600', fontWeight: 'bold' }}>📍 متجر: {shopName}</div>
                  {getGroupedCart()[shopName].map(item => (
                    <div key={item.key} style={{ padding: '12px', borderBottom: '1px solid #222', backgroundColor: '#1e1e1e' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.name} <small style={{color: '#888'}}>({item.quantity}ق)</small></span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <b style={{color: '#FF6600'}}>{item.price * item.quantity}ج</b>
                          <button onClick={() => removeFromCart(item.key)} style={{ color: '#ff4444', background: 'none', border: '1px solid #ff4444', borderRadius: '50%', width: '22px', height: '22px' }}>-</button>
                        </div>
                      </div>
                      <input placeholder="أضف ملاحظة..." value={item.note} onChange={(e) => updateItemNote(item.key, e.target.value)} style={{ width: '100%', backgroundColor: 'transparent', color: '#aaa', border: 'none', borderBottom: '1px solid #444', fontSize: '12px', marginTop: '8px', outline: 'none' }} />
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '15px', border: '1px solid #FF6600' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#FF6600' }}>🛵 بيانات التوصيل:</h4>
                <input placeholder="الاسم" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={inputStyle} />
                <input placeholder="الموبايل" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} />
                <input placeholder="العنوان بالتفصيل" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} />
           {/* قسم الموقع الذكي - بشكل مصغر واحترافي */}
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                placeholder="رابط الموقع (GPS)" 
                value={notes.includes('📍') ? notes.split('📍')[1] : ''} 
                readOnly
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333',
                  backgroundColor: '#000', color: '#25D366', fontSize: '12px', outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const url = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
                      setNotes(prev => prev + `\n📍 الموقع: ${url}`);
                      alert("تم حفظ موقعك بنجاح ✅");
                    }, () => alert("برجاء تفعيل الـ GPS"));
                  }
                }}
                style={{
                  position: 'absolute', left: '5px', padding: '5px 10px',
                  backgroundColor: '#25D366', color: '#fff', border: 'none',
                  borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                تحديد
              </button>
            </div>
          </div>

                <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>إجمالي الحساب: {calculateTotal()} ج.م</div>
                <button onClick={sendOrder} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '15px', fontWeight: 'bold' }}>إرسال للواتساب ✅</button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'addShop' && (
        <div style={{ padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <img 
            src="/mall-logo.png" 
            alt="Watermark" 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: '320px', 
              height: '320px',
              borderRadius: '50%', 
              opacity: '0.1', 
              pointerEvents: 'none',
              zIndex: 0 
            }} 
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '60px', marginBottom: '10px' }}>🚀</div>
            <h2 style={{ color: '#FF6600' }}>خليك شريك في النجاح!</h2>
            <p style={{ lineHeight: '1.6', color: '#eee', marginBottom: '30px', fontWeight: '500' }}>
              عندك محل؟ مطعم؟ أو بتقدم أي خدمة؟ <br/>
              انضم لـ **Mini Talabat** واوصل لآلاف العملاء في منطقتك بكل سهولة. <br/>
              المستقبل رقمي.. ومكانك محجوز معانا!
            </p>
            <div style={{ backgroundColor: 'rgba(30, 30, 30, 0.85)', padding: '25px', borderRadius: '20px', border: '2px dashed #FF6600', backdropFilter: 'blur(5px)' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#fff' }}>ابدأ رحلتك الآن</h3>
              <button 
                onClick={() => window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent("أهلاً، حابب أعرف تفاصيل إزاي أضيف محلي في ميني طلبات")}`)} 
                style={{ width: '100%', padding: '15px', backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px' }}
              >
                تواصل معنا واتساب 📲
              </button>
              <p style={{ fontSize: '12px', marginTop: '12px', color: '#aaa' }}>سيتم الرد عليك في أسرع وقت ممكن</p>
            </div>
          </div>
        </div>
      )}

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1e1e1e', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '2px solid #333', zIndex: 1000 }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#FF6600' : '#888' }}>
          <div style={{ fontSize: '22px' }}>🏠</div>
          <div style={{ fontSize: '11px' }}>الرئيسية</div>
        </button>
        <button onClick={() => setActiveTab('cart')} style={{ background: 'none', border: 'none', color: activeTab === 'cart' ? '#FF6600' : '#888', position: 'relative' }}>
          <div style={{ fontSize: '22px' }}>🛒</div>
          <div style={{ fontSize: '11px' }}>السلة</div>
          {Object.keys(cart).length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '10px', backgroundColor: '#FF6600', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>{Object.keys(cart).length}</span>}
        </button>
        <button onClick={() => setActiveTab('addShop')} style={{ background: 'none', border: 'none', color: activeTab === 'addShop' ? '#FF6600' : '#888' }}>
          <div style={{ fontSize: '22px' }}>🏪</div>
          <div style={{ fontSize: '11px' }}>أضف متجرك</div>
        </button>
      </nav>
    </div>
  );
}
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#121212', color: '#fff', marginBottom: '10px', outline: 'none' };
