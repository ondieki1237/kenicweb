import { apiGet, apiPost } from "./api"

// Check single domain availability
export async function checkDomain(domain: string) {
  return apiGet(`/api/domains/check/${encodeURIComponent(domain)}`)
}

// WHOIS lookup
export async function whois(domain: string) {
  return apiGet(`/api/domains/whois/${encodeURIComponent(domain)}`)
}

// Bulk availability (max 10)
export async function bulkCheck(domains: string[]) {
  return apiPost(`/api/domains/bulk-check`, { domains: domains.slice(0, 10) })
}

// Suggestions
export async function suggestions(baseName: string) {
  return apiGet(`/api/domains/suggestions/${encodeURIComponent(baseName)}`)
}

// AI suggestions
export async function aiSuggestions(payload: { prompt: string; maxResults?: number }) {
  return apiPost(`/api/domains/ai-suggestions`, payload)
}