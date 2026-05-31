import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AdminLayout(){
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          <div className="container bg-transparent">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
