export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://mili-hack.onrender.com"

function getAuthHeaders() {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function addToCart(payload: { domain: string; price?: number; name?: string }, userId: string) {
  const body = {
    domain: payload.domain,
    price: payload.price,
    name: payload.name,
    userId,
  }
  const res = await fetch(`${API_BASE}/api/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Add to cart failed" }))
    throw new Error(err.message || "Add to cart failed")
  }
  return res.json()
}

export async function getCart(userId: string) {
  const url = new URL(`${API_BASE}/api/cart`)
  if (userId) url.searchParams.set("userId", userId)
  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Fetch cart failed" }))
    throw new Error(err.message || "Fetch cart failed")
  }
  return res.json()
}

export async function removeFromCart(domain: string, userId: string) {
  const url = new URL(`${API_BASE}/api/cart/${encodeURIComponent(domain)}`)
  if (userId) url.searchParams.set("userId", userId)
  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Remove failed" }))
    throw new Error(err.message || "Remove failed")
  }
  return res.json()
}