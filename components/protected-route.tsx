"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo)
    }
    if (!loading && isAuthenticated && user?.token) {
      // Verify token is still valid by checking localStorage
      const storedToken = localStorage.getItem("auth_token")
      if (!storedToken || storedToken !== user.token) {
        router.push(redirectTo)
      }
    }
  }, [isAuthenticated, loading, router, redirectTo, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-yellow-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
