"use client"; // أهم سطر لحل الـ Error اللي ظهرلك

export default function Contact() {
  const MAIN_PHONE = "201122947479"; // رقمك اللي اتفقنا عليه

  return (
    <div dir="rtl" style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '30px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '80px' }} />
        <h2 style={{ color: '#FF6600' }}>مركز خدمة عملاء ميني طلبات</h2>
      </header>

      <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>لأي استفسار أو مشكلة فنية، إحنا معاك على مدار الساعة.</p>
        
        <button 
          onClick={() => window.open(`https://wa.me/${MAIN_PHONE}`, '_blank')}
          style={{ 
            width: '100%', 
            padding: '15px', 
            backgroundColor: '#25D366', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '12px', 
            fontWeight: 'bold', 
            fontSize: '18px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          تواصل معنا عبر واتساب ✅
        </button>
        
        <p style={{ color: '#888', fontSize: '14px' }}>الرقم: 01122947479</p>
      </div>

      <button 
        onClick={() => window.history.back()} 
        style={{ marginTop: '30px', background: 'none', border: 'none', color: '#FF6600', textDecoration: 'underline', cursor: 'pointer' }}
      >
        العودة للرئيسية
      </button>
    </div>
  );
}
