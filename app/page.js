"use client";
import { db } from "../lib/firebase"; 
import { ref, push, set, serverTimestamp } from "firebase/database"; 
import React, { useState, useEffect, useMemo, useRef } from "react"; // أضفنا useRef للتحكم في الحركة
import NavBar from "./components/NavBar";
import Cart from "./components/Cart";
import InstallGuide from "./components/InstallGuide";
import shops from "./components/ShopList"; 
import ShopDetails from "./components/ShopDetails";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedShop, setSelectedShop] = useState(null);
  const [isSending, setIsSending] = useState(false); 
  
  const [showMultiOrderModal, setShowMultiOrderModal] = useState({ isOpen: false });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  // --- 🚀 منطق الحركة التلقائية الذكية (تعديل الخطوة 1) ---
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false); // المفتاح الجديد للتحكم في الإيقاف

  useEffect(() => {
    // إذا كان المستخدم يتحكم يدوياً، لا تقم بإنشاء تايمر جديد
    if (isPaused) return; 

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, offsetWidth, scrollWidth } = sliderRef.current;
        
        if (scrollLeft + offsetWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 4000); 

    return () => clearInterval(interval); 
  }, [isPaused]); // التايمر الآن يراقب حالة isPaused

  // --- إعداد مصفوفة العروض أوتوماتيكياً من ملف المتاجر ---
  const allOffers = useMemo(() => {
    const combined = [];
    shops.forEach(shop => {
      if (shop.offers && Array.isArray(shop.offers)) {
        shop.offers.forEach(offer => {
          combined.push({
            ...offer,
            shopId: shop.id,      
            shopName: shop.name,
            price: offer.price,
            oldPrice: offer.oldPrice,
            description: offer.description || offer.desc
          });
        });
      }
    });
    return combined;
  }, [shops]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e); 
    };

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || window.navigator.standalone === true;

    if (isIos && !isStandalone) {
      setShowIosPrompt(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); 
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null); 
  };

  const [cart, setCart] = useState({});
  const [itemNotes, setItemNotes] = useState({});
  
  const [customerInfo, setCustomerInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customer_data');
      return saved ? JSON.parse(saved) : { name: "", phone: "", address: "" };
    }
    return { name: "", phone: "", address: "" };
  });

  const updateCustomerInfo = (newData) => {
    setCustomerInfo(newData);
    localStorage.setItem('customer_data', JSON.stringify(newData));
  };

  const [locationUrl, setLocationUrl] = useState("");

  const addToCart = (shopName, item) => {
    const key = `${shopName}-${item.name}`;
    setCart((prev) => ({
      ...prev,
      [key]: prev[key]
        ? { ...prev[key], quantity: prev[key].quantity + 1 }
        : { ...item, quantity: 1, key }
    }));
  };

  const removeFromCart = (key) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[key];
      return newCart;
    });
  };

  const updateItemNote = (key, note) => {
    setItemNotes((prev) => ({ ...prev, [key]: note }));
  };

  const calculateTotal = () =>
    Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getGroupedCart = () => {
    const grouped = {};
    Object.values(cart).forEach((item) => {
      const shopName = item.key.split("-")[0];
      if (!grouped[shopName]) grouped[shopName] = [];
      grouped[shopName].push(item);
    });
    return grouped;
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        // تصحيح الرابط ليكون Google Maps مباشر
        setLocationUrl(`https://www.google.com/maps?q=${latitude},${longitude}`);
      });
    }
  };     
  
  const sendOrder = async () => {
    if (isSending) return; 
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("يرجى إكمال بيانات العميل (الاسم، الهاتف، العنوان) أولاً");
      return;
    }

    if (Object.keys(cart).length === 0) {
      alert("السلة فارغة!");
      return;
    }

    // --- حساب التاريخ والوقت يدوياً لضمان الدقة المطلقة ---
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const dateStr = `${d}-${m}-${y}`;
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    // --------------------------------------------------

    setIsSending(true);

    try {
      const lastRef = typeof window !== 'undefined' ? (localStorage.getItem('invoice_ref') || 1000) : 1000;
      const newRef = parseInt(lastRef) + 1;
      if (typeof window !== 'undefined') localStorage.setItem('invoice_ref', newRef);

      const groupedCart = getGroupedCart();
      const totalAmount = calculateTotal();

      // حفظ في Firebase
      const orderData = {
        invoiceRef: newRef,
        customer: customerInfo,
        items: groupedCart,
        total: totalAmount,
        location: locationUrl,
        status: "pending",
        orderDate: dateStr,
        orderTime: timeStr,
        createdAt: serverTimestamp() 
      };

      const ordersRef = ref(db, 'orders');
      await set(push(ordersRef), orderData);

      // --- تمرير البيانات المحسوبة للـ Modal ---
      setShowMultiOrderModal({ 
        isOpen: true, 
        fixedDate: dateStr, 
        fixedTime: timeStr,
        fixedRef: newRef 
      });

      // بناء رسالة المدير المجمعة
      const buildFullDetailMessage = () => {
        let msg = `*🚀 طلب جديد - فاتورة رقم: #${newRef}*\n`;
        msg += `*📅 التاريخ:* ${dateStr}\n`;
        msg += `*⏰ الوقت:* ${timeStr}\n`;
        msg += `*━━━━━━━━━━━━━━*\n`;
        msg += `*👤 العميل:* ${customerInfo.name}\n`;
        msg += `*📞 الهاتف:* ${customerInfo.phone}\n`;
        msg += `*📍 العنوان:* ${customerInfo.address}\n`;
        if (locationUrl) msg += `*🗺️ الموقع:* ${locationUrl}\n`;
        msg += `*━━━━━━━━━━━━━━*\n\n`;

        Object.keys(groupedCart).forEach((shopName) => {
          let shopSubtotal = 0;
          msg += `*🏪 متجر: ${shopName}*\n`;
          groupedCart[shopName].forEach((item) => {
            const itemTotal = item.quantity * item.price;
            shopSubtotal += itemTotal;
            const note = itemNotes[item.key] ? `\n   📝 ملاحظة: ${itemNotes[item.key]}` : "";
            // تم إضافة تفصيلة بسيطة هنا لتوضيح لو الصنف كان "عرض"
            const offerTag = item.isOffer ? " [🎁 عرض خاص]" : "";
            msg += `• ${item.name}${offerTag} (${item.quantity} × ${item.price} ج.م) = ${itemTotal} ج.م${note}\n`;
          });
          msg += `*💰 إجمالي المتجر:* ${shopSubtotal} ج.م\n`;
          msg += `*--------------------*\n\n`;
        });

        msg += `*━━━━━━━━━━━━━━*\n`;
        msg += `*💵 الإجمالي الكلي: ${totalAmount} ج.م*\n`;
        msg += `*━━━━━━━━━━━━━━*\n`;
        return msg;
      };

      const adminWhatsapp = "201122947479"; 
      window.open(`https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(buildFullDetailMessage())}`, "_blank");

      // تصفير بيانات السلة فقط
      setCart({});
      setItemNotes({});
      
    } catch (error) {
      console.error("❌ Error:", error);
      alert("حدث خطأ في الاتصال.");
    } finally {
      setIsSending(false);
    }
  };
