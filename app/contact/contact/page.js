export default function Contact() {
  return (
    <div dir="rtl" style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ color: '#FF6600' }}>تواصل معنا 📞</h2>
      <p>للدعم الفني أو الاستفسارات، كلمنا على:</p>
      <a href="https://wa.me/201122947479" style={{ display: 'block', padding: '15px', backgroundColor: '#25D366', color: '#fff', textDecoration: 'none', borderRadius: '10px', fontWeight: 'bold', margin: '20px 0' }}>
        واتساب: 01122947479
      </a>
      <button onClick={() => window.history.back()} style={{ border: 'none', background: 'none', color: '#666' }}>العودة للخلف</button>
    </div>
  );
}
