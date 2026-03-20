"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase"; 
import { ref, onValue } from "firebase/database";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const audioRef = useRef(null); // مرجع لصوت التنبيه

  // لضمان التوافق مع Next.js Hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 1. جلب الأوردرات لايف + نظام التنبيه الصوتي
  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    let isFirstLoad = true; // عشان ميرنش مع الطلبات القديمة أول ما تفتح

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(id => ({
          id,
          ...data[id]
        })).reverse();

        // لو فيه طلب جديد (العدد زاد) والصفحة مش في أول تحميلة، شغل الصوت
        if (!isFirstLoad && orderList.length > orders.length) {
          playNotification();
        }
        
        setOrders(orderList);
        isFirstLoad = false;
      }
    });

    return () => unsubscribe();
  }, [orders.length]);

  // دالة تشغيل صوت التنبيه
  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("خطأ في تشغيل الصوت:", err));
    }
  };

  // 2. دالة توزيع الأوردر المعدلة (تستخدم البيانات المخزنة فعلياً)
  const distributeOrder = (order, shopName) => {
    const items = order.items[shopName];
    
    // استخدام البيانات اللي سجلناها بإيدنا في Firebase (أضمن حل)
    const date = order.orderDate || "---";
    const time = order.orderTime || "---";

    let msg = `*📦 طلب جديد من ميني طلبات*\n`;
    msg += `*━━━━━━━━━━━━━━*\n`;
    msg += `*🧾 فاتورة رقم: #${order.invoiceRef}*\n`;
    msg += `*📅 التاريخ: ${date}*\n`;
    msg += `*⏰ الوقت: ${time}*\n`;
    msg += `*👤 العميل:* ${order.customer?.name}\n`;
    msg += `*📞 الهاتف:* ${order.customer?.phone}\n`;
    msg += `*🏠 العنوان:* ${order.customer?.address}\n`;
    if (order.location) msg += `*📍 الموقع:* ${order.location}\n`;
    msg += `*━━━━━━━━━━━━━━*\n`;
    msg += `*🛒 طلبات متجر: ${shopName}*\n\n`;
    
    let shopTotal = 0;
    items.forEach(item => {
      const total = item.price * item.quantity;
      shopTotal += total;
      msg += `• ${item.name} (${item.quantity}) = ${total} ج.م\n`;
    });
    
    msg += `\n*💰 المطلوب تحصيله: ${shopTotal} ج.م*`;
    msg += `\n*━━━━━━━━━━━━━━*`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!isClient) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-[#121212] text-white p-4 font-sans">
      {/* عنصر الصوت المخفي */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <header className="mb-6 border-b border-[#333] pb-4 text-center">
        <h1 className="text-2xl font-bold text-[#FF6600]">🛡️ لوحة تحكم ميني طلبات</h1>
        <p className="text-gray-400 text-sm mt-1">إجمالي العمليات: {orders.length}</p>
      </header>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-[#1e1e1e] p-5 rounded-2xl border border-[#252525] shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-[#FF6600] text-black font-bold px-3 py-1 rounded-lg text-sm">
                #{order.invoiceRef}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {order.orderDate} | {order.orderTime}
              </span>
            </div>
            
            <div className="space-y-1 mb-4 text-sm">
              <p className="text-gray-300"><span className="text-gray-500">العميل:</span> {order.customer?.name}</p>
              <p className="text-gray-300"><span className="text-gray-500">الهاتف:</span> {order.customer?.phone}</p>
              <p className="text-gray-300"><span className="text-gray-500">العنوان:</span> {order.customer?.address}</p>
              <p className="text-[#FF6600] font-bold text-lg mt-2 pt-2 border-t border-[#252525]">
                💰 الإجمالي: {order.total} ج.م
              </p>
            </div>

            <div className="space-y-2 mt-4">
              <p className="text-xs text-gray-400 mb-2">توزيع الطلبات على المتاجر:</p>
              {Object.keys(order.items || {}).map((shopName) => (
                <button
                  key={shopName}
                  onClick={() => distributeOrder(order, shopName)}
                  className="w-full bg-white hover:bg-gray-200 text-black py-3 px-4 rounded-xl flex justify-between items-center transition-all active:scale-95 font-bold"
                >
                  <span className="flex items-center gap-2">
                    🏪 {shopName}
                  </span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md">WhatsApp</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
