// ShopDetails.js
import React, { useState } from "react";

const ShopDetails = ({ shop, addToCart }) => {
  const [activeSection, setActiveSection] = useState(
    shop.menu.length > 0 ? shop.menu[0].section : ""
  );

  return (
    <div style={{ padding: "15px" }}>
      {/* Cover */}
      <img
        src={shop.cover}
        alt={`${shop.name} Cover`}
        style={{ width: "100%", height: "165px", objectFit: "cover", borderRadius: "8px" }}
      />

      {/* Logo */}
      <div style={{ textAlign: "center", marginTop: "-40px" }}>
        <img
          src={shop.logo}
          alt={`${shop.name} Logo`}
          style={{ width: "80px", borderRadius: "50%", border: "3px solid #fff" }}
        />
      </div>

      {/* Shop Name */}
      <h2 style={{ textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>
        {shop.name}
      </h2>

      {/* Tabs for sections */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}>
        {shop.menu.map((section) => (
          <button
            key={section.section}
            onClick={() => setActiveSection(section.section)}
            style={{
              flex: "1",
              margin: "5px",
              padding: "10px",
              backgroundColor: activeSection === section.section ? "#FF6600" : "#333",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            {section.section}
          </button>
        ))}
      </div>

      {/* Items of active section */}
      <div style={{ marginTop: "20px" }}>
        {shop.menu
          .find((section) => section.section === activeSection)
          ?.items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#222",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px"
              }}
            >
              <span>{item.name}</span>
              <div>
                <span style={{ marginRight: "10px" }}>{item.price} ج</span>
                <button
                  onClick={() => addToCart(shop.name, item)}
                  style={{
                    backgroundColor: "#25D366",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "5px 10px",
                    cursor: "pointer"
                  }}
                >
                  ➕ أضف للسلة
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShopDetails;