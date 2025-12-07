import React, { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function Overview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  async function load() {
    try {
      const d = await api('/admin/overview', { auth: true })
      setData(d)
    } catch (e) { setError(e.message) }
  }
  useEffect(() => { load() }, [])
  if (error) return <div className="text-red-600">{error}</div>
  if (!data) return <div>Loading...</div>
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        {label:'Today\'s Appointments', value:data.todays},
        {label:'Total Appointments', value:data.total},
        {label:'Pending', value:data.pending},
        {label:'Cancelled', value:data.cancelled},
        {label:'Users', value:data.users},
        {label:'Upcoming Slots', value:data.upcomingSlots},
      ].map((c,i)=> (
        <div className="card" key={i}>
          <div className="text-gray-500">{c.label}</div>
          <div className="text-4xl font-semibold text-primary">{c.value}</div>
        </div>
      ))}
    </div>
  )
}
