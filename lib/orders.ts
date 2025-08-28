import { apiGet } from "./api"

// GET /api/orders?userId=
export async function getOrders(userId: string) {
  return apiGet(`/api/orders?userId=${encodeURIComponent(userId)}`)
}

// GET /api/orders/:id
export async function getOrder(id: string) {
  return apiGet(`/api/orders/${encodeURIComponent(id)}`)
}