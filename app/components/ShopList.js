// app/components/ShopList.js

const shops = [
  // ... باقي المتاجر اللي عندك

  {
    id: 4,
    category: "مطاعم",
    name: "جزارة ومشويات محمد صوان",
    isOpen: true,
    logo: "/sawan-logo.png",
cover: "/sawan-logo.png",
    menuCategories: [
      {
        title: "ركن المشويات 🍗",
        items: [
          { name: "كفتة بلدي 1ك", price: 400 },
          { name: "كفتة بلدي 1/2ك", price: 200 },
          { name: "كفتة بلدي 1/4ك", price: 100 },
          { name: "طرب بلدي 1ك", price: 500 },
          { name: "طرب بلدي 1/2ك", price: 250 },
          { name: "طرب بلدي 1/4ك", price: 125 },
          { name: "مشكل كفتة وكباب 1ك", price: 600 },
          { name: "مشكل كفتة وكباب 1/2ك", price: 310 },
          { name: "مشكل كفتة وكباب 1/4ك", price: 160 },
          { name: "مشكل كفتة وطرب 1ك", price: 450 },
          { name: "مشكل كفتة وطرب 1/2ك", price: 230 },
          { name: "مشكل كفتة وطرب 1/4ك", price: 120 },
          { name: "برجر بلدي 1ك", price: 350 },
          { name: "برجر بلدي 1/2ك", price: 180 },
          { name: "برجر بلدي 1/4ك", price: 95 },
          { name: "سجق بلدي 1ك", price: 350 },
          { name: "سجق بلدي 1/2ك", price: 180 },
          { name: "سجق بلدي 1/4ك", price: 95 },
          { name: "كباب ضاني 1ك", price: 800 },
          { name: "كباب ضاني 1/2ك", price: 400 },
          { name: "كباب ضاني 1/4ك", price: 200 },
          { name: "ريش ضاني 1ك", price: 800 },
          { name: "ريش ضاني 1/2ك", price: 400 },
          { name: "ريش ضاني 1/4ك", price: 200 },
          { name: "استيك كندوز 1ك", price: 600 },
          { name: "استيك كندوز 1/2ك", price: 310 },
          { name: "استيك كندوز 1/4ك", price: 160 },
          { name: "استيك فلتو 1ك", price: 650 },
          { name: "استيك فلتو 1/2ك", price: 330 },
          { name: "استيك فلتو 1/4ك", price: 170 },
          { name: "شيش طاووق 1ك", price: 350 },
          { name: "شيش طاووق 1/2ك", price: 180 },
          { name: "شيش طاووق 1/4ك", price: 95 },
          { name: "فرخة كاملة", price: 300 },
          { name: "فرخة نص", price: 155 },
          { name: "فرخة ربع", price: 80 },
          { name: "كبدة ضاني 1ك", price: 650 },
          { name: "كبدة ضاني 1/2ك", price: 330 },
          { name: "كبدة ضاني 1/4ك", price: 170 },
          { name: "كبدة كندوز 1ك", price: 600 },
          { name: "كبدة كندوز 1/2ك", price: 310 },
          { name: "كبدة كندوز 1/4ك", price: 160 },
          { name: "مخاصي 1ك", price: 400 },
          { name: "مخاصي 1/2ك", price: 200 },
          { name: "مخاصي 1/4ك", price: 100 }
        ]
      },
      {
        title: "ركن الحمام 🕊️",
        items: [
          { name: "جوز حمام محشي أرز", price: 300 },
          { name: "فرد حمام محشي أرز", price: 150 },
          { name: "جوز حمام محشي فريك", price: 300 },
          { name: "فرد حمام محشي فريك", price: 150 }
        ]
      },
      {
        title: "ركن الفتة 🍲",
        items: [
          { name: "فتة كوارع", price: 150 },
          { name: "فتة باللحمة", price: 180 },
          { name: "فتة عكاوي", price: 150 }
        ]
      },
      {
        title: "ركن الجريل 🔥",
        items: [
          { name: "حواوشي سادة", price: 20 },
          { name: "حواوشي خضار", price: 30 },
          { name: "حواوشي ميكس جبن", price: 35 },
          { name: "حواوشي محمد صوان", price: 40 },
          { name: "حواوشي بسطرمة", price: 45 },
          { name: "حواوشي بيف بيكون", price: 40 },
          { name: "حواوشي سجق", price: 50 },
          { name: "حواوشي استيك لحمة", price: 75 },
          { name: "ورقة لحمة (1/4ك)", price: 180 },
          { name: "ورقة كبدة (1/4ك)", price: 180 },
          { name: "ورقة سجق (1/4ك)", price: 120 },
          { name: "ورقة شيش طاووق (1/4ك)", price: 120 }
        ]
      },
      {
        title: "ركن الموزة 🍖",
        items: [
          { name: "موزة ضاني بالعظم على الفحم", price: 300 },
          { name: "موزة ضاني بالعظم تركي", price: 300 }
        ]
      },
      {
        title: "ركن المقبلات 🥗",
        items: [
          { name: "سلطة خضراء", price: 15 },
          { name: "باذنجان مقلي", price: 15 },
          { name: "سلطة طحينة", price: 15 },
          { name: "بابا غنوج", price: 10 },
          { name: "طماطم مخللة", price: 10 },
          { name: "ثومية", price: 10 },
          { name: "باكت بوم فريت", price: 20 }
        ]
      },
      {
        title: "ركن الطواجن 🍲",
        items: [
          { name: "طاجن لحمة بالبصل", price: 180 },
          { name: "طاجن بطاطس باللحمة", price: 180 },
          { name: "طاجن بامية باللحمة", price: 180 },
          { name: "طاجن لحمة بورق العنب", price: 200 },
          { name: "طاجن كوارع بالبصل", price: 180 },
          { name: "طاجن كوارع بورق العنب", price: 200 },
          { name: "طاجن عكاوي بورق العنب", price: 200 },
          { name: "طاجن عكاوي", price: 180 },
          { name: "طاجن مخاصي", price: 180 },
          { name: "طاجن عصب", price: 120 },
          { name: "طاجن كفتة هندي", price: 180 },
          { name: "طاجن كفتة بالطحينة", price: 180 },
          { name: "طاجن شيش طاووق سادة", price: 150 },
          { name: "طاجن شيش طاووق بالجبنة", price: 170 }
        ]
      },
      {
        title: "ركن الممبار 🥖",
        items: [
          { name: "ممبار 1ك", price: 300 },
          { name: "ممبار 1/2ك", price: 150 },
          { name: "ممبار 1/4ك", price: 75 }
        ]
      },
      {
        title: "ركن المحاشي 🍃",
        items: [
          { name: "ورق عنب 1ك", price: 200 },
          { name: "ورق عنب 1/2ك", price: 100 },
          { name: "ورق عنب 1/4ك", price: 50 },
          { name: "محشي مشكل 1ك", price: 180 },
          { name: "محشي مشكل 1/2ك", price: 90 },
          { name: "محشي مشكل 1/4ك", price: 45 }
        ]
      },
      {
        title: "ركن السندوتشات 🌯",
        items: [
          { name: "سندوتش كفتة بلدي", price: 40 },
          { name: "سندوتش كفتة سوري", price: 25 },
          { name: "سندوتش كباب بلدي", price: 95 },
          { name: "سندوتش كباب سوري", price: 80 },
          { name: "سندوتش طرب بلدي", price: 65 },
          { name: "سندوتش طرب سوري", price: 50 },
          { name: "سندوتش سجق بلدي", price: 50 },
          { name: "سندوتش سجق سوري", price: 35 },
          { name: "سندوتش شيش طاووق بلدي", price: 50 },
          { name: "سندوتش شيش طاووق سوري", price: 35 },
          { name: "سندوتش كبدة بلدي", price: 65 },
          { name: "سندوتش كبدة سوري", price: 50 },
          { name: "سندوتش بوم فريت بلدي", price: 20 }
        ]
      },
      {
        title: "ركن المطبخ 🍚",
        items: [
          { name: "طاجن ملوخية", price: 50 },
          { name: "طاجن بامية", price: 50 },
          { name: "لسان عصفور", price: 20 },
          { name: "أرز بسمتي كبير", price: 35 },
          { name: "أرز بسمتي صغير", price: 25 },
          { name: "أرز شعرية كبير", price: 30 },
          { name: "أرز شعرية صغير", price: 20 },
          { name: "أرز بالخلطة كبير", price: 50 },
          { name: "أرز بالخلطة صغير", price: 30 }
        ]
      },
      {
        title: "ركن المكرونات 🍝",
        items: [
          { name: "مكرونة بشاميل باللحمة", price: 50 },
          { name: "مكرونة نجرسكو", price: 50 },
          { name: "مكرونة شيش طاووق", price: 50 },
          { name: "مكرونة بالكبدة", price: 50 },
          { name: "مكرونة بالسجق", price: 50 },
          { name: "مكرونة بلونيز", price: 60 },
          { name: "مكرونة بالصلصة", price: 25 }
        ]
      },
      {
        title: "ركن الصواني 🥘",
        items: [
          { name: "صينية محمد صوان (8 أفراد)", price: 1200 },
          { name: "صينية الوحش", price: 900 },
          { name: "صينية ليلة العمر", price: 1450 },
          { name: "صينية ك مشكل", price: 700 },
          { name: "صينية شهر الخير", price: 950 },
          { name: "صينية الصحاب", price: 650 },
          { name: "صينية المحطة", price: 1300 },
          { name: "صينية ميكس مشويات محمد صوان", price: 1850 }
        ]
      },
      {
        title: "ركن الوجبات الفردية 🍱",
        items: [
          { name: "وجبة محمد صوان", price: 100 },
          { name: "وجبة شيش طاووق", price: 100 },
          { name: "وجبة كفتة", price: 110 },
          { name: "وجبة النووي", price: 120 }
        ]
      }
    ]
  }
  `

{
    id: 5,
    category: "صيدليات",
    name: "صيدلية د / هاني فاروق",
    isOpen: true,
    logo: "/HanyFarPharmlogo.png",
cover: "/HanyFarPharmlogo.png",
    menuCategories: []
  }
  `
  // ... باقي المتاجر
];

export default shops;