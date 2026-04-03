"use client";
import { db } from "../lib/firebase"; 
import { ref, push, set, serverTimestamp } from "firebase/database"; 
import React, { useState, useEffect, useMemo, useRef } from "react"; 
import NavBar from "./components/NavBar";
import Cart from "./components/Cart";
import InstallGuide from "./components/InstallGuide";
import shops from "./components/ShopList"; 
import ShopDetails from "./components/ShopDetails";
// ✅ استيراد Redirect من Next.js
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedShop, setSelectedShop] = useState(null);
  const [isSending, setIsSending] = useState(false); 
  
  // ✅ إضافة تعريف الحالة (State) المفقودة لحل مشكلة الـ Build Error
  const [isAdminMode, setIsAdminMode] = useState(false);

  const [showMultiOrderModal, setShowMultiOrderModal] = useState({ isOpen: false });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  // ---------------------------------------------------------
  // 🚨 الخطوة المصيرية: التحقق من نوع التطبيق قبل أي شيء
  // ---------------------------------------------------------
  useEffect(() => {
    // التأكد من أن الكود يعمل فقط في بيئة المتصفح (Client-side)
    if (typeof window !== "undefined") {
      const appType = process.env.NEXT_PUBLIC_APP_TYPE;
      
      if (appType === 'ADMIN') {
        setIsAdminMode(true);
        // ✅ استخدام window.location.replace أضمن من router.push 
        // لمنع حدوث Client-side exception أثناء التحميل الأولي
        window.location.replace('/admin');
      }
    }
  }, []); // ترك المصفوفة فارغة لضمان التنفيذ مرة واحدة فقط عند التحميل

  // ✅ منع ظهور واجهة العميل (الوميض البرتقالي) في مشروع الإدارة
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_APP_TYPE === 'ADMIN' && !isAdminMode) {
    return (
      <div style={{ 
        backgroundColor: '#0b0c0d', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'sans-serif',
        zIndex: 99999,
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '3px solid #333', 
            borderTop: '3px solid #FF6600', 
            borderRadius: '50%', 
            width: '30px', 
            height: '30px', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 10px'
          }}></div>
          <p style={{ fontSize: '12px', color: '#666' }}>جاري فتح لوحة الإدارة...</p>
        </div>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // --- 🚀 منطق الحركة التلقائية الذكية (نسخة ثابتة ومحمية) ---

  // 1. التعريفات الأساسية أولاً
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false); 
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  // 2. معالجة البيانات (useMemo) - يجب أن تكون قبل الـ useEffect الذي يستخدمها
  const allOffers = useMemo(() => {
    const combined = [];
    if (shops && Array.isArray(shops)) {
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
    }
    return combined;
  }, [shops]);

  // 3. تأثير الحركة التلقائية
  useEffect(() => {
    // حماية ضد التشغيل على السيرفر
    if (typeof window === 'undefined' || isPaused || !sliderRef.current || allOffers.length === 0) return; 

    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const { scrollLeft, offsetWidth, scrollWidth } = slider;
      // دعم RTL للمتصفحات
      const isEnd = Math.abs(scrollLeft) + offsetWidth >= scrollWidth - 10;

      if (isEnd) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // تحديد اتجاه الإزاحة بناءً على اتجاه الصفحة
        const isRTL = document.dir === "rtl";
        slider.scrollBy({ left: isRTL ? -300 : 300, behavior: "smooth" });
      }
    }, 4000); 

    return () => clearInterval(interval); 
  }, [isPaused, allOffers]);

  // 4. تأثير تثبيت التطبيق (PWA)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e); 
    };

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || (navigator.standalone === true);

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

    // --- الجزء الثاني: منطق السلة والبيانات (مع الحفاظ على إعداداتك) ---

  const [cart, setCart] = useState({});
  const [itemNotes, setItemNotes] = useState({});
  
  const [customerInfo, setCustomerInfo] = useState(() => {
    // منع استدعاء التخزين المحلي في وضع الإدارة لتجنب التداخل
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_APP_TYPE !== 'ADMIN') {
      const saved = localStorage.getItem('customer_data');
      return saved ? JSON.parse(saved) : { name: "", phone: "", address: "" };
    }
    return { name: "", phone: "", address: "" };
  });

  const updateCustomerInfo = (newData) => {
    setCustomerInfo(newData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('customer_data', JSON.stringify(newData));
    }
  };

  const [locationUrl, setLocationUrl] = useState("");

  const addToCart = (shopName, item) => {
    const key = `${shopName}-${item.name}`;
    setCart((prev) => {
      // ✅ تحسين: زيادة الكمية بدلاً من تكرار السطر في السلة
      if (prev[key]) {
        return {
          ...prev,
          [key]: { ...prev[key], quantity: prev[key].quantity + 1 }
        };
      }
      return {
        ...prev,
        [key]: { ...item, quantity: 1, key }
      };
    });
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
    Object.values(cart).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

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
        // 📍 تم الحفاظ على الرابط كما هو بناءً على طلبك
        setLocationUrl(`https://www.google.com/maps?q=${latitude},${longitude}`);
      });
    }
  };     
  
  const sendOrder = async () => {
    if (isSending) return; 
    
    // منع إرسال طلبات وهمية إذا كان التطبيق في وضع الإدارة
    if (process.env.NEXT_PUBLIC_APP_TYPE === 'ADMIN') return;

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
    // جلب رقم الفاتورة الأخير مع ضمان عدم التداخل
    const lastRef = typeof window !== 'undefined' ? (localStorage.getItem('invoice_ref') || 1000) : 1000;
    const newRef = parseInt(lastRef) + 1;
    if (typeof window !== 'undefined') localStorage.setItem('invoice_ref', newRef);

    const groupedCart = getGroupedCart();
    const totalAmount = calculateTotal();

    // تجهيز بيانات الطلب للحفظ في Firebase
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

    // إرسال الطلب إلى قاعدة البيانات
    const ordersRef = ref(db, 'orders');
    await set(push(ordersRef), orderData);

    // --- تمرير البيانات المحسوبة للـ Modal بنجاح ---
    setShowMultiOrderModal({ 
      isOpen: true, 
      fixedDate: dateStr, 
      fixedTime: timeStr,
      fixedRef: newRef 
    });

    // بناء رسالة الواتساب المجمعة للمدير
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
          const itemTotal = (item.quantity || 1) * (item.price || 0);
          shopSubtotal += itemTotal;
          const note = itemNotes[item.key] ? `\n   📝 ملاحظة: ${itemNotes[item.key]}` : "";
          const offerTag = item.isOffer ? " [🎁 عرض خاص]" : "";
          // عرض الكمية بشكل صحيح (العدد × السعر)
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
    // فتح الواتساب في نافذة جديدة
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(buildFullDetailMessage())}`, "_blank");
    }

    // تصفير السلة بعد النجاح
    setCart({});
    setItemNotes({});
    
  } catch (error) {
    console.error("❌ Error:", error);
    alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.");
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
    
    {/* ✅ نافذة تقسيم الطلبات للمتاجر (تظهر للعميل فقط بعد الطلب) */}
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
          
          <div style={{ maxHeight: "250px", overflowY: "auto", marginBottom: "15px", paddingRight: "5px" }}>
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
                // تم الحفاظ على رابط اللوكيشن الخاص بك كما هو
                if (locationUrl) msg += `*🗺️ الموقع:* ${locationUrl}\n`;
                msg += `*━━━━━━━━━━━━━━*\n\n`;
                msg += `*الأصناف المطلوبة:*\n`;
                
                itemsInShop.forEach(item => {
                  const itemTotal = (item.quantity || 1) * (item.price || 0);
                  shopSubtotal += itemTotal;
                  const note = itemNotes[item.key] ? `\n   📝 ملاحظة: ${itemNotes[item.key]}` : "";
                  // تحديث لعرض الكمية بوضوح في رسالة المحل
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
                    const whatsappNum = shopData?.whatsapp || "201122947479";
                    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  style={{
                    width: "100%", padding: "14px", backgroundColor: "#fff", color: "#000",
                    borderRadius: "15px", fontWeight: "bold", marginBottom: "10px", border: "none",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                  }}
                >
                  <span style={{ fontSize: "14px" }}>✅ إرسال لـ {shopName}</span>
                  <span style={{ fontSize: "18px" }}>➔</span>
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
              borderRadius: "15px", fontWeight: "bold", border: "none", marginTop: "5px",
              boxShadow: "0 4px 15px rgba(255, 102, 0, 0.4)"
            }}
          >
            🏁 إنهاء وإغلاق القائمة
          </button>
        </div>
      </div>
    )}

            {/* 📲 حافز التثبيت للأندرويد وكروم */}
      {deferredPrompt && activeTab === "home" && !selectedShop && (
        <div style={{
          backgroundColor: "#FF6600", padding: "12px 20px", display: "flex",
          justifyContent: "space-between", alignItems: "center", borderRadius: "18px",
          margin: "15px", boxShadow: "0 8px 20px rgba(255,102,0,0.35)",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>📲</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>ثبت التطبيق الآن!</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.9)" }}>لطلب أسرع وتجربة أفضل</span>
            </div>
          </div>
          <button 
            onClick={handleInstallClick}
            style={{
              backgroundColor: "#fff", color: "#FF6600", border: "none",
              padding: "8px 18px", borderRadius: "12px", fontWeight: "900",
              fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          >
            تثبيت
          </button>
        </div>
      )}

      {/* 🍎 نافذة إرشاد التثبيت لمستخدمي آيفون (iOS) */}
      {showIosPrompt && activeTab === "home" && !selectedShop && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          backgroundColor: "#fff", color: "#333", padding: "25px 20px",
          borderRadius: "30px 30px 0 0", zIndex: 10000,
          boxShadow: "0 -10px 40px rgba(0,0,0,0.5)", textAlign: "center",
          borderTop: "6px solid #FF6600", animation: "slideUp 0.4s ease-out"
        }}>
          <div style={{ width: "40px", height: "5px", backgroundColor: "#ddd", borderRadius: "10px", margin: "-10px auto 20px" }}></div>
          <h3 style={{ margin: "0 0 10px 0", color: "#FF6600", fontSize: "20px", fontWeight: "900" }}>ثبت "ميني طلبات" على الآيفون 🚀</h3>
          <p style={{ fontSize: "15px", marginBottom: "20px", color: "#444", lineHeight: "1.6" }}>
            اضغط على زر المشاركة <span style={{ fontSize: "20px" }}>⎋</span> <br/>
            ثم اختر <span style={{ fontWeight: "bold" }}>"إضافة للشاشة الرئيسية" ➕</span>
          </p>
          <button 
            onClick={() => setShowIosPrompt(false)}
            style={{
              width: "100%", padding: "15px",
              backgroundColor: "#FF6600", color: "#fff", border: "none",
              borderRadius: "16px", fontWeight: "bold", fontSize: "16px",
              boxShadow: "0 5px 15px rgba(255,102,0,0.3)"
            }}
          >
            حسناً، سأفعل ذلك
          </button>
        </div>
      )}

      {activeTab === "home" && !selectedShop && (
        <>
          {/* 🖼️ 1. قسم الغلاف (Cover Section) */}
          <div style={{ position: "relative", width: "100%", height: "185px", overflow: "hidden" }}>
            <img
              src="/cover.webp"
              alt="App Cover"
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                filter: "brightness(0.9) contrast(1.1)" 
              }}
            />
            {/* التدرج اللوني السفلي للدمج مع الخلفية */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: "60px", background: "linear-gradient(to top, #121212, transparent)"
            }}></div>
          </div>

          {/* 🎡 2. شعار المول مع إضاءة خلفية واحترافية */}
          <div style={{ textAlign: "center", marginTop: "-55px", position: "relative", zIndex: 10 }}>
            <div style={{
              display: "inline-block",
              borderRadius: "50%",
              boxShadow: "0 10px 30px rgba(255,102,0,0.4)",
              padding: "3px",
              backgroundColor: "rgba(255,102,0,0.2)"
            }}>
              <img
                src="/mall-logo.webp"
                alt="Mall Logo"
                style={{
                  width: "95px", height: "95px", borderRadius: "50%",
                  border: "5px solid #121212", backgroundColor: "#fff",
                  display: "block"
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
         <span style={{ 
           width: "8px", 
           height: "8px", 
           backgroundColor: "#FF6600", 
           borderRadius: "50%", 
           display: "inline-block",
           animation: "pulse 1.5s infinite" // تأثير نبضي لجذب الانتباه
         }}></span>
         <span style={{ fontSize: "11px", color: "#888", fontWeight: "bold" }}>محدث الآن</span>
      </div>
    </div>
    
    <div 
      ref={sliderRef}
      // 👇 مستشعرات التحكم الذكي في الإيقاف والتشغيل (تم الحفاظ عليها بدقة)
      onMouseEnter={() => setIsPaused(true)}      
      onMouseLeave={() => setIsPaused(false)}     
      onTouchStart={() => setIsPaused(true)}      
      onTouchEnd={() => {                         
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
              // البحث عن الصنف داخل منيو المحل
              targetShop.menuCategories.forEach(cat => {
                const item = cat.items.find(i => i.name === offer.title);
                if (item) targetItem = item;
              });

              if (targetItem) {
                // إضافة للسلة مباشرة مع وسم العرض
                addToCart(targetShop.name, { ...targetItem, isOffer: true });
                setActiveTab("cart");
              } else {
                // لو مش موجود كصنف منفصل، نفتح صفحة المحل
                setSelectedShop(targetShop);
              }
            }
          }}
          style={{
            minWidth: "280px", 
            height: "160px", 
            position: "relative",
            borderRadius: "20px", 
            overflow: "hidden", 
            cursor: "pointer",
            border: "1px solid #252525",
            backgroundColor: "#1e1e1e",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}
        >
          {/* صورة العرض مع طبقة تعتيم خفيفة */}
          <img 
            src={offer.image} 
            alt={offer.title}
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover", 
              opacity: "0.6",
              transition: "transform 0.3s ease" 
            }}
          />

          {/* معلومات العرض */}
          <div style={{
            position: "absolute", 
            bottom: 0, 
            left: 0, 
            right: 0, 
            padding: "15px",
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 30%, transparent)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end"
          }}>
            {/* اسم المتجر (Tag) */}
            <div style={{ 
              alignSelf: "flex-start",
              fontSize: "11px", 
              backgroundColor: "#FF6600", 
              padding: "3px 12px", 
              borderRadius: "50px", 
              color: "#fff",
              fontWeight: "900",
              marginBottom: "8px",
              boxShadow: "0 2px 8px rgba(255,102,0,0.4)"
            }}>
              {offer.shopName}
            </div>

            {/* عنوان العرض */}
            <h4 style={{ 
              margin: 0, 
              fontSize: "17px", 
              color: "#fff", 
              fontWeight: "900",
              textShadow: "0 2px 4px rgba(0,0,0,0.8)" 
            }}>
              {offer.title}
            </h4>

            {/* وصف العرض القصير */}
            <p style={{ 
              margin: "4px 0 0", 
              fontSize: "13px", 
              color: "#bbb", 
              fontWeight: "500",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {offer.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    {/* 🔍 4. شريط البحث (تصميم ذكي يمنع زوم المتصفح المزعج) */}
<div style={{ padding: "10px 15px 5px" }}>
  <div style={{ position: "relative", width: "100%" }}>
    <span style={{ 
      position: "absolute", 
      right: "15px", // نقلنا البحث لليمين ليتماشى مع اللغة العربية
      top: "50%", 
      transform: "translateY(-50%)", 
      color: "#FF6600", 
      fontSize: "18px",
      zIndex: 2 
    }}>🔍</span>
    
    <input
      type="text"
      placeholder="ابحث عن متجر أو صنف..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      // التعديل السحري: fontSize 16px يمنع الـ Auto-Zoom في هواتف آيفون
      style={{
        width: "100%", 
        padding: "14px 45px 14px 15px", 
        borderRadius: "20px",
        border: "1px solid #333", 
        backgroundColor: "#1e1e1e",
        color: "#fff", 
        outline: "none", 
        fontSize: "16px", 
        textAlign: "right",
        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
        transition: "border-color 0.3s ease"
      }}
      onFocus={(e) => e.target.style.borderColor = "#FF6600"}
      onBlur={(e) => e.target.style.borderColor = "#333"}
    />
  </div>
</div>

{/* 📑 5. شريط التصنيفات (Sticky Categories) - يظل ثابتاً أثناء التمرير */}
<div style={{ 
  display: "flex", 
  overflowX: "auto", 
  padding: "15px", 
  gap: "12px", 
  scrollbarWidth: "none", 
  position: "sticky", 
  top: "0", 
  zIndex: 100, 
  backgroundColor: "rgba(18, 18, 18, 0.95)", // شفافية خفيفة ليعطي مظهر الـ Glassmorphism
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid #252525",
  msOverflowStyle: "none",
  WebkitOverflowScrolling: "touch"
}}>
  {categories.map((cat) => (
    <button
      key={cat}
      onClick={() => setSelectedCategory(cat)}
      style={{
        flex: "0 0 auto", 
        padding: "10px 22px", 
        borderRadius: "25px",
        border: "1.5px solid",
        borderColor: selectedCategory === cat ? "#FF6600" : "#333",
        backgroundColor: selectedCategory === cat ? "#FF6600" : "transparent",
        color: selectedCategory === cat ? "#000" : "#bbb",
        fontWeight: "900", 
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
        fontSize: "13px",
        boxShadow: selectedCategory === cat ? "0 4px 12px rgba(255,102,0,0.4)" : "none",
        transform: selectedCategory === cat ? "scale(1.05)" : "scale(1)"
      }}
    >
      {cat}
    </button>
  ))}
</div>

{/* 📦 6. عرض المتاجر المفلترة (Grid System) */}
<div style={{ 
  padding: "15px", 
  display: "grid", 
  gridTemplateColumns: "repeat(2, 1fr)", 
  gap: "15px" 
}}>
  {filteredShops.length === 0 ? (
    <div style={{ textAlign: "center", gridColumn: "span 2", padding: "80px 0" }}>
      <div style={{ fontSize: "60px", marginBottom: "15px", filter: "grayscale(0.5)" }}>🕵️‍♂️</div>
      <p style={{ color: "#888", fontSize: "16px", fontWeight: "bold" }}>ملقناش حاجة بالاسم ده يا هندسة..</p>
      <button 
        onClick={() => {setSearchTerm(""); setSelectedCategory("الكل");}}
        style={{ 
          marginTop: "20px", 
          color: "#FF6600", 
          background: "rgba(255,102,0,0.1)", 
          padding: "10px 20px",
          borderRadius: "12px",
          border: "none", 
          fontWeight: "900" 
        }}
      >
        إعادة ضبط الفلاتر
      </button>
    </div>
  ) : (
    filteredShops.map((shop) => (
      <div
        key={shop.id}
        onClick={() => setSelectedShop(shop)}
        style={{
          position: "relative",
          height: "210px", 
          borderRadius: "25px",
          overflow: "hidden",
          cursor: "pointer",
          backgroundColor: "#1e1e1e",
          border: "1px solid #333",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          touchAction: "manipulation"
        }}
        // تأثير الضغط الاحترافي
        onPointerDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
        onPointerUp={(e) => e.currentTarget.style.transform = "scale(1)"}
      >

                {/* 🔥 1. شارة "تريند" للمحلات المميزة - تصميم بارز */}
        {shop.isTrending && (
          <div style={{
            position: "absolute", top: "12px", right: "12px", zIndex: 10,
            backgroundColor: "#FF6600", color: "#000", padding: "4px 10px",
            borderRadius: "10px", fontSize: "10px", fontWeight: "900",
            boxShadow: "0 4px 15px rgba(255,102,0,0.5)", display: "flex", 
            alignItems: "center", gap: "4px", animation: "bounce 2s infinite"
          }}>
            <span>🔥</span> تريند
          </div>
        )}

        {/* 🕒 2. وقت التوصيل (على اليسار) مع تأثير زجاجي */}
        <div style={{
          position: "absolute", top: "12px", left: "12px", zIndex: 10,
          backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", padding: "4px 10px",
          borderRadius: "8px", fontSize: "11px", border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(6px)", fontWeight: "bold"
        }}>
          ⏱️ {shop.deliveryTime || "30-45"} د
        </div>

        {/* 🖼️ صورة الغلاف - مع تحسين الفلتر */}
        <img
          src={shop.cover || shop.logo} 
          alt={shop.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            opacity: "0.55", filter: "brightness(0.7) contrast(1.2)"
          }}
        />

        {/* 🌑 طبقة التدريج (أعمق لضمان وضوح اللوجو والاسم) */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(to top, rgba(18,18,18,1) 5%, rgba(0,0,0,0.4) 60%, transparent 100%)"
        }}></div>

        {/* 🏷️ محتوى الكارت المركزي */}
        <div style={{
          position: "absolute", bottom: "15px", right: "0", left: "0",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 10px"
        }}>
          {/* اللوجو مع إطار ذهبي للمحلات التريند */}
          <div style={{ position: "relative", marginBottom: "8px" }}>
            <img
              src={shop.logo}
              alt={shop.name}
              style={{
                width: "55px", height: "55px", borderRadius: "16px",
                border: shop.isTrending ? "2.5px solid #FF6600" : "2px solid #333", 
                backgroundColor: "#fff",
                objectFit: "contain", padding: "3px", boxShadow: "0 6px 15px rgba(0,0,0,0.6)"
              }}
            />
            {/* مؤشر الحالة (مفتوح/مغلق) */}
            <span style={{
              position: "absolute", bottom: "0px", right: "-2px",
              width: "14px", height: "14px", 
              backgroundColor: shop.isOpen ? "#4caf50" : "#9e9e9e",
              borderRadius: "50%", border: "2.5px solid #1e1e1e",
              boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)"
            }}></span>
          </div>
          
          {/* اسم المحل مع حماية من تداخل الأسطر */}
          <h4 style={{ 
            color: "#fff", margin: "0", fontSize: "14px", fontWeight: "900",
            lineHeight: "1.2", height: "1.2em", overflow: "hidden",
            display: "-webkit-box", WebkitLineClamp: "1", WebkitBoxOrient: "vertical",
            textShadow: "0 2px 6px rgba(0,0,0,0.8)"
          }}>
            {shop.name}
          </h4>

          {/* ⭐ النجوم والتقييم */}
          <div style={{ 
            display: "flex", alignItems: "center", gap: "4px", marginTop: "5px",
            backgroundColor: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "10px"
          }}>
             <span style={{ color: "#FFD700", fontSize: "12px" }}>⭐</span>
             <span style={{ color: "#fff", fontSize: "11px", fontWeight: "900" }}>{shop.rating || "4.5"}</span>
             <span style={{ color: "#aaa", fontSize: "10px" }}>({shop.reviewCount || "50"}+)</span>
          </div>

          {/* حالة المحل كزر صغير */}
          <div style={{ marginTop: "8px" }}>
             <span style={{ 
               fontSize: "9px", color: shop.isOpen ? "#4caf50" : "#ff5252",
               fontWeight: "900", backgroundColor: "rgba(0,0,0,0.3)",
               padding: "4px 10px", borderRadius: "8px", 
               border: shop.isOpen ? "1px solid rgba(76,175,80,0.3)" : "1px solid rgba(255,82,82,0.3)",
               textTransform: "uppercase", letterSpacing: "0.5px"
             }}>
               {shop.isOpen ? "اطلب الآن" : "مغلق حالياً"}
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

      {/* 🛒 2. عرض عربة التسوق (مع تمرير البيانات المحدثة) */}
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

      {/* 🚀 3. صفحة إضافة متجر (لوحة التحكم والدعم الفني) */}
      {activeTab === "addShop" && (
        <div style={{ paddingBottom: "40px", animation: "fadeIn 0.5s ease" }}>
          <InstallGuide onClose={() => setActiveTab("home")} />
          
          <div style={{ 
            padding: "25px", marginTop: "15px", backgroundColor: "#1e1e1e", 
            margin: "15px", borderRadius: "25px", border: "1px solid #333",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)", textAlign: "center"
          }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>🚀</div>
            <h3 style={{ color: "#FF6600", marginBottom: "12px", fontSize: "22px", fontWeight: "900" }}>سجل متجرك معنا</h3>
            <p style={{ color: "#bbb", fontSize: "14px", marginBottom: "30px", lineHeight: "1.7" }}>
              انضم لعائلة **ميني طلبات** كشريك نجاح وابدأ في استقبال أوردراتك إلكترونياً على الواتساب بكل احترافية.
            </p>
            
            <button 
              onClick={() => {
                const msg = encodeURIComponent("أريد تسجيل متجر جديد في نظام ميني طلبات واستلام لوحة التحكم الخاصة بي.");
                window.open(`https://wa.me/201122947479?text=${msg}`, "_blank");
              }}
              style={{ 
                width: "100%", padding: "18px", borderRadius: "15px", border: "none", 
                backgroundColor: "#FF6600", color: "#fff", fontWeight: "900", 
                cursor: "pointer", fontSize: "16px", boxShadow: "0 6px 20px rgba(255,102,0,0.4)",
                transition: "transform 0.2s"
              }}
              onPointerDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
              onPointerUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              إرسال طلب الانضمام الآن
            </button>
          </div>

          <div style={{ padding: "30px 20px", textAlign: "center" }}>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px", fontWeight: "bold" }}>للدعم الفني المباشر (مكالمات):</p>
            <a href="tel:201122947479" style={{ 
              color: "#FF6600", fontSize: "26px", fontWeight: "900", 
              textDecoration: "none", letterSpacing: "1.5px", display: "block"
            }}>01122947479</a>
            <p style={{ color: "#444", fontSize: "11px", marginTop: "15px" }}>جميع الحقوق محفوظة © ميني طلبات 2026</p>
          </div>
        </div>
      )}

      {/* 📱 4. شريط التنقل السفلي (NavBar) - المحرك الرئيسي للتنقل */}
      <NavBar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // تصفير المحل المختار عند العودة للرئيسية لضمان عدم حدوث تداخل
          if (tab === "home") setSelectedShop(null);
          // تمرير الصفحة للأعلى عند تغيير التبويب
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
