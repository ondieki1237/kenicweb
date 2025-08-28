const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://mili-hack.onrender.com").replace(/\/$/, "")
export const AUTH_STORAGE_KEY = "auth_token"

function getAuthHeader() {
  if (typeof window === "undefined") return {}
  const t = localStorage.getItem(AUTH_STORAGE_KEY)
  return t ? { Authorization: `Bearer ${t}` } : {}
}

async function parseJsonSafe(res: Response) {
  let data: any = null
  try { data = await res.json() } catch {}
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText || `Request failed ${res.status}`
    throw new Error(msg)
  }
  return data
}

export async function apiGet(path: string) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`
  const res = await fetch(url, { headers: { "Content-Type": "application/json", ...getAuthHeader() } })
  return parseJsonSafe(res)
}

export async function apiPost(path: string, body: any) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(body),
  })
  return parseJsonSafe(res)
}

export async function apiPut(path: string, body: any) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(body),
  })
  return parseJsonSafe(res)
}

export async function apiDelete(path: string) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`
  const res = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json", ...getAuthHeader() } })
  return parseJsonSafe(res)
}

// Domain API functions
export const domainApi = {
  // Check single domain availability
  checkDomain: async (domain: string) => {
    return apiGet(`/api/domains/check/${domain}`)
  },

  // Get WHOIS information
  getWhois: async (domain: string) => {
    return apiGet(`/api/domains/whois/${domain}`)
  },

  // Bulk check multiple domains
  bulkCheck: async (domains: string[]) => {
    return apiPost("/api/domains/bulk-check", { domains })
  },

  // Get domain suggestions
  getSuggestions: async (baseName: string) => {
    return apiGet(`/api/domains/suggestions/${baseName}`)
  },

  getAISuggestions: async (
    baseName: string,
    options?: { businessDescription?: string; industry?: string; targetAudience?: string },
  ) => {
    return apiPost("/api/domains/ai-suggestions", {
      baseName,
      businessDescription: options?.businessDescription || `Business related to ${baseName}`,
      industry: options?.industry || "general",
      targetAudience: options?.targetAudience || "general public",
    })
  },

  // Get list of registrars
  getRegistrars: async () => {
    return apiGet("/api/domains/registrars")
  },

  // AI suggestions based on business description only
  getAISuggestionsFromBusiness: async (businessDescription: string, max?: number) => {
    return apiPost("/api/domains/ai-suggestions", { businessDescription, ...(max ? { max } : {}) })
  },

  // Get user's domains
  getUserDomains: async () => {
    return apiGet("/api/domains/user/domains")
  },

  // Register a new domain
  registerDomain: async (domainData: {
    name: string;
    extension: string;
    registrar: string;
    registrarId: string;
    price: number;
    expiryDate: string;
  }) => {
    return apiPost("/api/domains/user/register", domainData)
  },

  // Get user activity
  getUserActivity: async () => {
    return apiGet("/api/domains/user/activity")
  },
}

// Billing API functions
export const billingApi = {
  // Get user's billing history
  getUserBilling: async () => {
    return apiGet("/api/billing/user/billing")
  },

  // Get billing summary
  getBillingSummary: async () => {
    return apiGet("/api/billing/user/billing/summary")
  },

  // Create a new billing record
  createBilling: async (billingData: {
    domainId?: string;
    amount: number;
    paymentMethod: "mpesa" | "card" | "bank" | "other";
    description: string;
    type: "registration" | "renewal" | "transfer" | "other";
    dueDate?: string;
  }) => {
    return apiPost("/api/billing/user/billing", billingData)
  },

  // Update billing status
  updateBillingStatus: async (billingId: string, status: string, paymentReference?: string) => {
    return apiPut(`/api/billing/user/billing/${billingId}`, { status, paymentReference })
  },

  // Get pending payments
  getPendingPayments: async () => {
    return apiGet("/api/billing/user/billing/pending")
  },
}

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    return apiPost("/api/auth/login", { email, password })
  },

  register: async (userData: any) => {
    return apiPost("/api/auth/register", userData)
  },
}