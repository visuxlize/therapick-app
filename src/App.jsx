import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import SplashScreen from './components/SplashScreen'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import TherapistDetail from './pages/TherapistDetail'
import BookingPage from './pages/BookingPage'
import './index.css'

function AppRoutes() {
  const [showSplash, setShowSplash] = useState(true)
  const { user, loading } = useAuth()

  useEffect(() => {
    // Show splash screen only on first load
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash')
    if (hasSeenSplash) {
      setShowSplash(false)
    }
  }, [])

  const handleSplashFinish = () => {
    setShowSplash(false)
    sessionStorage.setItem('hasSeenSplash', 'true')
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/home" />} />
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path="/therapist/:id" element={user ? <TherapistDetail /> : <Navigate to="/auth" />} />
        <Route path="/booking/:id" element={user ? <BookingPage /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
