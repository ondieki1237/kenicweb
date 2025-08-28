"use client"

import ProtectedRoute from "@/components/protected-route"
import Sandbox from "@/components/sandbox"

export default function SandboxWebsitePage() {
  // Pass a default slug to your existing sandbox component so it behaves the same
  return (
    <ProtectedRoute>
      <Sandbox params={{ slug: "website" }} />
    </ProtectedRoute>
  )
}