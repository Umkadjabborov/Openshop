export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h3 className="footer-title">OPENSHOP</h3>
            <p style={{ fontSize: '.85rem', lineHeight: '1.8', marginBottom: '16px' }}>
              Eng katta onlayn savdo bozori. Sifatli mahsulotlar, tez yetkazish va
              qulay narxlar.
            </p>
            <div className="social-row">
              <button className="social-btn" title="Instagram">
                📷
              </button>
              <button className="social-btn" title="Facebook">
                👍
              </button>
              <button className="social-btn" title="Telegram">
                ✈️
              </button>
            </div>
          </div>

          <div>
            <h3 className="footer-title">NAVIGATSIYA</h3>
            <ul className="footer-links">
              <li>
                <a href="/">Bosh sahifa</a>
              </li>
              <li>
                <a href="/">Katalog</a>
              </li>
              <li>
                <a href="/">Saralanganlar</a>
              </li>
              <li>
                <a href="/">Savat</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">YORDAM</h3>
            <ul className="footer-links">
              <li>
                <a href="/">Biz haqida</a>
              </li>
              <li>
                <a href="/">Aloqa</a>
              </li>
              <li>
                <a href="/">Qaytarish shartlari</a>
              </li>
              <li>
                <a href="/">Xavfsizlik</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">HISOB</h3>
            <ul className="footer-links">
              <li>
                <a href="/">Kirish</a>
              </li>
              <li>
                <a href="/">Ro'yxatdan o'tish</a>
              </li>
              <li>
                <a href="/">Shaxsiy ma'lumotlar</a>
              </li>
              <li>
                <a href="/">Buyurtmalar</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">ALOQA</h3>
            <div className="footer-contact">
              <p>
                📞 <a href="tel:+998901234567">+998 (90) 123-45-67</a>
              </p>
              <p>
                📧{' '}
                <a href="mailto:info@openshop.uz">
                  info@openshop.uz
                </a>
              </p>
              <p>📍 Tashkent, Uzbekistan</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ fontSize: '.8rem' }}>
            © 2026 OpenShop. Barcha huquqlar himoyalangan.
          </p>
          <div className="footer-payments">
            <span className="pay-badge">💳 VISA</span>
            <span className="pay-badge">💳 Mastercard</span>
            <span className="pay-badge">📱 Click</span>
            <span className="pay-badge">📱 Payme</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
