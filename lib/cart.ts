import { apiGet, apiPost, apiDelete } from "./api"

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://mili-hack.onrender.com"

// POST /api/cart/add
export async function addToCart(payload: { domain: string; price?: number; name?: string; userId?: string }) {
  return apiPost(`/api/cart/add`, payload)
}

// GET /api/cart?userId=
export async function getCart(userId?: string) {
  const path = userId ? `/api/cart?userId=${encodeURIComponent(userId)}` : `/api/cart`
  return apiGet(path)
}

// DELETE /api/cart/:domain?userId=
export async function removeFromCart(domain: string, userId?: string) {
  const path = `/api/cart/${encodeURIComponent(domain)}${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`
  return apiDelete(path)
}