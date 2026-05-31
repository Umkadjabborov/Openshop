import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Toast from '../components/Toast';

export default function ProductDetail({ onAddToCart, onWishlist, wishlist, toast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="wrap detail-page">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          Загружается...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="wrap detail-page">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          Mahsulot topilmadi
        </div>
      </div>
    );
  }

  const mainImage = product.images?.[selectedImageIdx]?.image_url || product.images?.[0]?.image_url || '/placeholder.png';
  const ratingAvg = typeof product.rating_avg === 'number' ? product.rating_avg : Number(product.rating_avg);
  const ratingText = Number.isFinite(ratingAvg) ? ratingAvg.toFixed(1) : '0.0';
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="wrap detail-page">
      <button className="detail-back" onClick={() => navigate('/')}>
        ← Orqaga
      </button>

      <div className="detail-grid">
        <div>
          <div className="detail-image">
            <img src={mainImage} alt={product.name_uz} />
          </div>
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.image_url}
                  alt={`img-${idx}`}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    cursor: 'pointer',
                    border:
                      idx === selectedImageIdx
                        ? '2px solid var(--red)'
                        : '2px solid var(--border)',
                    borderRadius: 'var(--r)',
                    padding: '4px',
                  }}
                  onClick={() => setSelectedImageIdx(idx)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <div>
            {product.discount_pct > 0 && (
              <span className="detail-badge">-{product.discount_pct}% chegirma</span>
            )}
            {product.is_new && (
              <span
                className="detail-badge"
                style={{ background: 'var(--green)', marginLeft: '8px' }}
              >
                YANGI
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '1.6rem', margin: '16px 0' }}>
            {product.name_uz}
          </h1>

          <div className="detail-rating">
            <span>⭐ {ratingText}</span>
            <span>({product.rating_count || 0} sharhlar)</span>
          </div>

          <div className="detail-price-row">
            <strong>{Number(product.price).toLocaleString('uz-UZ')} so'm</strong>
            {product.old_price && (
              <span>{Number(product.old_price).toLocaleString('uz-UZ')}</span>
            )}
          </div>

          <div className="detail-meta">
            <p>📦 Soni: <strong>{product.stock_qty} dona</strong></p>
            <p>🔖 SKU: <strong>{product.sku}</strong></p>
            <p>📅 Kafolat: <strong>{product.warranty_months} oy</strong></p>
          </div>

          <div className="detail-description">
            {product.description_uz || 'Tavsif mavjud emas'}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px',
            }}
          >
            <button
              style={{
                flex: 1,
                padding: '14px',
                background: 'var(--red)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--r)',
                fontWeight: '800',
                fontSize: '.95rem',
                cursor: 'pointer',
              }}
              onClick={() => onAddToCart(product)}
            >
              🛒 Savatga qo'shish
            </button>
            <button
              style={{
                padding: '14px 20px',
                background: isWishlisted ? 'var(--red-light)' : '#fff',
                border: '2px solid var(--border)',
                borderRadius: 'var(--r)',
                fontWeight: '800',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: isWishlisted ? 'var(--red)' : '#000',
              }}
              onClick={() => onWishlist(product.id)}
              title="Saralanganlar"
            >
              ❤️
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}
