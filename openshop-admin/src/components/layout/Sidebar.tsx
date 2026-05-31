import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/products', label: 'Mahsulotlar', icon: '📦' },
  { to: '/admin/categories', label: 'Kategoriyalar', icon: '📂' },
  { to: '/admin/brands', label: 'Brendlar', icon: '🏷️' },
  { to: '/admin/orders', label: 'Buyurtmalar', icon: '🛒' },
  { to: '/admin/users', label: 'Foydalanuvchilar', icon: '👥' },
  { to: '/admin/reviews', label: 'Sharhlar', icon: '⭐' },
  { to: '/admin/coupons', label: 'Kuponlar', icon: '🎟️' },
  { to: '/admin/banners', label: 'Bannerlar', icon: '🖼️' },
  { to: '/admin/settings', label: 'Sozlamalar', icon: '⚙️' },
]

export default function Sidebar(){
  return (
    <aside className="w-64 bg-secondary text-cool-gray-100 min-h-screen hidden md:block">
      <div className="p-6 text-white font-bold text-lg">OpenShop ADMIN</div>
      <nav className="p-4">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => `flex items-center gap-3 p-3 rounded-md mb-1 text-sm ${isActive ? 'bg-white/10 text-primary' : 'text-gray-200 hover:bg-white/5'}`}>
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-6 text-white">
        <div className="text-sm">Admin User</div>
        <button className="mt-3 text-sm bg-white/5 px-3 py-2 rounded">Chiqish</button>
      </div>
    </aside>
  )
}
