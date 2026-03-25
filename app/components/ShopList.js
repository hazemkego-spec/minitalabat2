// app/components/ShopList.js

export const shops = [
  // ... باقي المتاجر اللي عندك

  {
    id: 4,
    category: "مطاعم",
    whatsapp: "201092878201",
    name: "جزارة ومشويات محمد صوان",
    isOpen: true,
    logo: "/sawan-logo.png",
    cover: "/sawan-cover.jpg", // يفضل صورة عرض عريضة هنا
    
    // --- الإضافات الجديدة ---
    rating: 4.8,            // تقييم المحل (من 5)
    reviewCount: 120,       // عدد المراجعات
    isTrending: true,       // علامة "الأكثر طلباً"
    deliveryTime: "30-45",  // وقت التوصيل المتوقع بالدقائق
    
    // مصفوفة العروض الخاصة بالمحل (ستظهر في الـ Slider العلوي)
    offers: [
      { 
        id: "off1", 
        title: "عرض العيلة", 
        description: "كيلو كفتة + سلطات + عيش بـ 350 ج.م بس!", 
        image: "/offers/sawan-offer1.jpg" 
      }
    ],
    // ------------------------

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
    id: 5, 
    category: "صيدليات",
    whatsapp: "201092293348",
    name: "صيدلية د_ هاني فاروق",
    isOpen: true,
    logo: "/HanyFarPharmlogo.png",
    cover: "/HanyFarPharmlogo.png",
    
    // --- البيانات التجارية الجديدة (بدون تغيير مساراتك) ---
    rating: 4.9,              // تقييم الصيدلية
    reviewCount: 92,          // عدد المراجعات
    isTrending: false,        
    deliveryTime: "15-25",    // سرعة التوصيل للصيدلية
    
    // مصفوفة العروض (تستخدم اللوجو كصورة مؤقتة)
    offers: [
      { 
        id: "off_ph1", 
        title: "رعاية وخصومات", 
        description: "خصم 10% على منتجات العناية بالبشرة والشعر", 
        image: "/HanyFarPharmlogo.png" // placeholder مؤقت
      }
    ],
    // ------------------------------------------------

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
    whatsapp: "201110884088",
    name: "سوبر ماركت أحمد الإسكندراني",
    isOpen: true,
    logo: "/A-eleskandrany.png",
    cover: "/A-eleskandrany.png",
    
    // --- البيانات التجارية الجديدة ---
    rating: 4.7,              // تقييم السوبر ماركت
    reviewCount: 156,          // عدد المقيّمين
    isTrending: true,         // السوبر ماركت دايماً عليه سحب
    deliveryTime: "20-40",    // وقت مناسب لطلبات البقالة
    
    // مصفوفة العرض (تستخدم اللوجو كصورة مؤقتة)
    offers: [
      { 
        id: "off_sm1", 
        title: "عروض الويك إند", 
        description: "خصومات تصل لـ 15% على جميع المنظفات والألبان", 
        image: "/A-eleskandrany.png" // placeholder مؤقت للوجو
      }
    ],
    // ------------------------------------------------

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
  },

  {
    id: 7,
    category: "سوبر ماركت",
    whatsapp: "201011111111", // تأكد من مراجعة رقم الواتساب الخاص به
    name: "سوبر ماركت الحسيني",
    isOpen: true,
    logo: "/Elhuseny.png",
    cover: "/Elhuseny.png",
    
    // --- البيانات التجارية الجديدة ---
    rating: 4.6,              
    reviewCount: 110,          
    isTrending: false,        
    deliveryTime: "25-45",    
    
    // مصفوفة العرض (تستخدم اللوجو كصورة مؤقتة)
    offers: [
      { 
        id: "off_sm2", 
        title: "خصم السوبر", 
        description: "وفر 10% على جميع أنواع الجبن والألبان الطازجة", 
        image: "/Elhuseny.png" // placeholder مؤقت للوجو
      }
    ],
    // ------------------------------------------------

    menuCategories: [
      {
        title: "🥖 الحبوب والمكرونة",
        items: [
          { name: "أرز مصري 1 كجم", price: 34 },
          { name: "أرز بسمتي 1 كجم", price: 65 },
          { name: "مكرونة 400 جم", price: 10 },
          { name: "مكرونة 1 كجم", price: 22 },
          { name: "شعرية", price: 9 },
          { name: "دقيق أبيض 1 كجم", price: 24 },
          { name: "دقيق فاخر", price: 28 },
          { name: "سميد", price: 28 },
          { name: "شوفان", price: 35 }
        ]
      },
      {
        title: "🫘 البقوليات",
        items: [
          { name: "عدس أصفر", price: 65 },
          { name: "عدس بجبة", price: 60 },
          { name: "فول بلدي", price: 62 },
          { name: "حمص", price: 70 },
          { name: "لوبيا", price: 60 },
          { name: "فاصوليا بيضاء", price: 70 },
          { name: "ترمس", price: 45 }
        ]
      },
      {
        title: "🧂 السكر والزيوت",
        items: [
          { name: "سكر 1 كجم", price: 34 },
          { name: "سكر بني", price: 40 },
          { name: "زيت عباد الشمس 1 لتر", price: 92 },
          { name: "زيت خليط 1 لتر", price: 85 },
          { name: "زيت ذرة", price: 95 },
          { name: "سمن نباتي 1 كجم", price: 85 },
          { name: "سمن بلدي 500 جم", price: 110 }
        ]
      },
      {
        title: "🧀 الألبان والجبن",
        items: [
          { name: "لبن 1 لتر", price: 35 },
          { name: "لبن نصف لتر", price: 18 },
          { name: "زبادي", price: 6 },
          { name: "جبنة بيضاء", price: 60 },
          { name: "جبنة اسطنبولي", price: 70 },
          { name: "جبنة رومي", price: 220 },
          { name: "جبنة شيدر", price: 55 },
          { name: "جبنة مثلثات", price: 35 }
        ]
      },
      {
        title: "🥚 البيض",
        items: [
          { name: "كرتونة بيض أبيض", price: 140 },
          { name: "كرتونة بيض أحمر", price: 146 },
          { name: "بيض بلدي", price: 160 }
        ]
      },
      {
        title: "🥫 المعلبات",
        items: [
          { name: "تونة عادية", price: 30 },
          { name: "تونة قطع", price: 45 },
          { name: "فول معلب", price: 10 },
          { name: "فاصوليا معلبة", price: 12 },
          { name: "ذرة حلوة", price: 20 },
          { name: "مشروم", price: 30 },
          { name: "صلصة طماطم", price: 8 }
        ]
      },
      {
        title: "🍪 البسكويت والسناكس",
        items: [
          { name: "بسكويت شاي", price: 12 },
          { name: "بسكويت كريمة", price: 15 },
          { name: "ويفر", price: 10 },
          { name: "كيك", price: 8 },
          { name: "شيبسي", price: 10 },
          { name: "فشار", price: 12 },
          { name: "شوكولاتة", price: 15 }
        ]
      },
      {
        title: "🍬 الحلويات",
        items: [
          { name: "لبان", price: 5 },
          { name: "توفي", price: 5 },
          { name: "شوكولاتة بار", price: 20 },
          { name: "بسكويت شوكولاتة", price: 18 }
        ]
      },
      {
        title: "🥤 المشروبات",
        items: [
          { name: "مياه معدنية صغيرة", price: 5 },
          { name: "مياه معدنية كبيرة", price: 8 },
          { name: "كوكاكولا / بيبسي", price: 10 },
          { name: "عصير صغير", price: 8 },
          { name: "عصير 1 لتر", price: 25 },
          { name: "مياه غازية", price: 8 }
        ]
      },
      {
        title: "☕ المشروبات الساخنة",
        items: [
          { name: "شاي 40 فتلة", price: 35 },
          { name: "شاي 100 فتلة", price: 65 },
          { name: "قهوة سادة", price: 80 },
          { name: "نسكافيه صغير", price: 45 },
          { name: "كاكاو", price: 50 }
        ]
      },
      {
        title: "🧂 التوابل",
        items: [
          { name: "ملح", price: 6 },
          { name: "كمون", price: 10 },
          { name: "فلفل أسود", price: 12 },
          { name: "كركم", price: 10 },
          { name: "بهارات مشكلة", price: 12 },
          { name: "شطة", price: 10 }
        ]
      },
      {
        title: "🧼 المنظفات",
        items: [
          { name: "مسحوق غسيل 1 كجم", price: 45 },
          { name: "مسحوق غسيل أوتوماتيك", price: 80 },
          { name: "صابون أطباق", price: 15 },
          { name: "كلور", price: 12 },
          { name: "معطر أرضيات", price: 35 },
          { name: "صابون غسيل", price: 10 }
        ]
      },
      {
        title: "🧻 المنتجات الورقية",
        items: [
          { name: "مناديل 5 علب", price: 35 },
          { name: "ورق تواليت 4 رول", price: 30 },
          { name: "مناديل مطبخ", price: 25 }
        ]
      },
      {
        title: "🧴 العناية الشخصية",
        items: [
          { name: "شامبو", price: 60 },
          { name: "بلسم", price: 55 },
          { name: "صابون استحمام", price: 15 },
          { name: "معجون أسنان", price: 35 },
          { name: "فرشة أسنان", price: 20 },
          { name: "مزيل عرق", price: 70 }
        ]
      }
    ]
  },
    {
    id: 8,
    category: "مطاعم",
    whatsapp: "201117903253",
    name: "كشري حنين",
    isOpen: true,
    logo: "/Haneen.png",
    cover: "/Haneen.png",
    
    // --- البيانات التجارية الجديدة ---
    rating: 4.8,              // تقييم عالي لمحبي الكشري
    reviewCount: 210,          // عدد كبير من المقيّمين
    isTrending: true,         // الكشري دائماً مطلوب (تريند)
    deliveryTime: "15-30",    // أسرع وقت توصيل للطلبات الساخنة
    
    // مصفوفة العرض (تستخدم اللوجو كصورة مؤقتة)
    offers: [
      { 
        id: "off_ks1", 
        title: "عرض السوبر حنين", 
        description: "علبة كشري جامبو + لتر بيبسي بخصم خاص", 
        image: "/Haneen.png" // placeholder مؤقت للوجو
      }
    ],
    // ------------------------------------------------

    menuCategories: [
      {
        title: "🥣 ركن الكشري",
        items: [
          { name: "علبة كشري", price: 20 },
          { name: "علبة وسط", price: 30 },
          { name: "علبة كبيرة", price: 40 },
          { name: "علبة سبشيال", price: 45 },
          { name: "علبة عائلية", price: 50 }
        ]
      },
      {
        title: "🥩 كشري بالكبدة",
        items: [
          { name: "كشري بالكبدة", price: 50 },
          { name: "كشري بالكبدة دبل", price: 65 }
        ]
      },
      {
        title: "🥘 الطواجن والميكسات",
        items: [
          { name: "طاجن فراخ", price: 43 },
          { name: "طاجن لحمة", price: 37 },
          { name: "طاجن كبدة", price: 40 },
          { name: "الميكسات حسب الطلب", price: 0 }
        ]
      },
      {
        title: "🧀 طواجن الموتزاريلا",
        items: [
          { name: "طاجن موتزاريلا فراخ", price: 57 },
          { name: "طاجن موتزاريلا لحمة", price: 52 },
          { name: "طاجن موتزاريلا كبدة", price: 55 }
        ]
      },
      {
        title: "🌯 كريبات اللحوم",
        items: [
          { name: "كريب هوت دوج", price: 55 },
          { name: "كريب كبدة", price: 55 },
          { name: "كريب سجق", price: 55 },
          { name: "كريب كفتة", price: 55 },
          { name: "كريب برجر", price: 55 },
          { name: "كريب شاورما لحمة", price: 80 },
          { name: "كريب سلامي", price: 55 },
          { name: "كريب فيليه لحمة", price: 85 }
        ]
      },
      {
        title: "🍗 كريبات الفراخ والبطاطس",
        items: [
          { name: "كريب بطاطس", price: 35 },
          { name: "كريب بانية أطباق", price: 58 },
          { name: "كريب شيش", price: 68 },
          { name: "كريب بانية بيدم", price: 68 },
          { name: "كريب شاورما فراخ", price: 68 },
          { name: "كريب ستربس", price: 68 },
          { name: "كريب فاهيتا فراخ", price: 68 },
          { name: "كريب سوبر كرسبي", price: 68 }
        ]
      },
      {
        title: "🔄 ميكس كريبات",
        items: [
          { name: "كريب ميكس حنين (كرسبي-سوس-تورتيلا-مشروم)", price: 78 },
          { name: "كريب ميكس فراخ (كرسبي-سوس-فراخ)", price: 78 },
          { name: "كريب ميكس لحوم (هوت دوج-مفروم-سوس-كفتة)", price: 75 },
          { name: "كريب ميكس سوسيس (هوت دوج-موتزاريلا-تورتيلا-سوس)", price: 70 }
        ]
      },
      {
        title: "🧀 كريبات الجبن",
        items: [
          { name: "كريب موتزاريلا", price: 45 },
          { name: "كريب شيدر", price: 45 },
          { name: "كريب رومي", price: 45 },
          { name: "كريب كيري", price: 45 }
        ]
      },
      {
        title: "🍫 كريب حلو",
        items: [
          { name: "كريب نوتيلا", price: 40 },
          { name: "كريب هوموز", price: 40 },
          { name: "كريب بوريو", price: 40 },
          { name: "كريب ميكس (نوتيلا-فواكه-هوهوز)", price: 55 }
        ]
      },
      {
        title: "✨ جديد حنين",
        items: [
          { name: "طاجن برجر", price: 45 },
          { name: "طاجن سوسيس", price: 45 },
          { name: "طاجن سجق", price: 45 },
          { name: "طاجن شاورما دجاج بالخضار", price: 55 }
        ]
      },
      {
        title: "🍮 ركن الحلو",
        items: [
          { name: "أرز باللبن سادة", price: 15 }, // سعر تقديري
          { name: "أرز باللبن فرن", price: 18 }, // سعر تقديري
          { name: "كاستر", price: 15 },
          { name: "أم علي", price: 25 },
          { name: "أرز مكسرات", price: 25 },
          { name: "قشطوطة", price: 35 },
          { name: "ديسباسيتو سادة", price: 30 },
          { name: "ديسباسيتو لوتس", price: 40 },
          { name: "مدلع", price: 40 }
        ]
      },
      {
        title: "➕ إضافات ومشروبات",
        items: [
          { name: "إضافة لحمة", price: 30 },
          { name: "إضافة فراخ", price: 35 },
          { name: "إضافة جبنة", price: 20 },
          { name: "باكت بطاطس", price: 25 },
          { name: "تقليه (حمص-عدس-طحينة)", price: 7 },
          { name: "سلطة طماطم / طماطم مقلية", price: 7 },
          { name: "عيش توست", price: 8 },
          { name: "سلطة خضراء / خيار مخلل", price: 7 },
          { name: "سبيرو سباتس", price: 15 },
          { name: "مياه معدنية صغيرة", price: 7 }
        ]
      }
    ]
  },
    {
    id: 9,
    category: "مصنعات اللحوم",
    whatsapp: "201022947479", // تأكد من إضافة الرقم الصحيح
    name: "مصنعات اليُمن",
    isOpen: false,
    logo: "/Msn3atElyomn.png",
    cover: "/Msn3atElyomn.png",
    
    // --- البيانات التجارية الجديدة ---
    rating: 4.5,              
    reviewCount: 68,          
    isTrending: false,        
    deliveryTime: "30-60",    // وقت أطول قليلاً لضمان سلامة التبريد
    
    // مصفوفة العرض (تستخدم اللوجو كصورة مؤقتة)
    offers: [
      { 
        id: "off_ms1", 
        title: "تجهيزات الأسبوع", 
        description: "خصم 10% عند طلب أكثر من 3 كيلو من البرجر أو السجق", 
        image: "/Msn3atElyomn.png" // placeholder مؤقت للوجو
      }
    ],
    // ------------------------------------------------

    menuCategories: [
      {
        title: "🥩 منتجات اللحوم المصنعة",
        items: [
          { name: "برجر", price: 300 },
          { name: "عصب", price: 100 },
          { name: "سجق", price: 270 },
          { name: "حواوشي", price: 270 },
          { name: "كفتة", price: 300 },
          { name: "مفروم", price: 300 }
        ]
      }
    ]
  },

  {
    id: 10, 
    category: "مطاعم",
    name: "كبدة جملي (حسن صوان)",
    whatsapp: "01122947479",
    isOpen: true,
    logo: "/GamalyHSwan.png",
    cover: "/GamalyHSwan.png",
    
    // --- البيانات التجارية الجديدة ---
    rating: 4.9,              // تقييم ممتاز للطلب المخصوص
    reviewCount: 185,         // عدد كبير من محبي الكبدة الجملي
    isTrending: true,         // الأكل المخصوص دايماً تريند
    deliveryTime: "25-45",    
    
    // مصفوفة العرض (تستخدم اللوجو كصورة مؤقتة)
    offers: [
      { 
        id: "off_gs1", 
        title: "عرض الساندوتش الجامد", 
        description: "اطلب 5 ساندوتشات كبدة جملي واحصل على السادس مجاناً", 
        image: "/GamalyHSwan.png" // placeholder مؤقت للوجو
      }
    ],
    // ------------------------------------------------

    menuCategories: [
      {
        title: "🌯 ركن السندوتشات",
        items: [
          { name: "سندوتش كبدة جملي مشوحة", price: 45 },
          { name: "سندوتش كبدة جملي باللية", price: 50 },
          { name: "سندوتش مشكل (كبدة، قلب، كلوة)", price: 45 },
          { name: "سندوتش مخاصي جملي", price: 55 },
          { name: "سندوتش حلويات جملي", price: 40 }
        ]
      },
      {
        title: "⚖️ ركن الوزن والوجبات",
        items: [
          { name: "ربع كيلو كبدة جملي (صافي)", price: 110 },
          { name: "نصف كيلو كبدة جملي (صافي)", price: 210 },
          { name: "كيلو كبدة جملي (عائلي)", price: 400 },
          { name: "طاجن كبدة جملي بالبصل", price: 130 }
        ]
      },
      {
        title: "🌭 ركن الحواوشي والممبار",
        items: [
          { name: "رغيف حواوشي جملي مخصوص", price: 45 },
          { name: "رغيف حواوشي جملي (دبل جبنة)", price: 55 },
          { name: "طبق ممبار جملي (وسط)", price: 60 }
        ]
      },
      {
        title: "🥗 المقبلات والسلطات",
        items: [
          { name: "طبق بطاطس محمرة", price: 20 },
          { name: "طحينة بيضاء (كبير)", price: 10 },
          { name: "سلطة خضراء بلدي", price: 10 },
          { name: "باذنجان مخلل بالدقة", price: 15 },
          { name: "مخلل مشكل", price: 7 }
        ]
      },
      {
        title: "🥤 المشروبات",
        items: [
          { name: "مياه معدنية (صغيرة)", price: 7 },
          { name: "كانز بيبسي / كوكاكولا", price: 15 }
        ]
      }
    ]
  },

  {
    id: 11,
    category: "مطاعم",
    whatsapp: "201122947479",
    name: "كشري الزعيم",
    isOpen: true,
    logo: "/Elza3im.png",
    cover: "/Elza3im.png",
    
    // --- البيانات التجارية الجديدة ---
    rating: 4.7,              
    reviewCount: 320,         // الكشري دايماً عليه إقبال وتفاعل عالي
    isTrending: true,         
    deliveryTime: "15-30",    
    
    // مصفوفة العرض (تستخدم اللوجو كصورة مؤقتة)
    offers: [
      { 
        id: "off_z1", 
        title: "عرض الزعيم المخصوص", 
        description: "علبة كشري عائلي + 2 طبق رز بلبن هدية", 
        image: "/Elza3im.png" // placeholder مؤقت للوجو
      }
    ],
    // ------------------------------------------------

    menuCategories: [
      {
        title: "🥣 ركن الكشري",
        items: [
          { name: "علبة كشري", price: 20 },
          { name: "علبة وسط", price: 30 },
          { name: "علبة كبيرة", price: 40 },
          { name: "علبة سبشيال", price: 45 },
          { name: "علبة عائلية", price: 50 }
        ]
      },
      {
        title: "🥩 كشري بالكبدة",
        items: [
          { name: "كشري بالكبدة", price: 50 },
          { name: "كشري بالكبدة دبل", price: 65 }
        ]
      },
      {
        title: "🥘 الطواجن والميكسات",
        items: [
          { name: "طاجن فراخ", price: 43 },
          { name: "طاجن لحمة", price: 37 },
          { name: "طاجن كبدة", price: 40 },
          { name: "الميكسات حسب الطلب", price: 0 }
        ]
      },
      {
        title: "🧀 طواجن الموتزاريلا",
        items: [
          { name: "طاجن موتزاريلا فراخ", price: 57 },
          { name: "طاجن موتزاريلا لحمة", price: 52 },
          { name: "طاجن موتزاريلا كبدة", price: 55 }
        ]
      },
      {
        title: "🌯 كريبات اللحوم",
        items: [
          { name: "كريب هوت دوج", price: 55 },
          { name: "كريب كبدة", price: 55 },
          { name: "كريب سجق", price: 55 },
          { name: "كريب كفتة", price: 55 },
          { name: "كريب برجر", price: 55 },
          { name: "كريب شاورما لحمة", price: 80 },
          { name: "كريب سلامي", price: 55 },
          { name: "كريب فيليه لحمة", price: 85 }
        ]
      },
      {
        title: "🍗 كريبات الفراخ والبطاطس",
        items: [
          { name: "كريب بطاطس", price: 35 },
          { name: "كريب بانية أطباق", price: 58 },
          { name: "كريب شيش", price: 68 },
          { name: "كريب بانية بيدم", price: 68 },
          { name: "كريب شاورما فراخ", price: 68 },
          { name: "كريب ستربس", price: 68 },
          { name: "كريب فاهيتا فراخ", price: 68 },
          { name: "كريب سوبر كرسبي", price: 68 }
        ]
      },
      {
        title: "🔄 ميكس كريبات",
        items: [
          { name: "كريب ميكس حنين (كرسبي-سوس-تورتيلا-مشروم)", price: 78 },
          { name: "كريب ميكس فراخ (كرسبي-سوس-فراخ)", price: 78 },
          { name: "كريب ميكس لحوم (هوت دوج-مفروم-سوس-كفتة)", price: 75 },
          { name: "كريب ميكس سوسيس (هوت دوج-موتزاريلا-تورتيلا-سوس)", price: 70 }
        ]
      },
      {
        title: "🧀 كريبات الجبن",
        items: [
          { name: "كريب موتزاريلا", price: 45 },
          { name: "كريب شيدر", price: 45 },
          { name: "كريب رومي", price: 45 },
          { name: "كريب كيري", price: 45 }
        ]
      },
      {
        title: "🍫 كريب حلو",
        items: [
          { name: "كريب نوتيلا", price: 40 },
          { name: "كريب هوموز", price: 40 },
          { name: "كريب بوريو", price: 40 },
          { name: "كريب ميكس (نوتيلا-فواكه-هوهوز)", price: 55 }
        ]
      },
      {
        title: "✨ جديد حنين",
        items: [
          { name: "طاجن برجر", price: 45 },
          { name: "طاجن سوسيس", price: 45 },
          { name: "طاجن سجق", price: 45 },
          { name: "طاجن شاورما دجاج بالخضار", price: 55 }
        ]
      },
      {
        title: "🍮 ركن الحلو",
        items: [
          { name: "أرز باللبن سادة", price: 15 }, // سعر تقديري
          { name: "أرز باللبن فرن", price: 18 }, // سعر تقديري
          { name: "كاستر", price: 15 },
          { name: "أم علي", price: 25 },
          { name: "أرز مكسرات", price: 25 },
          { name: "قشطوطة", price: 35 },
          { name: "ديسباسيتو سادة", price: 30 },
          { name: "ديسباسيتو لوتس", price: 40 },
          { name: "مدلع", price: 40 }
        ]
      },
      {
        title: "➕ إضافات ومشروبات",
        items: [
          { name: "إضافة لحمة", price: 30 },
          { name: "إضافة فراخ", price: 35 },
          { name: "إضافة جبنة", price: 20 },
          { name: "باكت بطاطس", price: 25 },
          { name: "تقليه (حمص-عدس-طحينة)", price: 7 },
          { name: "سلطة طماطم / طماطم مقلية", price: 7 },
          { name: "عيش توست", price: 8 },
          { name: "سلطة خضراء / خيار مخلل", price: 7 },
          { name: "سبيرو سباتس", price: 15 },
          { name: "مياه معدنية صغيرة", price: 7 }
        ]
      }
    ]
  },
  {
    id: 12, 
    category: "صيدليات",
    whatsapp: "201092293348",
    name: "صيدلية شاهندا",
    isOpen: true,
    logo: "/Shahinda.png",
    cover: "/Shahinda.png",
    
    // --- البيانات التجارية الجديدة ---
    rating: 4.8,              
    reviewCount: 74,          
    isTrending: false,        
    deliveryTime: "15-25",    // توصيل سريع للأدوية والحالات العاجلة
    
    // مصفوفة العرض (تستخدم اللوجو كصورة مؤقتة)
    offers: [
      { 
        id: "off_sh1", 
        title: "عرض العناية بالأم والطفل", 
        description: "خصومات خاصة على منتجات حديثي الولادة ومستحضرات التجميل", 
        image: "/Shahinda.png" // placeholder مؤقت للوجو
      }
    ],
    // ------------------------------------------------

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
  }

  // ... باقي المتاجر
];

export default shops;