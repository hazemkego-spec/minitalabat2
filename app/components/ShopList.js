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
  },
  {
    id: 5, // تأكد من أن الـ ID غير مكرر
    category: "صيدليات",
    name: "صيدلية د/ هاني فاروق",
    isOpen: true,
    logo: "/HanyFarPharmlogo.png",
    cover: "/HanyFarPharmlogo.png",
    menuCategories: [
      {
        title: "💊 مسكنات الألم وخافض الحرارة",
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
        title: "🤧 أدوية البرد والانفلونزا",
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
        title: "😷 أدوية الكحة",
        items: [
          { name: "Tusskan شراب", price: 24 },
          { name: "Oplex شراب", price: 28 },
          { name: "Bronchicum شراب", price: 40 },
          { name: "Prospan شراب", price: 55 },
          { name: "Bronchophane", price: 35 }
        ]
      },
      {
        title: "🤢 أدوية المعدة والقولون",
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
        title: "💉 مضادات حيوية",
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
        title: "🩹 كريمات ومراهم جلدية",
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
        title: "👶 أدوية الأطفال",
        items: [
          { name: "Cetal Syrup", price: 22 },
          { name: "Brufen Syrup", price: 28 },
          { name: "Otrivin Drops أطفال", price: 18 },
          { name: "Zyrtec Syrup", price: 35 },
          { name: "Apidone شراب", price: 27 }
        ]
      },
      {
        title: "💪 فيتامينات ومكملات غذائية",
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
        title: "🩸 أدوية الضغط والسكر",
        items: [
          { name: "Glucophage 500", price: 60 },
          { name: "Concor", price: 85 },
          { name: "Amlo", price: 40 },
          { name: "Capoten", price: 30 },
          { name: "Diamicron", price: 75 }
        ]
      },
      {
        title: "🧴 مستلزمات طبية",
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
        title: "🪥 منتجات العناية الشخصية",
        items: [
          { name: "معجون أسنان", price: 35 },
          { name: "غسول فم", price: 45 },
          { name: "شامبو طبي", price: 75 },
          { name: "كريم مرطب", price: 60 },
          { name: "غسول للبشرة", price: 90 }
        ]
      }
    ]
  },
  {
    id: 6,
    category: "سوبر ماركت",
    name: "سوبر ماركت أحمد الإسكندراني",
    isOpen: true,
    logo: "/A-eleskandrany.png",
    cover: "/A-eleskandrany.png",
    menuCategories: [
      {
        title: "🥛 منتجات الألبان",
        items: [
          { name: "لبن كامل الدسم (1 لتر)", price: 28 },
          { name: "لبن خالي الدسم (1 لتر)", price: 30 },
          { name: "جبنة بيضاء بلدي (كيلو)", price: 110 },
          { name: "جبنة رومي (كيلو)", price: 200 },
          { name: "جبنة شيدر (200 جم)", price: 75 },
          { name: "زبادي بلدي (علبة 100 جم)", price: 7 },
          { name: "زبادي يوناني (علبة 150 جم)", price: 20 }
        ]
      },
      {
        title: "🥩 لحوم ودواجن وأسماك",
        items: [
          { name: "لحم بلدي كندوز (كيلو)", price: 350 },
          { name: "لحمة مفرومة (كيلو)", price: 300 },
          { name: "فراخ كاملة (كيلو)", price: 105 },
          { name: "أوراك فراخ (كيلو)", price: 95 },
          { name: "صدور فراخ (كيلو)", price: 130 },
          { name: "سمك بلطي (كيلو)", price: 95 },
          { name: "سمك بوري (كيلو)", price: 140 },
          { name: "جمبري وسط (كيلو)", price: 320 }
        ]
      },
      {
        title: "🥦 خضروات وفواكه",
        items: [
          { name: "طماطم (كيلو)", price: 15 },
          { name: "بطاطس (كيلو)", price: 12 },
          { name: "بصل (كيلو)", price: 12 },
          { name: "خيار (كيلو)", price: 18 },
          { name: "جزر (كيلو)", price: 14 },
          { name: "موز (كيلو)", price: 28 },
          { name: "تفاح مستورد (كيلو)", price: 65 },
          { name: "برتقال بلدي (كيلو)", price: 18 },
          { name: "فراولة (كيلو)", price: 40 }
        ]
      },
      {
        title: "🥫 بقوليات ومعلبات",
        items: [
          { name: "فول معلب (علبة)", price: 15 },
          { name: "فول ناشف (كيلو)", price: 40 },
          { name: "عدس أصفر (كيلو)", price: 50 },
          { name: "حمص (كيلو)", price: 60 },
          { name: "لوبيا (كيلو)", price: 65 },
          { name: "تونة (علبة 185 جم)", price: 40 },
          { name: "صلصة طماطم (علبة 300 جم)", price: 18 }
        ]
      },
      {
        title: "🍞 مخبوزات وحبوب",
        items: [
          { name: "رغيف بلدي", price: 1 },
          { name: "عيش فينو (10 أرغفة)", price: 18 },
          { name: "عيش شامي (رغيف)", price: 2 },
          { name: "أرز أبيض (كيلو)", price: 35 },
          { name: "أرز بسمتي (كيلو)", price: 100 },
          { name: "مكرونة (كيلو)", price: 28 },
          { name: "دقيق فاخر (كيلو)", price: 22 }
        ]
      },
      {
        title: "🍫 حلويات ومشروبات",
        items: [
          { name: "شيكولاتة محلية (لوح 40 جم)", price: 15 },
          { name: "شيكولاتة مستوردة (لوح 100 جم)", price: 55 },
          { name: "بسكويت سادة (علبة)", price: 25 },
          { name: "شاي (كيلو)", price: 200 },
          { name: "قهوة سريعة التحضير (100 جم)", price: 110 },
          { name: "نسكافيه جولد (100 جم)", price: 160 },
          { name: "عصير معلب (1 لتر)", price: 30 },
          { name: "مياه معدنية (1.5 لتر)", price: 8 }
        ]
      },
      {
        title: "🧴 منظفات وعناية منزلية",
        items: [
          { name: "مسحوق غسيل (كيلو)", price: 65 },
          { name: "صابون سائل للأطباق (750 مل)", price: 40 },
          { name: "كلور (1 لتر)", price: 25 },
          { name: "شامبو (400 مل)", price: 90 },
          { name: "صابون تواليت (قطعة)", price: 12 },
          { name: "معطر جو (300 مل)", price: 55 }
        ]
      }
    ]
  }

  // ... باقي المتاجر
];

export default shops;