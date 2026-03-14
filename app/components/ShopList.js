// ShopList.js
import React from "react";

const shops = [
  {
    name: "جزارة ومشويات محمد صوان",
    logo: "/sawan-logo.png",
    cover: "/cover.png",
    menu: [
      // المنيو بتاع المطعم القديم هنا
    ]
  },
  {
    name: "صيدلية د/ هاني فاروق",
    logo: "/HanyFarPharmlogo.png",
    cover: "/HanyFarPharmlogo.png",
    menu: [
      {
        section: "💊 مسكنات الألم وخافض الحرارة",
        items: [
          { name: "Panadol أقراص", price: 35 },
          { name: "Cetal أقراص", price: 25 },
          { name: "Brufen 400 مجم", price: 42 },
          { name: "Ketofan", price: 30 },
          { name: "Voltaren أقراص", price: 55 },
          { name: "Adol", price: 28 },
          { name: "Fevadol", price: 30 }
        ]
      },
      {
        section: "🤧 أدوية البرد والانفلونزا",
        items: [
          { name: "Congestal", price: 40 },
          { name: "Flurest", price: 32 },
          { name: "Panadol Cold & Flu", price: 45 },
          { name: "Actifed", price: 30 },
          { name: "Decozal", price: 27 },
          { name: "Cold Free", price: 29 }
        ]
      },
      {
        section: "😷 أدوية الكحة",
        items: [
          { name: "Tusskan شراب", price: 24 },
          { name: "Oplex شراب", price: 28 },
          { name: "Bronchicum شراب", price: 40 },
          { name: "Prospan شراب", price: 55 },
          { name: "Bronchophane", price: 35 }
        ]
      },
      {
        section: "🤢 أدوية المعدة والقولون",
        items: [
          { name: "Antodine", price: 38 },
          { name: "Gaviscon", price: 60 },
          { name: "Gast-Reg", price: 45 },
          { name: "Motilium", price: 48 },
          { name: "Flagyl", price: 25 },
          { name: "Buscopan", price: 30 }
        ]
      },
      {
        section: "💉 مضادات حيوية",
        items: [
          { name: "Augmentin 1 جم", price: 115 },
          { name: "Curam", price: 97 },
          { name: "Amoxil", price: 50 },
          { name: "Hibiotic", price: 75 },
          { name: "Suprax", price: 120 },
          { name: "Ceftriaxone حقن", price: 45 }
        ]
      },
      {
        section: "🩹 كريمات ومراهم جلدية",
        items: [
          { name: "Fucidin", price: 55 },
          { name: "Fucicort", price: 65 },
          { name: "Betadine مرهم", price: 30 },
          { name: "MEBO", price: 40 },
          { name: "Panthenol كريم", price: 35 },
          { name: "Kenacomb", price: 42 }
        ]
      },
      {
        section: "👶 أدوية الأطفال",
        items: [
          { name: "Cetal Syrup", price: 22 },
          { name: "Brufen Syrup", price: 28 },
          { name: "Otrivin Drops أطفال", price: 18 },
          { name: "Zyrtec Syrup", price: 35 },
          { name: "Apidone شراب", price: 27 }
        ]
      },
      {
        section: "💪 فيتامينات ومكملات غذائية",
        items: [
          { name: "Centrum", price: 120 },
          { name: "Vitamin C", price: 35 },
          { name: "Omega 3", price: 95 },
          { name: "Vitamin D3", price: 70 },
          { name: "Feroglobin", price: 90 },
          { name: "Royal Vit G", price: 85 }
        ]
      },
      {
        section: "🩸 أدوية الضغط والسكر",
        items: [
          { name: "Glucophage 500", price: 60 },
          { name: "Concor", price: 85 },
          { name: "Amlo", price: 40 },
          { name: "Capoten", price: 30 },
          { name: "Diamicron", price: 75 }
        ]
      },
      {
        section: "🧴 مستلزمات طبية",
        items: [
          { name: "كحول طبي", price: 15 },
          { name: "قطن طبي", price: 12 },
          { name: "شاش طبي", price: 10 },
          { name: "لاصق جروح", price: 8 },
          { name: "ترمومتر رقمي", price: 85 },
          { name: "جهاز قياس ضغط", price: 450 }
        ]
      },
      {
        section: "🪥 منتجات العناية الشخصية",
        items: [
          { name: "معجون أسنان", price: 35 },
          { name: "غسول فم", price: 45 },
          { name: "شامبو طبي", price: 75 },
          { name: "كريم مرطب", price: 60 },
          { name: "غسول للبشرة", price: 90 }
        ]
      }
    ]
  }
];

export default shops;