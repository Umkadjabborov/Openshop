import React from 'react'

export default function PageHeader({ title, subtitle }:{title:string, subtitle?:string}){
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
    </div>
  )
}
