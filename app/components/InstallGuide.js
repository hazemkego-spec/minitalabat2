// app/components/InstallGuide.js
import React from "react";

export default function InstallGuide({ onClose }) {
  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#fff",
        padding: "20px",
        borderRadius: "15px",
        margin: "20px",
        textAlign: "center",
        border: "1px solid #333"
      }}
    >
      <h2 style={{ color: "#FF6600" }}>👋 أهلاً بيك في MiniTalabat</h2>
      <p style={{ margin: "15px 0" }}>
        التطبيق ده بيساعدك تطلب من المتاجر بسهولة، وتتابع سلة مشترياتك، وتبعت
        الطلب مباشرة عبر واتساب.
      </p>

      <ul style={{ textAlign: "left", margin: "15px 0" }}>
        <li>🏠 من الرئيسية تقدر تختار المتجر اللي يعجبك.</li>
        <li>🛒 من السلة تتابع الأصناف اللي اخترتها وتحسب الإجمالي.</li>
        <li>🏪 من "أضف متجرك" تقدر تسجل متجرك وتعرض منتجاتك.</li>
      </ul>

      <p style={{ margin: "15px 0" }}>
        جرب التطبيق دلوقتي، ولو عندك أي ملاحظات أو اقتراحات شاركنا بيها 🧡
      </p>

      {/* زر بدء الاستخدام */}
      <button
        onClick={onClose}
        style={{
          backgroundColor: "#FF6600",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "10px 20px",
          marginTop: "10px",
          fontWeight: "bold"
        }}
      >
        🚀 ابدأ الاستخدام
      </button>

      {/* زر واتساب للتواصل */}
      <a
        href="https://wa.me/201234567890" // ضع رقمك هنا
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          marginTop: "15px",
          backgroundColor: "#25D366",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "bold"
        }}
      >
        📲 تواصل معنا عبر واتساب
      </a>
    </div>
  );
}