"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // if authenticated, always send user to dashboard for any "home" navigation
      if (user) {
        router.replace("/dashboard")
      }
      // else stay on landing page (rendered below) or you can redirect to /login
    }
  }, [user, loading, router])

  // Keep existing landing UI here (or minimal placeholder)
  return (
    <main>
      {/* If user is not authenticated, show landing / marketing / login links */}
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">Please login or sign up to continue.</p>
        </div>
      </div>
    </main>
  )
}