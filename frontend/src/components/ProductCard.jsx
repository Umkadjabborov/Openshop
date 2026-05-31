import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart, onWishlist, isWishlisted }) {
  const navigate = useNavigate();
  const mainImage = product.images?.find((img) => img.is_main)?.image_url || '/placeholder.png';

  const handleAddCart = () => {
    onAddToCart(product);
  };

  const ratingAvg = typeof product.rating_avg === 'number' ? product.rating_avg : Number(product.rating_avg);
  const ratingText = Number.isFinite(ratingAvg) ? ratingAvg.toFixed(1) : '0.0';

  return (
    <div className="pc" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="pc-img-wrap">
        <img src={mainImage} alt={product.name_uz} className="pc-img" />
        <div className="pc-badge">
          {product.discount_pct > 0 && (
            <span className="badge-d">-{product.discount_pct}%</span>
          )}
          {product.is_new && <span className="badge-n">NEW</span>}
        </div>
        <button
          className={`pc-wish ${isWishlisted ? 'on' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onWishlist(product.id);
          }}
          title="Saralanganlar"
        >
          ❤️
        </button>
      </div>
      <div className="pc-body">
        <div className="pc-brand">{product.brand_id || 'Brand'}</div>
        <h3 className="pc-name">{product.name_uz}</h3>
        <div className="pc-stars">
          <span>⭐ {ratingText}</span>
          <span>({product.rating_count || 0})</span>
        </div>
        <div className="pc-price-row">
          <span className="pc-price">
            {Number(product.price).toLocaleString('uz-UZ')} so'm
          </span>
          {product.old_price && (
            <span className="pc-old">
              {Number(product.old_price).toLocaleString('uz-UZ')}
            </span>
          )}
        </div>
        <button className="pc-cart" onClick={handleAddCart}>
          🛒 Savat
        </button>
      </div>
    </div>
  );
}
