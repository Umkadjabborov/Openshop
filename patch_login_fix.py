file = r'c:\Users\user\Desktop\Oppen shop 2\src\App.jsx'
with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. API_BASE ni proxy uchun bo'sh qoldirish
content = content.replace(
    "const API_BASE = import.meta.env.VITE_API_BASE || '';",
    "const API_BASE = '';"
)

# 2. Eski LoginPage ni yangi bilan almashtirish
old_login_start = "function LoginPage({ onLogin }) {\n  const [method, setMethod] = useState('admin');"
old_login_end = "        <button type=\"button\" className=\"auth-link\" onClick={() => navigate('/register')}>Ro'yxatdan o'tish</button>\n      </div>\n    </main>\n  );\n}\n\nfunction RegisterPage"

# Eski login boshidan RegisterPage gacha topamiz
idx_start = content.find(old_login_start)
idx_end = content.find('\nfunction RegisterPage')

if idx_start != -1 and idx_end != -1:
    new_login = """function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await onLogin(email.trim(), password.trim());
    setLoading(false);
    if (result.success) {
      navigate(result.role === 'admin' ? '/dashboard' : '/');
    } else {
      setError(result.error || "Email yoki parol noto'g'ri.");
    }
  }

  return (
    <main className="wrap auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Kirish</h1>
          <p>Email va parolingiz bilan tizimga kiring.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label>
            Parol
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          {error ? <div className="auth-error">{error}</div> : null}
          <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Tekshirilmoqda...' : 'Kirish'}</button>
        </form>
        <div className="auth-note">
          <p><strong>Admin kirish:</strong> admin@example.com / Admin123</p>
        </div>
        <button type="button" className="auth-link" onClick={() => navigate('/register')}>Ro'yxatdan o'tish</button>
      </div>
    </main>
  );
}
"""
    content = content[:idx_start] + new_login + content[idx_end:]

with open(file, 'w', encoding='utf-8') as f:
    f.write(content)

import sys
c2 = open(file, encoding='utf-8').read()
sys.stdout.write(
    'API_BASE empty:' + str("const API_BASE = '';" in c2) +
    ' LoginPage new:' + str('Tekshirilmoqda' in c2) +
    ' old presets:' + str('presets' in c2[:c2.find('function RegisterPage')])
)
