import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  function onLogout() {
    logout()
    nav('/login')
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <div className="text-xl font-semibold text-primary">Appointment Scheduler</div>
          <div className="flex items-center gap-4">
            <div className="text-gray-700">{user ? user.name : ''}</div>
            <button className="btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </header>
      <div className="flex max-w-7xl mx-auto">
        <aside className="w-64 bg-white shadow min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            {user?.role === 'ADMIN' ? (
              <>
                <Link className="block p-2 rounded hover:bg-gray-100" to="/admin">Dashboard</Link>
                <Link className="block p-2 rounded hover:bg-gray-100" to="/admin/slots">Slots</Link>
                <Link className="block p-2 rounded hover:bg-gray-100" to="/admin/appointments">Appointments</Link>
                <Link className="block p-2 rounded hover:bg-gray-100" to="/admin/users">Users</Link>
              </>
            ) : (
              <>
                <Link className="block p-2 rounded hover:bg-gray-100" to="/user/book">Book</Link>
                <Link className="block p-2 rounded hover:bg-gray-100" to="/user/appointments">My Appointments</Link>
              </>
            )}
          </nav>
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
