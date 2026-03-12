"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { authApi, type User } from "@/lib/api"

interface AuthContextType {
  user: User | null
  loading: boolean
  isLoggedIn: boolean
  login: (mobile: string, otp: string) => Promise<{ isNewUser: boolean }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoggedIn: false,
  login: async () => ({ isNewUser: false }),
  logout: async () => {},
  refreshUser: async () => {},
  setUser: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const data = await authApi.getMe()
      setUser(data.user)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }
    } catch {
      setUser(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("user")
      }
    }
    refreshUser()
  }, [refreshUser])

  const login = async (mobile: string, otp: string) => {
    const data = await authApi.verifyOtp(mobile, otp)
    if (data.token) {
      localStorage.setItem("token", data.token)
    }
    if (data.user) {
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
    }
    return { isNewUser: !!data.isNewUser }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn: !!user, login, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
