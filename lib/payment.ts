const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://mili-hack.onrender.com").replace(/\/$/, "")
const AUTH_STORAGE_KEY = "auth_token"

function getAuthHeader() {
  if (typeof window === "undefined") return {}
  const t = localStorage.getItem(AUTH_STORAGE_KEY)
  return t ? { Authorization: `Bearer ${t}` } : {}
}

async function parseJsonSafe(res: Response) {
  let data: any = null
  try { data = await res.json() } catch { /* ignore */ }
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText || `Request failed ${res.status}`
    throw new Error(msg)
  }
  return data
}

// If you already have this file, replace or merge with this version
import { apiPost } from "./api"

export async function initiateMpesaPayment(payload: {
  sessionId: string
  userId: string
  amount: number
  phone: string
  callbackUrl?: string
  metadata?: Record<string, any>
}) {
  return apiPost("/api/payment/mpesa/initiate", payload)
}