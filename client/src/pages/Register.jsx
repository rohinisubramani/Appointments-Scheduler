import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api.js'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const nav = useNavigate()
  async function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await api('/auth/register', { method: 'POST', body: { name, email, phone, password } })
      setSuccess('Registered. You can login now.')
      setTimeout(()=>nav('/login'), 800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="card w-full max-w-md">
        <div className="text-2xl font-semibold mb-4">Create your account</div>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        {success && <div className="text-green-600 mb-3">{success}</div>}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input className="input" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn w-full" disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
        </form>
        <div className="mt-3 text-sm">Have an account? <Link className="text-primary" to="/login">Login</Link></div>
      </div>
    </div>
  )
}
