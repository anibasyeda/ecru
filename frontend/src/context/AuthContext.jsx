import { createContext, useContext, useEffect, useState } from 'react'
import { authLogin, authRegister, authMe } from '../services/api'

const AuthContext = createContext(null)

// Holds the logged-in user. The JWT lives in localStorage so a page refresh
// keeps the session; on mount we validate it against /auth/me.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('ecru_token')
    if (!token) {
      setReady(true)
      return
    }
    authMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('ecru_token'))
      .finally(() => setReady(true))
  }, [])

  const persist = ({ token, ...profile }) => {
    localStorage.setItem('ecru_token', token)
    setUser(profile)
  }

  const login = async (credentials) => persist(await authLogin(credentials))
  const register = async (details) => persist(await authRegister(details))
  const logout = () => {
    localStorage.removeItem('ecru_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
