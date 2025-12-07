import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Layout from './components/Layout.jsx'
import Book from './pages/user/Book.jsx'
import MyAppointments from './pages/user/Appointments.jsx'
import AdminOverview from './pages/admin/Overview.jsx'
import AdminSlots from './pages/admin/Slots.jsx'
import AdminAppointments from './pages/admin/Appointments.jsx'
import Users from './pages/admin/Users.jsx'

function RequireAuth({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/*" element={
          <RequireAuth role="USER">
            <Layout>
              <Routes>
                <Route path="book" element={<Book />} />
                <Route path="appointments" element={<MyAppointments />} />
                <Route path="*" element={<Navigate to="book" replace />} />
              </Routes>
            </Layout>
          </RequireAuth>
        } />
        <Route path="/admin/*" element={
          <RequireAuth role="ADMIN">
            <Layout>
              <Routes>
                <Route path="" element={<AdminOverview />} />
                <Route path="slots" element={<AdminSlots />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="users" element={<Users />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </Layout>
          </RequireAuth>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
