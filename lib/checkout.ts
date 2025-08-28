import { apiPost, apiGet } from "./api"

// POST /api/checkout
export async function startCheckout(payload: { userId: string; items?: any[]; total?: number }) {
  return apiPost("/api/checkout", payload)
}

// GET /api/checkout/:id/status
export async function getCheckoutStatus(id: string) {
  return apiGet(`/api/checkout/${encodeURIComponent(id)}/status`)
}