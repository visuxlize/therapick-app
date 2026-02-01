import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('therapick-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Simple demo login - in production, this would call an API
    const userData = {
      id: 1,
      name: 'Demo User',
      email: email,
      avatar: null
    }
    setUser(userData)
    localStorage.setItem('therapick-user', JSON.stringify(userData))
    return Promise.resolve(userData)
  }

  const signup = (name, email, password) => {
    // Simple demo signup
    const userData = {
      id: Date.now(),
      name: name,
      email: email,
      avatar: null
    }
    setUser(userData)
    localStorage.setItem('therapick-user', JSON.stringify(userData))
    return Promise.resolve(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('therapick-user')
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
