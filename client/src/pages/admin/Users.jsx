import React, { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function Users() {
  const [list, setList] = useState([])
  async function load() {
    const data = await api('/admin/users', { auth: true })
    setList(data)
  }
  useEffect(()=>{ load() }, [])
  async function block(id) {
    await api('/admin/users/' + id + '/block', { method: 'POST', auth: true })
    await load()
  }
  async function unblock(id) {
    await api('/admin/users/' + id + '/unblock', { method: 'POST', auth: true })
    await load()
  }
  async function del(id) {
    await api('/admin/users/' + id, { method: 'DELETE', auth: true })
    await load()
  }
  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Users</div>
      <div className="grid gap-3">
        {list.map(u => (
          <div className="card" key={u.id}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email} • {u.phone}</div>
                <div className="text-sm">Total {u.totalAppointments} • {u.status}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={()=>block(u.id)}>Block</button>
                <button className="btn" onClick={()=>unblock(u.id)}>Unblock</button>
                <button className="btn" onClick={()=>del(u.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
