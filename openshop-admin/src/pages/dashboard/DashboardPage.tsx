import React from 'react'
import PageHeader from '../../components/layout/PageHeader'

export default function DashboardPage(){
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Asosiy ko'rsatkichlar" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">Bugungi daromad<br/><strong>0 so'm</strong></div>
        <div className="p-4 bg-white rounded shadow">Bugungi buyurtmalar<br/><strong>0</strong></div>
        <div className="p-4 bg-white rounded shadow">Jami foydalanuvchilar<br/><strong>0</strong></div>
        <div className="p-4 bg-white rounded shadow">Aktiv mahsulotlar<br/><strong>0</strong></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-4 bg-white rounded shadow">Daromad grafigi (joylashtirish uchun Recharts)</div>
        <div className="p-4 bg-white rounded shadow">Buyurtma holatlari (Pie)</div>
      </div>
    </div>
  )
}
