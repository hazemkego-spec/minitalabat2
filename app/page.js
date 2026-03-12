// app/page.js
"use client";
import React, { useState } from "react";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const categories = ["الكل", "مطاعم", "صيدليات", "سوبر ماركت", "عطارة"];

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff" }}>
      {/* Cover */}
      <img
        src="/cover.png"
        alt="App Cover"
        style={{ width: "100%", height: "180px", objectFit: "cover" }}
      />

      {/* Logo */}
      <div style={{ textAlign: "center", marginTop: "-40px" }}>
        <img
          src="/mall-logo.png"
          alt="Mall Logo"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "3px solid #FF6600",
            backgroundColor: "#fff"
          }}
        />
      </div>

      {/* Search Bar */}
      <div style={{ padding: "15px" }}>
        <input
          type="text"
          placeholder="ابحث عن متجر أو صنف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #333",
            backgroundColor: "#1e1e1e",
            color: "#fff",
            outline: "none"
          }}
        />
      </div>

      {/* Categories Scroll */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "10px",
          gap: "10px"
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              flex: "0 0 auto",
              padding: "8px 15px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: selectedCategory === cat ? "#FF6600" : "#333",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* هنا لاحقاً هنضيف عرض المتاجر حسب الفئة المختارة */}
    </div>
  );
}