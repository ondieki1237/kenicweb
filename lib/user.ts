import { apiGet, apiPut } from "./api"

// Try to fetch user by id. Adjust path if your backend uses a different route.
export async function getUser(userId: string) {
  return apiGet(`/api/users/${encodeURIComponent(userId)}`)
}

// Update user profile. Backend must support PUT /api/users/:id
export async function updateUser(userId: string, updates: Record<string, any>) {
  return apiPut(`/api/users/${encodeURIComponent(userId)}`, updates)
}

// If your backend exposes /api/auth/profile, you can also use:
export async function getMyProfile() {
  return apiGet(`/api/auth/profile`)
}