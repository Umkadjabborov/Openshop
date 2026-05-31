import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function TopBar(){
  const admin = useAuthStore(state => state.admin)
  const setAdmin = useAuthStore(state => state.setAdmin)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('admin_token')
    setAdmin(null)
    navigate('/admin/login')
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white shadow">
      <div className="text-sm text-gray-600">Admin panel</div>
      <div className="flex items-center gap-4">
        <div className="text-sm">{admin?.name || 'Administrator'}</div>
        <button onClick={logout} className="text-sm text-red-600">Chiqish</button>
      </div>
    </header>
  )
}