// --- تحديث الفلاتر ونافذة توزيع الطلبات ---
  const categories = ["الكل", "مطاعم", "صيدليات", "سوبر ماركت", "عطارة", "مصنعات اللحوم"];

  const filteredShops = shops.filter((shop) => {
    const matchCategory = selectedCategory === "الكل" || shop.category === selectedCategory;
    const lowerSearch = searchTerm.toLowerCase();
    const matchShopName = shop.name.toLowerCase().includes(lowerSearch);
    const matchMenuItem = shop.menuCategories?.some(cat => 
      cat.items.some(item => item.name.toLowerCase().includes(lowerSearch))
    );
    return matchCategory && (matchShopName || matchMenuItem);
  });

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff", paddingBottom: "80px", overflowX: "hidden" }}>
      
      {showMultiOrderModal.isOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.95)", zIndex: 20000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "15px"
        }}>
          <div style={{ 
            backgroundColor: "#1e1e1e", padding: "20px", borderRadius: "25px", 
            width: "100%", maxWidth: "400px", textAlign: "center", border: "2px solid #FF6600" 
          }}>
            <h3 style={{ color: "#FF6600", marginBottom: "10px" }}>تقسيم الطلبات 📦</h3>
            <p style={{ color: "#eee", fontSize: "13px", marginBottom: "15px" }}>يرجى إرسال كل طلب لمكانه المخصص:</p>
            
            <div style={{ maxHeight: "250px", overflowY: "auto", marginBottom: "15px" }}>
              {Object.keys(getGroupedCart()).map((shopName, index) => {
                const shopData = shops.find(s => s.name === shopName);
                const itemsInShop = getGroupedCart()[shopName];

                const buildShopSpecificMessage = () => {
                  const { fixedDate, fixedTime, fixedRef } = showMultiOrderModal;

                  let shopSubtotal = 0;
                  let msg = `*📦 طلب جديد - فاتورة #${fixedRef || '---'}*\n`;
                  msg += `*📅 التاريخ:* ${fixedDate || '---'}\n`; 
                  msg += `*⏰ الوقت:* ${fixedTime || '---'}\n`;   
                  msg += `*━━━━━━━━━━━━━━*\n`;
                  msg += `*👤 العميل:* ${customerInfo.name}\n`;
                  msg += `*📍 العنوان:* ${customerInfo.address}\n`;
                  if (locationUrl) msg += `*🗺️ الموقع:* ${locationUrl}\n`;
                  msg += `*━━━━━━━━━━━━━━*\n\n`;
                  msg += `*الأصناف المطلوبة:*\n`;
                  
                  itemsInShop.forEach(item => {
                    const itemTotal = item.quantity * item.price;
                    shopSubtotal += itemTotal;
                    const note = itemNotes[item.key] ? `\n   📝 ملاحظة: ${itemNotes[item.key]}` : "";
                    msg += `• ${item.name} (${item.quantity} × ${item.price} ج.م) = ${itemTotal} ج.م${note}\n`;
                  });

                  msg += `\n*💰 إجمالي الحساب:* ${shopSubtotal} ج.م\n`;
                  return msg;
                };

                return (
                  <button
                    key={index}
                    onClick={() => {
                      const msg = buildShopSpecificMessage();
                      window.open(`https://wa.me/${shopData?.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
                    }}
                    style={{
                      width: "100%", padding: "12px", backgroundColor: "#fff", color: "#000",
                      borderRadius: "12px", fontWeight: "bold", marginBottom: "8px", border: "none",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                  >
                    <span>✅ إرسال لـ {shopName}</span>
                    <span style={{ fontSize: "16px" }}>➔</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setShowMultiOrderModal({ isOpen: false });
                setCart({});
                setItemNotes({});
              }}
              style={{ 
                width: "100%", padding: "15px", backgroundColor: "#FF6600", color: "#fff", 
                borderRadius: "15px", fontWeight: "bold", border: "none"
              }}
            >
              🏁 إنهاء وإغلاق القائمة
            </button>
          </div>
        </div>
      )}

      {deferredPrompt && activeTab === "home" && !selectedShop && (
        <div style={{
          backgroundColor: "#FF6600", padding: "12px 20px", display: "flex",
          justifyContent: "space-between", alignItems: "center", borderRadius: "12px",
          margin: "15px", boxShadow: "0 4px 15px rgba(255,102,0,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>📲</span>
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>ثبت التطبيق لطلب أسرع!</span>
          </div>
          <button 
            onClick={handleInstallClick}
            style={{
              backgroundColor: "#fff", color: "#FF6600", border: "none",
              padding: "8px 16px", borderRadius: "8px", fontWeight: "bold",
              fontSize: "13px", cursor: "pointer"
            }}
          >
            تثبيت الآن
          </button>
        </div>
      )}

      {showIosPrompt && activeTab === "home" && !selectedShop && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          backgroundColor: "#fff", color: "#333", padding: "20px",
          borderRadius: "20px 20px 0 0", zIndex: 10000,
          boxShadow: "0 -5px 25px rgba(0,0,0,0.4)", textAlign: "center",
          borderTop: "5px solid #FF6600"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#FF6600", fontSize: "18px" }}>ثبت تطبيق "ميني طلبات" 🚀</h3>
          <p style={{ fontSize: "14px", marginBottom: "15px", color: "#555" }}>اضغط مشاركة ⎋ ثم "إضافة للشاشة الرئيسية" ➕</p>
          <button 
            onClick={() => setShowIosPrompt(false)}
            style={{
              marginTop: "10px", width: "100%", padding: "12px",
              backgroundColor: "#FF6600", color: "#fff", border: "none",
              borderRadius: "12px", fontWeight: "bold"
            }}
          >
            حسناً، فهمت
          </button>
        </div>
      )}

  {activeTab === "home" && !selectedShop && (
  <>
    {/* 🖼️ 1. الـ Cover Section */}
    <div style={{ position: "relative", width: "100%", height: "175px", overflow: "hidden" }}>
      <img
        src="/cover.png"
        alt="App Cover"
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "cover", 
          filter: "brightness(1) contrast(1.1)" 
        }}
      />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "40px", background: "linear-gradient(to top, #121212, transparent)"
      }}></div>
    </div>

    {/* 🎡 2. شعار المول مع إضاءة خلفية */}
    <div style={{ textAlign: "center", marginTop: "-45px", position: "relative", zIndex: 5 }}>
      <div style={{
        display: "inline-block",
        borderRadius: "50%",
        boxShadow: "0 0 25px 8px rgba(255,102,0,0.35)" 
      }}>
        <img
          src="/mall-logo.png"
          alt="Mall Logo"
          style={{
            width: "85px", height: "85px", borderRadius: "50%",
            border: "4px solid #121212", backgroundColor: "#fff"
          }}
        />
      </div>
    </div>

        {/* 🔥 3. قسم العروض المتحرك (Slider) - النسخة الاحترافية المتحركة والذكية */}
{allOffers && allOffers.length > 0 && (
  <div style={{ marginTop: "10px", padding: "0 15px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
      <h3 style={{ fontSize: "18px", fontWeight: "900", color: "#FF6600", letterSpacing: "0.5px" }}>🔥 أقوى العروض</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
         <span style={{ width: "8px", height: "8px", backgroundColor: "#FF6600", borderRadius: "50%", display: "inline-block" }}></span>
         <span style={{ fontSize: "11px", color: "#666", fontWeight: "bold" }}>محدث الآن</span>
      </div>
    </div>
    
    <div 
      ref={sliderRef}
      // 👇 مستشعرات التحكم الذكي في الإيقاف والتشغيل
      onMouseEnter={() => setIsPaused(true)}      // إيقاف عند مرور الماوس
      onMouseLeave={() => setIsPaused(false)}     // تشغيل عند خروج الماوس
      onTouchStart={() => setIsPaused(true)}      // إيقاف فوري عند اللمس بالموبايل
      onTouchEnd={() => {                         // تشغيل بعد ثوانٍ من ترك الشاشة
        setTimeout(() => setIsPaused(false), 2000); 
      }}
      style={{ 
        display: "flex", 
        overflowX: "auto", 
        gap: "15px", 
        paddingBottom: "15px", 
        scrollbarWidth: "none", 
        msOverflowStyle: "none",
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch" 
      }}
    >
      {allOffers.map((offer, idx) => (
        <div 
          key={idx}
          onClick={() => {
            const targetShop = shops.find(s => s.id === offer.shopId);
            if (targetShop) {
              let targetItem = null;
              targetShop.menuCategories.forEach(cat => {
                const item = cat.items.find(i => i.name === offer.title);
                if (item) targetItem = item;
              });

              if (targetItem) {
                addToCart(targetShop.name, { ...targetItem, isOffer: true });
                setActiveTab("cart");
              } else {
                setSelectedShop(targetShop);
              }
            }
          }}
          style={{
            minWidth: "300px", 
            height: "160px", 
            position: "relative",
            borderRadius: "20px", 
            overflow: "hidden", 
            cursor: "pointer",
            border: "1.5px solid #252525",
            backgroundColor: "#1e1e1e"
          }}
        >
          {/* صورة الكارت */}
          <img 
            src={offer.image} 
            alt={offer.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: "0.7" }}
          />

          {/* طبقة النص الواضحة */}
          <div style={{
            position: "absolute", 
            bottom: 0, 
            left: 0, 
            right: 0, 
            padding: "15px",
            background: "linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0.4) 60%, transparent)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end"
          }}>
            {/* اسم المتجر */}
            <div style={{ 
              alignSelf: "flex-start",
              fontSize: "10px", 
              backgroundColor: "#FF6600", 
              padding: "2px 10px", 
              borderRadius: "50px", 
              color: "#000",
              fontWeight: "900",
              marginBottom: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
            }}>
              {offer.shopName}
            </div>

            {/* عنوان العرض */}
            <h4 style={{ 
              margin: 0, 
              fontSize: "18px", 
              color: "#fff", 
              fontWeight: "900",
              textShadow: "0 2px 4px rgba(0,0,0,0.8)" 
            }}>
              {offer.title}
            </h4>

            {/* الوصف */}
            <p style={{ 
              margin: "4px 0 0", 
              fontSize: "12px", 
              color: "#ccc", 
              fontWeight: "500",
              lineHeight: "1.2"
            }}>
              {offer.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


    {/* 🔍 4. شريط البحث (تصميم معالج لمنع الزوم وتسهيل الوصول) */}
    <div style={{ padding: "10px 15px 5px" }}>
      <div style={{ position: "relative", width: "85%" }}>
        <span style={{ 
          position: "absolute", 
          left: "15px", 
          top: "50%", 
          transform: "translateY(-50%)", 
          color: "#FF6600", 
          fontSize: "16px",
          zIndex: 2 
        }}>🔍</span>
        
        <input
          type="text"
          placeholder="ابحث عن متجر أو صنف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%", 
            padding: "14px 15px 14px 45px", 
            borderRadius: "20px",
            border: "1px solid #333", 
            backgroundColor: "#1e1e1e",
            color: "#fff", 
            outline: "none", 
            fontSize: "16px", 
            textAlign: "right",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)" 
          }}
        />
      </div>
    </div>

    {/* 📑 4. شريط التصنيفات (Sticky Categories) */}
    <div style={{ 
      display: "flex", 
      overflowX: "auto", 
      padding: "12px 15px", 
      gap: "10px", 
      scrollbarWidth: "none", 
      position: "sticky", 
      top: "0", 
      zIndex: 100, // رفعنا الـ zIndex لضمان ظهوره فوق الكروت
      backgroundColor: "#121212", 
      borderBottom: "1px solid #252525",
      msOverflowStyle: "none"
    }}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          style={{
            flex: "0 0 auto", 
            padding: "10px 20px", 
            borderRadius: "25px",
            border: "1px solid",
            borderColor: selectedCategory === cat ? "#FF6600" : "#333",
            backgroundColor: selectedCategory === cat ? "#FF6600" : "transparent",
            color: selectedCategory === cat ? "#000" : "#ccc",
            fontWeight: "bold", 
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
            fontSize: "13px",
            boxShadow: selectedCategory === cat ? "0 4px 10px rgba(255,102,0,0.3)" : "none"
          }}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* 📦 5. عرض المتاجر المفلترة (Grid System) */}
    <div style={{ 
      padding: "15px", 
      display: "grid", 
      gridTemplateColumns: "repeat(2, 1fr)", 
      gap: "15px" // مسافة أوسع قليلاً للفخامة
    }}>
      {filteredShops.length === 0 ? (
        <div style={{ textAlign: "center", gridColumn: "span 2", padding: "60px 0" }}>
          <div style={{ fontSize: "50px", marginBottom: "15px" }}>🕵️‍♂️</div>
          <p style={{ color: "#888", fontSize: "15px" }}>ملقناش حاجة بالاسم ده يا هندسة..</p>
          <button 
            onClick={() => {setSearchTerm(""); setSelectedCategory("الكل");}}
            style={{ marginTop: "15px", color: "#FF6600", background: "none", border: "none", fontWeight: "bold" }}
          >
            عرض كل المتاجر
          </button>
        </div>
      ) : (

    filteredShops.map((shop) => (
      <div
        key={shop.id}
        onClick={() => setSelectedShop(shop)}
        style={{
          position: "relative",
          height: "200px", // زودنا الارتفاع بسيط عشان يستوعب الداتا الجديدة
          borderRadius: "22px",
          overflow: "hidden",
          cursor: "pointer",
          backgroundColor: "#1e1e1e",
          border: "1px solid #333",
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          transition: "transform 0.2s ease",
          touchAction: "manipulation"
        }}
        onPointerDown={(e) => e.currentTarget.style.transform = "scale(0.96)"}
        onPointerUp={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {/* 🔥 1. شارة "تريند" للمحلات المميزة */}
        {shop.isTrending && (
          <div style={{
            position: "absolute", top: "12px", right: "12px", zIndex: 10,
            backgroundColor: "#FF6600", color: "#000", padding: "4px 10px",
            borderRadius: "10px", fontSize: "10px", fontWeight: "black",
            boxShadow: "0 4px 10px rgba(255,102,0,0.4)", display: "flex", alignItems: "center", gap: "4px"
          }}>
            <span>🔥</span> تريند
          </div>
        )}

        {/* 🕒 2. وقت التوصيل (على اليسار) */}
        <div style={{
          position: "absolute", top: "12px", left: "12px", zIndex: 10,
          backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 8px",
          borderRadius: "8px", fontSize: "10px", border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(4px)"
        }}>
          ⏱️ {shop.deliveryTime || "30-45"} د
        </div>

        {/* 🖼️ صورة الغلاف */}
        <img
          src={shop.cover || shop.logo} 
          alt={shop.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            opacity: "0.6", filter: "brightness(0.8) contrast(1.1)"
          }}
        />

        {/* 🌑 طبقة التدريج (أعمق لتحسين قراءة النصوص) */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0.5) 50%, transparent 100%)"
        }}></div>

        {/* 🏷️ محتوى الكارت */}
        <div style={{
          position: "absolute", bottom: "12px", right: "0", left: "0",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 10px"
        }}>
          {/* اللوجو */}
          <div style={{ position: "relative", marginBottom: "6px" }}>
            <img
              src={shop.logo}
              alt={shop.name}
              style={{
                width: "52px", height: "52px", borderRadius: "14px",
                border: "2px solid #FF6600", backgroundColor: "#fff",
                objectFit: "contain", padding: "2px", boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
              }}
            />
            {shop.isOpen && (
              <span style={{
                position: "absolute", bottom: "2px", right: "-2px",
                width: "12px", height: "12px", backgroundColor: "#4caf50",
                borderRadius: "50%", border: "2px solid #1e1e1e"
              }}></span>
            )}
          </div>
          
          {/* اسم المحل */}
          <h4 style={{ 
            color: "#fff", margin: "0", fontSize: "14px", fontWeight: "bold",
            lineHeight: "1.2", display: "-webkit-box", WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical", overflow: "hidden", textShadow: "0 2px 4px rgba(0,0,0,0.5)"
          }}>
            {shop.name}
          </h4>

          {/* ⭐ النجوم والتقييم */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
             <span style={{ color: "#FFD700", fontSize: "11px" }}>⭐</span>
             <span style={{ color: "#fff", fontSize: "11px", fontWeight: "bold" }}>{shop.rating || "4.5"}</span>
             <span style={{ color: "#888", fontSize: "10px" }}>({shop.reviewCount || "50"}+)</span>
          </div>

          {/* حالة المحل */}
          <div style={{ marginTop: "6px" }}>
             <span style={{ 
               fontSize: "9px", color: shop.isOpen ? "#4caf50" : "#f44336",
               fontWeight: "bold", backgroundColor: "rgba(255,255,255,0.05)",
               padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)"
             }}>
               {shop.isOpen ? "مفتوح" : "مغلق حالياً"}
             </span>
          </div>
        </div>
      </div>
    ))
  )}
</div>
      </>
    )}

            {/* 🟢 1. عرض تفاصيل المحل (عند اختيار محل من القائمة أو السلايدر) */}
      {activeTab === "home" && selectedShop && (
        <ShopDetails
          shop={selectedShop}
          onBack={() => setSelectedShop(null)}
          addToCart={addToCart}
        />
      )}

      {/* 🛒 2. عرض عربة التسوق */}
      {activeTab === "cart" && (
        <Cart
          cart={cart}
          itemNotes={itemNotes}
          removeFromCart={removeFromCart}
          updateItemNote={updateItemNote}
          calculateTotal={calculateTotal}
          getGroupedCart={getGroupedCart}
          customerInfo={customerInfo}
          setCustomerInfo={updateCustomerInfo}
          locationUrl={locationUrl}
          handleGetLocation={handleGetLocation}
          sendOrder={sendOrder} 
        />
      )}

      {/* 🚀 3. صفحة إضافة متجر (لوحة التحكم والدعم) */}
      {activeTab === "addShop" && (
        <div style={{ paddingBottom: "20px" }}>
          <InstallGuide onClose={() => setActiveTab("home")} />
          <div style={{ 
            padding: "20px", marginTop: "10px", backgroundColor: "#1e1e1e", 
            margin: "15px", borderRadius: "20px", border: "1px solid #333",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)" 
          }}>
            <h3 style={{ color: "#FF6600", marginBottom: "15px", fontSize: "20px", fontWeight: "bold" }}>🚀 سجل متجرك معنا</h3>
            <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "25px", lineHeight: "1.6" }}>
              انضم لمنصة **ميني طلبات** وابدأ في استقبال أوردراتك إلكترونياً وبكل سهولة.
            </p>
            
            <button 
              onClick={() => window.open(`https://wa.me/201122947479?text=${encodeURIComponent("أريد تسجيل متجر جديد في نظام ميني طلبات")}`)}
              style={{ 
                width: "100%", padding: "16px", borderRadius: "12px", border: "none", 
                backgroundColor: "#FF6600", color: "#fff", fontWeight: "bold", 
                cursor: "pointer", fontSize: "16px", boxShadow: "0 4px 15px rgba(255,102,0,0.3)"
              }}
            >
              إرسال طلب الانضمام عبر واتساب
            </button>
          </div>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p style={{ color: "#888", fontSize: "14px", marginBottom: "10px" }}>للدعم الفني المباشر:</p>
            <a href="tel:201122947479" style={{ 
              color: "#FF6600", fontSize: "24px", fontWeight: "black", 
              textDecoration: "none", letterSpacing: "1px" 
            }}>01122947479</a>
          </div>
        </div>
      )}

      {/* 📱 4. شريط التنقل السفلي (NavBar) */}
      <NavBar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === "home") setSelectedShop(null);
        }} 
        onBack={() => {
          setSelectedShop(null);
          setActiveTab("home");
        }}
        hasSelectedShop={!!selectedShop} 
        totalPrice={calculateTotal()} 
      />
    </div>
  );
}
