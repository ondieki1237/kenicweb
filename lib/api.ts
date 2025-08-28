const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mili-hack.onrender.com"

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    console.log("[v0] Getting auth token:", token ? "Token found" : "No token found")
    return token
  }
  return null
}

// API request helper with auth
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()

  console.log("[v0] Making API request to:", `${API_BASE_URL}${endpoint}`)
  console.log("[v0] Token available:", token ? "Yes" : "No")

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  console.log("[v0] Request headers:", config.headers)

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  console.log("[v0] Response status:", response.status)

  if (response.status === 401) {
    // Token expired or invalid, clear it and redirect to login
    console.log("[v0] 401 error - clearing token and redirecting")
    localStorage.removeItem("auth_token")
    window.location.href = "/login"
    throw new Error("Authentication required")
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }))
    console.error("[v0] API error:", error)
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log("[v0] API response data:", data)
  return data
}

// Domain API functions
export const domainApi = {
  // Check single domain availability
  checkDomain: async (domain: string) => {
    return apiRequest(`/api/domains/check/${domain}`)
  },

  // Get WHOIS information
  getWhois: async (domain: string) => {
    return apiRequest(`/api/domains/whois/${domain}`)
  },

  // Bulk check multiple domains
  bulkCheck: async (domains: string[]) => {
    return apiRequest("/api/domains/bulk-check", {
      method: "POST",
      body: JSON.stringify({ domains }),
    })
  },

  // Get domain suggestions
  getSuggestions: async (baseName: string) => {
    return apiRequest(`/api/domains/suggestions/${baseName}`)
  },

  getAISuggestions: async (
    baseName: string,
    options?: { businessDescription?: string; industry?: string; targetAudience?: string },
  ) => {
    return apiRequest("/api/domains/ai-suggestions", {
      method: "POST",
      body: JSON.stringify({
        baseName,
        businessDescription: options?.businessDescription || `Business related to ${baseName}`,
        industry: options?.industry || "general",
        targetAudience: options?.targetAudience || "general public",
      }),
    })
  },

  // Get list of registrars
  getRegistrars: async () => {
    return apiRequest("/api/domains/registrars")
  },

  // AI suggestions based on business description only
  getAISuggestionsFromBusiness: async (businessDescription: string, max?: number) => {
    return apiRequest("/api/domains/ai-suggestions", {
      method: "POST",
      body: JSON.stringify({ businessDescription, ...(max ? { max } : {}) }),
    })
  },

  // Get user's domains
  getUserDomains: async () => {
    return apiRequest("/api/domains/user/domains")
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
    return apiRequest("/api/domains/user/register", {
      method: "POST",
      body: JSON.stringify(domainData),
    })
  },

  // Get user activity
  getUserActivity: async () => {
    return apiRequest("/api/domains/user/activity")
  },
}

// Billing API functions
export const billingApi = {
  // Get user's billing history
  getUserBilling: async () => {
    return apiRequest("/api/billing/user/billing")
  },

  // Get billing summary
  getBillingSummary: async () => {
    return apiRequest("/api/billing/user/billing/summary")
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
    return apiRequest("/api/billing/user/billing", {
      method: "POST",
      body: JSON.stringify(billingData),
    })
  },

  // Update billing status
  updateBillingStatus: async (billingId: string, status: string, paymentReference?: string) => {
    return apiRequest(`/api/billing/user/billing/${billingId}`, {
      method: "PUT",
      body: JSON.stringify({ status, paymentReference }),
    })
  },

  // Get pending payments
  getPendingPayments: async () => {
    return apiRequest("/api/billing/user/billing/pending")
  },
}

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (userData: any) => {
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },
}