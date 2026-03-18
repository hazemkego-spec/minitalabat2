"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, update } from "firebase/database";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);

  // 1. جلب الأوردرات من Firebase "لايف"
  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    return onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(id => ({
          id,
          ...data[id]
        })).reverse(); // عشان الجديد يظهر فوق
        setOrders(orderList);
      }
    });
  }, []);

  // 2. دالة توزيع الأوردر لكل محل على حدة
    const distributeOrder = (order, shopName) => {
    const items = order.items[shopName];
    
    // تحويل الـ timestamp لتنسيق مقروء (وقت وتاريخ)
    const orderDate = new Date(order.timestamp).toLocaleDateString('ar-EG');
    const orderTime = new Date(order.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    let msg = `*🏪 طلب جديد من: Mini Talabat*\n`;
    msg += `*━━━━━━━━━━━━━━*\n`;
    msg += `*🧾 فاتورة رقم: #${order.invoiceRef}*\n`;
    msg += `*📅 التاريخ: ${orderDate}*\n`; // إضافة التاريخ
    msg += `*⏰ الوقت: ${orderTime}*\n`;    // إضافة الوقت
    msg += `*👤 العميل:* ${order.customer.name}\n`;
    msg += `*📞 الهاتف:* ${order.customer.phone}\n`;
    if (order.customer.address) msg += `*🏠 العنوان:* ${order.customer.address}\n`;
    if (order.location) msg += `*📍 الموقع:* ${order.location}\n`;
    msg += `*━━━━━━━━━━━━━━*\n`;
    msg += `*🛒 طلبات متجر: ${shopName}*\n\n`;
    
    let shopTotal = 0;
    items.forEach(item => {
      const total = item.price * item.quantity;
      shopTotal += total;
      msg += `• ${item.name} (${item.quantity}) = ${total}ج\n`;
    });
    
    msg += `\n*💰 المطلوب تحصيله: ${shopTotal} ج.م*`;
    msg += `\n*━━━━━━━━━━━━━━*`;

    // فتح الواتساب
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">لوحة تحكم Mini Talabat 🛡️</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-xl shadow-md border-r-4 border-blue-500">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg text-gray-800">#${order.invoiceRef}</span>
              <span className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString('ar-EG')}</span>
            </div>
            
            <div className="mb-3">
              <p>👤 <strong>العميل:</strong> {order.customer.name}</p>
              <p>📞 <strong>الهاتف:</strong> {order.customer.phone}</p>
              <p>💰 <strong>الإجمالي:</strong> {order.total} ج.م</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold border-b pb-1">المتاجر المطلوبة (اضغط للتوزيع):</p>
              {Object.keys(order.items).map((shopName) => (
                <button
                  key={shopName}
                  onClick={() => distributeOrder(order, shopName)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex justify-between items-center transition-all mb-1"
                >
                  <span>ارسال لـ {shopName}</span>
                  <span className="bg-white text-green-600 px-2 py-0.5 rounded text-xs font-bold">WhatsApp</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
