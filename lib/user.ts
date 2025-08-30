import { apiGet, apiPost, apiPut } from "./api"

/**
 * Try several common "get current user" endpoints.
 * Returns the parsed user object on success or throws an Error.
 */
export async function getMyProfile() {
  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")
  const candidates = [
    "/api/auth/profile",
    "/api/users/me",
    "/api/auth/me",
    "/api/users/profile",
  ]

  // attach token from localStorage if present (frontend-only)
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  const headers: Record<string, string> = {
    "Accept": "application/json",
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  let lastError: Error | null = null

  for (const path of candidates) {
    const url = API_BASE ? `${API_BASE}${path}` : path
    try {
      const res = await fetch(url, { method: "GET", headers, credentials: "include" })
      const body = await res.json().catch(() => null)

      if (!res.ok) {
        // If unauthorized, surface that immediately
        if (res.status === 401) throw new Error("Unauthorized")
        // otherwise continue trying other candidate paths for 404
        lastError = new Error(`${res.status} ${res.statusText} for ${path}`)
        continue
      }

      // backend might return { user: {...} } or the user object directly
      const user = body?.user ?? body
      if (!user) {
        lastError = new Error(`No user payload returned from ${path}`)
        continue
      }

      return user
    } catch (err: any) {
      // network error or thrown 401
      if (err?.message === "Unauthorized") throw err
      lastError = err
      // try next candidate
    }
  }

  throw lastError ?? new Error("Profile endpoint not found")
}

// Try to fetch user by id. Adjust path if your backend uses a different route.
export async function getUser(userId: string) {
  return apiGet(`/api/users/${encodeURIComponent(userId)}`)
}

// Update user profile. Backend must support PUT /api/users/:id
export async function updateUser(userId: string, updates: Record<string, any>) {
  return apiPut(`/api/users/${encodeURIComponent(userId)}`, updates)
}