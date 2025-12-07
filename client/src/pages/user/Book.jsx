import React, { useEffect, useState } from 'react'
import { api } from '../../api.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Book() {
  const { user } = useAuth()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [amount, setAmount] = useState('0')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setMsg('')
    setError('')
    try {
      const appt = await api('/appointments', { method: 'POST', auth: true, body: { date, time, amount: Number(amount) } })
      setMsg('Booked. Token ' + appt.tokenNumber)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Book Appointment</div>
      {msg && <div className="text-green-600">{msg}</div>}
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl">
        <input className="input" type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} />
        <input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)} />
        <input className="input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" />
        <button className="btn md:col-span-3">Book</button>
      </form>
    </div>
  )
}
