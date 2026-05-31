import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import AdminLayout from './components/layout/AdminLayout'
import PrivateRoute from './components/PrivateRoute'

export default function App(){
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage/>} />
      <Route path="/admin" element={<PrivateRoute><AdminLayout/></PrivateRoute>}>
        <Route index element={<Navigate to="dashboard" replace/>} />
        <Route path="dashboard" element={<DashboardPage/>} />
        {/* other admin routes will be nested here */}
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace/>} />
      <Route path="*" element={<div className="container">Sahifa topilmadi. <a href="/admin">Dashboard ga qaytish</a></div>} />
    </Routes>
  )
}
