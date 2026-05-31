import { useNavigate } from 'react-router-dom';

export default function CartPage({ cart, onUpdateCart, onRemoveFromCart }) {
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleQuantityChange = (productId, newQty) => {
    if (newQty > 0) {
      onUpdateCart(productId, newQty);
    }
  };

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      const payload = {
        items: cart.map((c) => ({ id: c.id, quantity: c.quantity, unit_price: c.price, name_uz: c.name_uz })),
      };
      const { api } = await import('../api');
      await api.createOrder(payload);
      // simple success
      alert('Buyurtma qabul qilindi');
      // redirect home
      navigate('/');
    } catch (err) {
      alert('Buyurtma berishda xato: ' + err.message);
    }
  };

  return (
    <div className="wrap" style={{ padding: '24px 0' }}>
      <button
        style={{
          background: '#fff',
          border: '1px solid var(--border)',
          padding: '10px 16px',
          borderRadius: 'var(--r)',
          marginBottom: '24px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        ← Orqaga
      </button>

      {cart.length === 0 ? (
        <div
          style={{
            background: '#fff',
            borderRadius: 'var(--r2)',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
            Savat bo'sh 🛒
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 24px',
              background: 'var(--red)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--r)',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Xarid qilishni davom ettirish
          </button>
        </div>
      ) : (
        <>
          <div className="cart-body">
            {cart.map((item) => (
              <div key={item.id} className="cart-row">
                <img
                  src={item.images?.[0]?.image_url || '/placeholder.png'}
                  alt={item.name_uz}
                />
                <div style={{ flex: 1 }}>
                  <div className="cart-title">{item.name_uz}</div>
                  <div className="cart-value">
                    {Number(item.price).toLocaleString('uz-UZ')} so'm
                  </div>
                </div>
                <div className="cart-counter">
                  <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <div style={{ marginLeft: '16px', fontWeight: '700' }}>
                  {(Number(item.price) * item.quantity).toLocaleString('uz-UZ')} so'm
                </div>
                <button
                  className="cart-remove"
                  onClick={() => onRemoveFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              marginTop: '24px',
              padding: '16px',
              background: '#fff',
              borderRadius: 'var(--r2)',
            }}
          >
            <div>
              <div style={{ fontSize: '.9rem', color: 'var(--muted)' }}>
                Jami narx:
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--red)' }}>
                {total.toLocaleString('uz-UZ')} so'm
              </div>
            </div>
            <button className="order-btn" onClick={handleOrder}>Buyurtma berish</button>
          </div>
        </>
      )}
    </div>
  );
}
