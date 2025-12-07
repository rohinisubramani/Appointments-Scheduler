import React, { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function Slots() {
  const [list, setList] = useState([])
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [available, setAvailable] = useState(true)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const data = await api('/admin/slots', { auth: true })
    setList(data)
  }
  useEffect(()=>{ load() }, [])

  async function add() {
    setMsg(''); setError('')
    try {
      await api('/admin/slots', { method: 'POST', auth: true, body: { date, startTime, endTime, available } })
      setDate(''); setStartTime(''); setEndTime(''); setAvailable(true)
      setMsg('Slot added')
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  async function toggle(id, avail) {
    await api('/admin/slots/' + id, { method: 'PUT', auth: true, body: { available: !avail } })
    await load()
  }

  async function del(id) {
    await api('/admin/slots/' + id, { method: 'DELETE', auth: true })
    await load()
  }

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Manage Slots</div>
      {msg && <div className="text-green-600">{msg}</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="text-sm text-gray-600">Date</label>
            <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Start</label>
            <input className="input" type="datetime-local" value={startTime} onChange={e=>setStartTime(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">End</label>
            <input className="input" type="datetime-local" value={endTime} onChange={e=>setEndTime(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input id="avail" type="checkbox" checked={available} onChange={e=>setAvailable(e.target.checked)} />
            <label htmlFor="avail" className="text-sm">Available</label>
          </div>
          <button className="btn" onClick={add}>Add Slot</button>
        </div>
      </div>
      <div className="grid gap-3">
        {list.map(s => (
          <div className="card" key={s.id}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{new Date(s.date).toLocaleDateString()}</div>
                <div>{new Date(s.startTime).toLocaleTimeString()} - {new Date(s.endTime).toLocaleTimeString()}</div>
                <div className="text-sm">{s.available ? 'Available' : 'Unavailable'}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={()=>toggle(s.id, s.available)}>{s.available ? 'Mark Unavailable' : 'Mark Available'}</button>
                <button className="btn" onClick={()=>del(s.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
