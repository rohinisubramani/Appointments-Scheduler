import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()
  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email, password } })
      login(data)
      if (data.user.role === 'ADMIN') nav('/admin')
      else nav('/user/book')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="card w-full max-w-md">
        <div className="text-2xl font-semibold mb-4">Welcome back</div>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn w-full" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
        </form>
        <div className="mt-3 text-sm">No account? <Link className="text-primary" to="/register">Register</Link></div>
      </div>
    </div>
  )
}
