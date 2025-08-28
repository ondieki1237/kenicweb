"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { loginUser, signupUser, verifyToken, logoutUser } from "@/lib/auth"

export const AUTH_TOKEN_KEY = "auth_token"
export const AUTH_USER_KEY = "auth_user"

export interface User {
  id: string
  firstName?: string
  lastName?: string
  name?: string
  username?: string
  email: string
  phone?: string
  company?: string
  token?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  firstName?: string
  lastName?: string
  name?: string
  username?: string
  email: string
  phone?: string
  password: string
  role?: string
  company?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  register: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Persist session until explicit logout:
  // - store token in AUTH_TOKEN_KEY and user JSON in AUTH_USER_KEY on login/signup
  // - on mount, restore session from storage and don't auto-logout on verify failure
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window === "undefined") return
        const token = localStorage.getItem(AUTH_TOKEN_KEY)
        const stored = localStorage.getItem(AUTH_USER_KEY)
        if (token) {
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              setUser(parsed)
            } catch {
              // fallback to verify if stored user corrupted
              const verified = await verifyToken(token).catch(() => null)
              if (verified) {
                setUser(verified)
                localStorage.setItem(AUTH_USER_KEY, JSON.stringify(verified))
              } else {
                // keep user logged in per requirement — preserve token but clear user only if absolutely necessary
                setUser(null)
              }
            }
          } else {
            // no stored user; attempt verify but do NOT forcibly clear token if verify fails
            const verified = await verifyToken(token).catch(() => null)
            if (verified) {
              setUser(verified)
              localStorage.setItem(AUTH_USER_KEY, JSON.stringify(verified))
            } else {
              // leave token in storage, but set user to null — user remains "logged in" until explicit logout
              setUser(null)
            }
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        console.warn("[v0] checkAuth failed:", (err as Error).message ?? err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const result = await loginUser(credentials)
    // loginUser should return { token, ...user }
    if (result?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, result.token)
    }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result))
    setUser(result)
  }

  const signup = async (data: SignupData) => {
    const result = await signupUser(data)
    if (result?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, result.token)
    }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result))
    setUser(result)
  }

  // keep register alias for compatibility
  const register = async (data: SignupData) => signup(data)

  const logout = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null
      if (token) {
        await logoutUser(token).catch(() => {}) // attempt server logout, ignore errors
      }
    } finally {
      // always remove local session data on explicit logout
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(AUTH_USER_KEY)
      }
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
