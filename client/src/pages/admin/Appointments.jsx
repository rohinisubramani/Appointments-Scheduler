import React, { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function AdminAppointments() {
  const [list, setList] = useState([])
  async function load() {
    const data = await api('/admin/appointments', { auth: true })
    setList(data)
  }
  useEffect(()=>{ load() }, [])
  async function approve(id) {
    await api('/admin/appointments/' + id + '/approve', { method: 'POST', auth: true })
    await load()
  }
  async function cancel(id) {
    await api('/admin/appointments/' + id + '/cancel', { method: 'POST', auth: true })
    await load()
  }
  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">All Appointments</div>
      <div className="grid gap-3">
        {list.map(a => (
          <div className="card" key={a.id}>
            <div className="flex justify-between">
              <div>
                <div>Token {a.tokenNumber}</div>
                <div>{a.user.name}</div>
                <div>{new Date(a.date).toLocaleDateString()} {new Date(a.time).toLocaleTimeString()}</div>
                <div className="text-sm text-gray-500">{a.status}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={()=>approve(a.id)}>Approve</button>
                <button className="btn" onClick={()=>cancel(a.id)}>Cancel</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
