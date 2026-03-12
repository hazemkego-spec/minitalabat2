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
    { 
      id: 1, 
      category: "مطاعم", 
      name: "جزارة ومشويات محمد صوان", 
      isOpen: true, 
      icon: <img src={SAWAN_LOGO_URL} alt="صوان" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #FF6600', objectFit: 'cover' }} />,
      menuCategories: [
        { title: "قسم المشويات 🍗", items: [{ name: "كفتة بلدي (كيلو)", price: 400 }] },
        // باقي الأصناف زي ما عندك
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
            <div style={{ textAlign: 'right', fontSize: '14px', lineHeight: '1.8',