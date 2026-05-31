import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  loading,
  onAddToCart,
  onWishlist,
  wishlist,
}) {
  if (loading) {
    return <div className="prod-grid" style={{ padding: '40px' }}>Загружается...</div>;
  }

  if (products.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Mahsulotlar topilmadi
      </div>
    );
  }

  return (
    <div className="prod-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onWishlist={onWishlist}
          isWishlisted={wishlist.includes(product.id)}
        />
      ))}
    </div>
  );
}
