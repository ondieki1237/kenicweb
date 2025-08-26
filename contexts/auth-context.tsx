"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  loginUser,
  signupUser,
  verifyToken,
  logoutUser,
  type LoginCredentials,
  type SignupData,
} from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (userData: SignupData) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          console.log("[v0] Verifying stored token...")
          const userData = await verifyToken(token)
          console.log("[v0] Token verification successful")
          setUser({ ...userData, token })
        } else {
          console.log("[v0] No stored token found")
        }
      } catch (error) {
        console.error("[v0] Auth verification failed:", error)
        localStorage.removeItem("auth_token")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log("[v0] Starting login process...")
      const userData = await loginUser(credentials)
      console.log("[v0] Login successful, received user data")
      console.log("[v0] User ID:", userData.id)
      console.log("[v0] User email:", userData.email)
      console.log("[v0] Token present:", !!userData.token)
      console.log("[v0] Token preview:", userData.token ? `${userData.token.substring(0, 20)}...` : "null")

      if (userData.token) {
        localStorage.setItem("auth_token", userData.token)
        const storedToken = localStorage.getItem("auth_token")
        console.log("[v0] Token stored successfully:", !!storedToken)
        console.log("[v0] Stored token preview:", storedToken ? `${storedToken.substring(0, 20)}...` : "null")

        setUser(userData)
        console.log("[v0] User state updated successfully")
      } else {
        console.error("[v0] No token received from login response")
        throw new Error("No authentication token received")
      }
    } catch (error) {
      console.error("[v0] Login failed:", error)
      throw error
    }
  }

  const signup = async (userData: SignupData) => {
    try {
      console.log("[v0] Attempting signup...")
      const newUser = await signupUser(userData)
      console.log("[v0] Signup successful, user data:", newUser)
      console.log("[v0] Token received:", newUser.token ? "Yes" : "No")

      if (newUser.token) {
        localStorage.setItem("auth_token", newUser.token)
        console.log("[v0] Token stored in localStorage")
        setUser(newUser)
        console.log("[v0] User state updated")
      } else {
        console.error("[v0] No token received from signup response")
        throw new Error("No authentication token received")
      }
    } catch (error) {
      console.error("[v0] Signup failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (user?.token) {
        await logoutUser(user.token)
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("auth_token")
      setUser(null)
      window.location.href = "/"
    }
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
