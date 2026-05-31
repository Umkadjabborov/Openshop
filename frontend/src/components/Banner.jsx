import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BANNERS = [
  {
    id: 1,
    title: 'iPhone 15 Pro',
    subtitle: 'Eng yangi texnologiya',
    tag: 'SOTUVDA',
    price: '12,999,000',
    oldPrice: '14,500,000',
    className: 'b1',
    productId: '88e72822-5338-41ac-a16f-f9df70b33d96',
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24',
    subtitle: 'Kuchli va tez',
    tag: 'YANGI',
    price: '11,499,000',
    oldPrice: '12,999,000',
    className: 'b2',
    productId: '958aa194-eee3-41c8-91f2-9cd5452fe86a',
  },
  {
    id: 3,
    title: 'MacBook Air M2',
    subtitle: 'Ko\'chma kompyuter',
    tag: 'CHEGIRMA',
    price: '16,490,000',
    oldPrice: '18,000,000',
    className: 'b3',
    productId: 'fe2573a1-e033-4991-97d7-7da59c04040d',
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const banner = BANNERS[current];

  return (
    <div className="banner-section">
      <div className="banner-slider">
        <div
          className="banner-track"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {BANNERS.map((b) => (
            <div key={b.id} className={`banner-slide ${b.className}`}>
              <div className="banner-content">
                <span className="banner-tag">{b.tag}</span>
                <h2 className="banner-title">{b.title}</h2>
                <p className="banner-sub">{b.subtitle}</p>
                <div>
                  <div className="banner-price">{b.price} so'm</div>
                  <div className="banner-old">{b.oldPrice} so'm</div>
                </div>
                <button
                  className="banner-btn"
                  onClick={() => navigate(`/product/${b.productId}`)}
                >
                  Batafsil →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="banner-dots">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              className={`bdot ${idx === current ? 'on' : ''}`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>

        <button
          className="banner-arrow ba-prev"
          onClick={() => setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
        >
          ❮
        </button>
        <button
          className="banner-arrow ba-next"
          onClick={() => setCurrent((prev) => (prev + 1) % BANNERS.length)}
        >
          ❯
        </button>
      </div>
    </div>
  );
}
