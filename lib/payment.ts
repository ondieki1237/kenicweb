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

/**
 * Initiate M-Pesa STK push for a checkout session.
 * payload must include: { sessionId, userId, amount, phone, callbackUrl?, metadata? }
 */
export async function initiateMpesaPayment(payload: {
  sessionId: string
  userId: string
  amount: number
  phone: string
  callbackUrl?: string
  metadata?: Record<string, any>
}) {
  const url = `${API_BASE}/api/payment/mpesa/initiate`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  })
  return await parseJsonSafe(res)
}