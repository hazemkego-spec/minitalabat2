// app/components/ShopList.js
import React from "react";

const shops = [
  {
    id: 1,
    category: "مطاعم",
    name: "مطعم المشويات البلدي",
    isOpen: true,
    logo: "/restaurant-logo.png",
    cover: "/restaurant-cover.jpg",
    menuCategories: [
      {
        title: "قسم المشويات 🍗",
        items: [
          { name: "كفتة بلدي (كيلو)", price: 400 },
          { name: "شيش طاووق (كيلو)", price: 350 }
        ]
      },
      {
        title: "قسم اللحوم 🥩",
        items: [
          { name: "لحم بلدي (كيلو)", price: 300 },
          { name: "كبدة بلدي (كيلو)", price: 280 }
        ]
      }
    ]
  },
  {
    id: 2,
    category: "سوبر ماركت",
    name: "سوبر ماركت الخير",
    isOpen: true,
    logo: "/supermarket-logo.png",
    cover: "/supermarket-cover.jpg",
    items: [
      { name: "لبن", price: 35 },
      { name: "جبنة", price: 70 },
      { name: "زيت", price: 90 }
    ]
  },
  {
    id: 3,
    category: "صيدليات",
    name: "صيدلية الشفاء",
    isOpen: true,
    logo: "/pharmacy-logo.png",
    cover: "/pharmacy-cover.jpg",
    items: [
      { name: "بندول", price: 30 },
      { name: "فيتامين سي", price: 50 }
    ]
  }
];

export default shops;