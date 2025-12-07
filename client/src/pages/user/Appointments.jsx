import React, { useEffect, useState } from 'react'
import { api, downloadBill } from '../../api.js'

export default function Appointments() {
  const [list, setList] = useState([])
  const [error, setError] = useState('')

  async function load() {
    try {
      const data = await api('/appointments', { auth: true })
      setList(data)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { load() }, [])

  async function update(id, date, time) {
    try {
      await api('/appointments/' + id, { method: 'PUT', auth: true, body: { date, time } })
      await load()
    } catch (e) { alert(e.message) }
  }

  async function cancel(id) {
    try {
      await api('/appointments/' + id, { method: 'DELETE', auth: true })
      await load()
    } catch (e) { alert(e.message) }
  }

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">My Appointments</div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid gap-3">
        {list.map(a => (
          <div className="card" key={a.id}>
            <div className="flex justify-between">
              <div>
                <div>Token {a.tokenNumber}</div>
                <div>{new Date(a.date).toLocaleDateString()} {new Date(a.time).toLocaleTimeString()}</div>
                <div className="text-sm text-gray-500">{a.status}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={()=>downloadBill(a.id)}>Bill</button>
                <button className="btn" onClick={()=>{
                  const d = prompt('New date-time (YYYY-MM-DDTHH:MM)')
                  const t = prompt('New time (HH:MM)')
                  if (d && t) update(a.id, d, t)
                }}>Edit</button>
                <button className="btn" onClick={()=>cancel(a.id)}>Cancel</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
