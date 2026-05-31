import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { useAuthStore } from '../../store/authStore'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

type LoginData = z.infer<typeof schema>

export default function LoginPage(){
  const navigate = useNavigate()
  const setAdmin = useAuthStore(s => s.setAdmin)
  const setToken = useAuthStore(s => s.setToken)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit } = useForm<LoginData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/admin/login', data)
      const { token, admin } = res.data
      localStorage.setItem('admin_token', token)
      setToken(token)
      setAdmin(admin)
      navigate('/admin/dashboard')
    } catch (err:any) {
      setError(err?.response?.data?.error || 'Kirishda xato')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 bg-gradient-to-br from-primary to-orange-400 text-white">
          <h2 className="text-3xl font-bold mb-4">OpenShop Admin</h2>
          <p className="mb-6">Admin panelga xush kelibsiz. Iltimos, email va parolingiz bilan kiring.</p>
          <div className="bg-white/10 p-4 rounded">
            <div className="text-sm">Test admin:</div>
            <div className="font-semibold">admin@openshop.uz</div>
            <div className="font-semibold">admin123</div>
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-xl font-bold mb-4">Kirish</h3>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input className="w-full border rounded px-3 py-2" placeholder="admin@openshop.uz" {...register('email')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Parol</label>
              <input type="password" className="w-full border rounded px-3 py-2" {...register('password')} />
            </div>
            <div>
              <button className="w-full py-3 rounded bg-primary text-white font-bold" type="submit" disabled={loading}>
                {loading ? 'Yuklanmoqda...' : 'Kirish'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
