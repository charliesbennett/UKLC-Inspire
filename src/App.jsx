import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import TopicView from './pages/TopicView'
import ProfilePage from './pages/ProfilePage'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  checkUser()
  
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    setUser(session?.user || null)
  })

  return () => {
    if (data && data.subscription) {
      data.subscription.unsubscribe()
    }
  }
}, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} />
        <Route path="/topic/:topicId" element={user ? <TopicView user={user} /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
