const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// API request helper with auth
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
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

  // Get list of registrars
  getRegistrars: async () => {
    return apiRequest("/api/domains/registrars")
  },
}

// Auth API functions (already created but adding here for completeness)
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
