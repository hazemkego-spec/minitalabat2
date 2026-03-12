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

  // السطر المعدل لاستخدام الصورة من داخل المشروع
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
    { 
      id: 1, 
      category: "مطاعم", 
      name: "جزارة ومشويات محمد صوان", 
      isOpen: true, 
      // تم تعديل الأيقونة هنا لتصبح اللوجو الجديد
      icon: <img src={SAWAN_LOGO_URL} alt="صوان" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #FF6600', objectFit: 'cover' }} />,
      menuCategories: [
        { 
          title: "قسم المشويات 🍗", 
          items: [
            { name: "كفتة بلدي (كيلو)", price: 400 }, { name: "كفتة بلدي (نص)", price: 200 }, { name: "كفتة بلدي (ربع)", price: 100 },
            { name: "طرب بلدي (كيلو)", price: 500 }, { name: "طرب بلدي (نص)", price: 250 }, { name: "طرب بلدي (ربع)", price: 125 },
            { name: "مشكل كفتة وكباب (كيلو)", price: 600 }, { name: "مشكل كفتة وطرب (كيلو)", price: 450 },
            { name: "برجر بلدي (كيلو)", price: 350 }, { name: "سجق بلدي (كيلو)", price: 350 },
            { name: "كباب ضاني (كيلو)", price: 800 }, { name: "ريش ضاني (كيلو)", price: 800 },
            { name: "استيك كندوز (كيلو)", price: 600 }, { name: "استيك فلتو (كيلو)", price: 650 },
            { name: "شيش طاووق (كيلو)", price: 350 }, { name: "قلب وكبدة مشوي (كيلو)", price: 600 },
            { name: "فرخة شواية كاملة", price: 300 }, { name: "فرخة شيش كاملة", price: 300 }, { name: "فرخة تكا كاملة", price: 300 },
            { name: "نص فرخة (شواية/شيش)", price: 155 }, { name: "ربع فرخة (ورك/صدر)", price: 80 }
          ] 
        },
        { 
          title: "قسم السندوتشات 🌯", 
          items: [
            { name: "سندوتش كفتة بلدي", price: 40 }, { name: "سندوتش طرب بلدي", price: 65 },
            { name: "سندوتش كباب بلدي", price: 95 }, { name: "سندوتش كبدة بلدي", price: 50 },
            { name: "سندوتش سجق بلدي", price: 45 }, { name: "سندوتش برجر بلدي", price: 50 },
            { name: "سندوتش شيش طاووق", price: 50 }, { name: "سندوتش حواوشي سادة", price: 20 },
            { name: "سندوتش حواوشي ميكس جبن", price: 35 }, { name: "سندوتش حواوشي صوان", price: 40 }
          ] 
        },
        { 
          title: "قسم الصواني 🥘", 
          items: [
            { name: "صينية محمد صوان (8 أفراد)", price: 1200 },
            { name: "صينية الوحش (6 أفراد)", price: 900 },
            { name: "صينية ليلة العمر", price: 1450 },
            { name: "صينية كيلو مشكل (كفتة/طرب/سجق)", price: 700 },
            { name: "صينية شهر الخير", price: 950 },
            { name: "صينية الصحاب", price: 650 },
            { name: "صينية المحطة", price: 1300 },
            { name: "صينية ميكس مشويات صوان", price: 1850 }
          ] 
        },
        { 
          title: "الوجبات الخاصة 🍱", 
          items: [
            { name: "وجبة محمد صوان (مشكل مشويات)", price: 100 },
            { name: "وجبة شيش طاووق (أرز+سلطات)", price: 100 },
            { name: "وجبة كفتة (ربع كفتة+أرز)", price: 110 },
            { name: "وجبة النووي (ميكس جريل)", price: 120 },
            { name: "وجبة نص فرخة (أرز+سلطات)", price: 175 }
          ] 
        },
        { 
          title: "الحمام والفتة 🕊️", 
          items: [
            { name: "جوز حمام محشي أرز", price: 300 },
            { name: "جوز حمام محشي فريك", price: 310 },
            { name: "فرد حمام محشي", price: 150 },
            { name: "فتة كوارع (طبق كبير)", price: 150 },
            { name: "فتة باللحمة البلدي", price: 180 },
            { name: "فتة عكاوي", price: 150 }
          ] 
        },
        { 
          title: "قسم الطواجن 🍲", 
          items: [
            { name: "طاجن لحمة بالبصل", price: 180 }, { name: "طاجن بطاطس باللحمة", price: 180 },
            { name: "طاجن بامية باللحمة", price: 180 }, { name: "طاجن تورلي باللحمة", price: 180 },
            { name: "طاجن لحمة بورق العنب", price: 200 }, { name: "طاجن كوارع سادة", price: 180 },
            { name: "طاجن كوارع بورق العنب", price: 200 }, { name: "طاجن عكاوي بورق العنب", price: 200 },
            { name: "طاجن عكاوي سادة", price: 180 }, { name: "طاجن مخاصي بالبصل", price: 180 },
            { name: "طاجن عصب بلدي", price: 120 }, { name: "طاجن كفتة هندي", price: 180 },
            { name: "طاجن كفتة بالطحينة", price: 180 }, { name: "طاجن شيش طاووق", price: 150 }
          ] 
        },
        { 
          title: "ركن الجريل 🔥", 
          items: [
            { name: "حواوشي بلدي سادة", price: 20 }, { name: "حواوشي بالخضار", price: 30 },
            { name: "حواوشي ميكس جبن", price: 35 }, { name: "حواوشي صوان الخاص", price: 40 },
            { name: "حواوشي بسطرمة", price: 45 }, { name: "حواوشي سجق", price: 40 },
            { name: "ورقة لحمة بلدي", price: 180 }, { name: "ورقة كبدة بلدي", price: 180 },
            { name: "ورقة سجق/شيش", price: 120 }
          ] 
        },
        { 
          title: "محاشي وممبار 🥖", 
          items: [
            { name: "كيلو ممبار بلدي", price: 300 }, { name: "نص كيلو ممبار", price: 150 }, { name: "ربع كيلو ممبار", price: 75 },
            { name: "كيلو ورق عنب", price: 200 }, { name: "نص كيلو ورق عنب", price: 100 },
            { name: "كيلو محشي مشكل", price: 180 }, { name: "نص كيلو مشكل", price: 90 }
          ] 
        },
        { 
          title: "المطبخ والسلطات 🍝", 
          items: [
            { name: "طاجن ملوخية سادة", price: 50 }, { name: "طاجن بامية سادة", price: 50 },
            { name: "شوربة لسان عصفور", price: 20 }, { name: "أرز بسمتي (طبق)", price: 35 },
            { name: "أرز بالخلطة والكبدة", price: 50 }, { name: "مكرونة بشاميل", price: 50 },
            { name: "مكرونة نجرسكو", price: 55 }, { name: "مكرونة بلونيز", price: 60 },
            { name: "سلطة خضراء/طحينة", price: 15 }, { name: "باذنجان مخلل", price: 15 }
          ] 
        }
      ]
    },
    { id: 2, category: "سوبر ماركت", name: "سوبر ماركت الخير", isOpen: true, items: [{ name: "لبن", price: 35 }, { name: "جبنة", price: 70 }], icon: "🛒" },
    { id: 3, category: "صيدليات", name: "صيدلية الشفاء", isOpen: true, items: [{ name: "بندول", price: 30 }], icon: "💊" },
    { id: 4, category: "عطارة", name: "عطارة مكة", isOpen: false, items: [{ name: "فلفل أسود", price: 20 }], icon: "🌿" },
    { id: 5, category: "منظفات", name: "عالم النظافة", isOpen: true, items: [{ name: "مسحوق غسيل", price: 45 }], icon: "🧼" },
    { id: 6, category: "خضروات وفواكه", name: "خضري العيلة", isOpen: true, items: [{ name: "طماطم 1ك", price: 15 }], icon: "🍎" }
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
    
    // دعم لجلب السعر في حال وجود أيقونة بدلاً من النص
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
      // جلب الاسم الصحيح لعرضه في السلة
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

    const grouped = getGroupedCart();
    let orderDetails = "";
    for (const shop in grouped) {
      orderDetails += `\n*🏠 متجر: ${shop}*\n`;
      grouped[shop].forEach(item => {
        const noteText = item.note ? ` _(ملاحظة: ${item.note})_` : "";
        orderDetails += `  ▫️ *${item.name}* (الكمية: ${item.quantity})${noteText} ⬅️ ${item.price * item.quantity}ج\n`;
      });
    }

    const locText = locationUrl ? `\n📍 *رابط الموقع:* ${locationUrl}` : "";
    const message = `*🧾 فاتورة رقم: #${newOrderNum}*\n------------------------------\n*🚀 طلب جديد من Mini Talabat*\n\n👤 *العميل:* ${customerInfo.name}\n📞 *الهاتف:* ${customerInfo.phone}\n📍 *العنوان:* ${customerInfo.address}${locText}\n\n*🛒 تفاصيل الطلب:*\n${orderDetails}\n------------------------------\n💰 *الإجمالي النهائي: ${calculateTotal()} ج.م*`;

    window.open(`https://wa.me/${MAIN_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        // تصحيح بسيط لرابط الخريطة ليعمل بشكل احترافي
        const url = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        setLocationUrl(url);
        alert("تم تحديد موقعك بنجاح ✅");
      }, () => alert("برجاء تفعيل الـ GPS"));
    }
  };

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
          <header style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
            {!selectedShop ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', height: '180px', backgroundImage: 'url("/cover.png")', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '0 0 25px 25px', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '0 0 25px 25px' }}></div>
                </div>
                <div style={{ marginTop: '-45px', zIndex: 5, position: 'relative' }}>
                  <img src="/mall-logo.png" alt="Mall Logo" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #121212', backgroundColor: '#1e1e1e' }} />
                </div>
                <div style={{ position: 'relative', marginTop: '15px', width: '95%' }}>
                  <input 
                    type="text" 
                    placeholder="ابحث عن متجر..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '12px 15px', borderRadius: '25px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '20px', padding: '10px', textAlign: 'center' }}>
                {/* تم تعديل عرض اللوجو داخل صفحة المطعم ليتناسب مع الصورة */}
                {typeof selectedShop.icon === 'string' ? (
                  <div style={{ fontSize: '45px', marginBottom: '10px' }}>{selectedShop.icon}</div>
                ) : (
                  <img src={SAWAN_LOGO_URL} alt="صوان" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #FF6600', objectFit: 'cover', marginBottom: '10px', boxShadow: '0 0 15px rgba(255,102,0,0.3)' }} />
                )}
                <h2 style={{ margin: 0, color: '#FF6600', fontSize: '22px', fontWeight: 'bold' }}>{selectedShop.name}</h2>
              </div>
            )}
          </header>

          {!selectedShop ? (
            <>
              <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', marginBottom: '20px', paddingBottom: '5px', scrollbarWidth: 'none' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 18px', borderRadius: '20px', border: 'none', backgroundColor: activeCategory === cat ? '#FF6600' : '#1e1e1e', color: '#fff', whiteSpace: 'nowrap', fontSize: '13px' }}>{cat}</button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '5px' }}>
                {filteredShops.map(shop => (
                  <div key={shop.id} onClick={() => {setSelectedShop(shop); setActiveSubTab("");}} style={{ backgroundColor: '#1e1e1e', borderRadius: '15px', padding: '20px 10px', textAlign: 'center', border: '1px solid #333', cursor: 'pointer' }}>
                    {/* عرض الأيقونة أو اللوجو في قائمة المحلات */}
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
          ) : (
            <div style={{ padding: '0 5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setSelectedShop(null)} style={{ backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px' }}>→</button>
                <small style={{ color: '#888' }}>{selectedShop.menuCategories ? "اختر من الأقسام بالأسفل" : "قائمة المنتجات"}</small>
              </div>

              {selectedShop.menuCategories && (
                <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '15px', marginBottom: '15px', scrollbarWidth: 'none' }}>
                  {selectedShop.menuCategories.map((cat, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveSubTab(cat.title)}
                      style={{ 
                        padding: '8px 20px', borderRadius: '20px', border: 'none', 
                        backgroundColor: (activeSubTab === cat.title || (!activeSubTab && i === 0)) ? '#FF6600' : '#1e1e1e', 
                        color: '#fff', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 'bold' 
                      }}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ display: 'grid', gap: '10px' }}>
                {(selectedShop.menuCategories ? 
                  (selectedShop.menuCategories.find(c => c.title === activeSubTab) || selectedShop.menuCategories[0]).items : 
                  selectedShop.items
                ).map(item => (
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
          )}
        </>
      )}

      {activeTab === 'cart' && (
        <div style={{ padding: '5px' }}>
          <h2 style={{ color: '#FF6600', textAlign: 'center' }}>سلة المشتريات 🛒</h2>
          {Object.keys(cart).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>السلة فارغة حالياً 🧡</p>
          ) : (
            <>
              {Object.keys(getGroupedCart()).map(shopName => (
                <div key={shopName} style={{ marginBottom: '15px', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#333', padding: '8px 15px', color: '#FF6600', fontWeight: 'bold' }}>📍 متجر: {shopName}</div>
                  {getGroupedCart()[shopName].map(item => (
                    <div key={item.key} style={{ padding: '12px', borderBottom: '1px solid #222', backgroundColor: '#1e1e1e' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.name} <small style={{color: '#888'}}>(الكمية: {item.quantity})</small></span>
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
                <button onClick={handleGetLocation} style={{ width: '100%', padding: '10px', backgroundColor: locationUrl ? '#1b5e20' : '#444', color: '#fff', border: 'none', borderRadius: '10px', marginBottom: '10px' }}>
                  {locationUrl ? "✅ تم تحديد موقعك" : "📍 تحديد موقعي تلقائياً (GPS)"}
                </button>
                <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>إجمالي الحساب: {calculateTotal()} ج.م</div>
                <button onClick={sendOrder} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '15px', fontWeight: 'bold' }}>إرسال للواتساب ✅</button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'addShop' && (
        <div style={{ padding: '20px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ color: '#FF6600' }}>خليك شريك في النجاح!</h2>
          <p>انضم لـ Mini Talabat واوصل لعملاء أكتر.</p>
          <button onClick={() => window.open(`https://wa.me/${MAIN_PHONE}?text=حابب أضيف محلي في التطبيق`)} style={{ width: '100%', padding: '15px', backgroundColor: '#FF6600', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>تواصل معنا واتساب 📲</button>
        </div>
      )}

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1e1e1e', display: 'flex', justifyContent: 'space-around', padding: '12px 0', borderTop: '2px solid #333', zIndex: 1000 }}>
        <button onClick={() => {setActiveTab('home'); setSelectedShop(null);}} style={{ background: 'none', border: 'none', color: (activeTab === 'home') ? '#FF6600' : '#888' }}>🏠 الرئيسية</button>
        <button onClick={() => setActiveTab('cart')} style={{ background: 'none', border: 'none', color: activeTab === 'cart' ? '#FF6600' : '#888' }}>🛒 السلة {Object.keys(cart).length > 0 && <span style={{ backgroundColor: '#FF6600', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' }}>{Object.keys(cart).length}</span>}</button>
        <button onClick={() => setActiveTab('addShop')} style={{ background: 'none', border: 'none', color: activeTab === 'addShop' ? '#FF6600' : '#888' }}>🏪 أضف متجرك</button>
      </nav>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#121212', color: '#fff', marginBottom: '10px', outline: 'none' };
