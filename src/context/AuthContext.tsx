import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { authService } from '../services/auth'

interface AuthContextType {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  updateUser: (user: User) => void
  logout: () => void
  isAuthenticated: boolean
  authLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  )
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      setAuthLoading(false)
      return
    }

    authService
      .getProfile()
      .then((userData) => {
        setUser(userData)
        setToken(storedToken)
      })
      .catch(() => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      })
      .finally(() => setAuthLoading(false))
  }, [])

  const setAuth = (user: User, token: string) => {
    setUser(user)
    setToken(token)
    localStorage.setItem('token', token)
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider
      value={{ user, token, setAuth, updateUser, logout, isAuthenticated: !!token, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
