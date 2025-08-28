export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mili-hack.onrender.com"

// Login function
export async function loginUser(credentials: LoginCredentials): Promise<User> {
  console.log("[v0] Making login request to:", `${API_BASE_URL}/api/auth/login`)
  console.log("[v0] Login credentials:", { email: credentials.email, password: "***" })

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  console.log("[v0] Login response status:", response.status)
  console.log("[v0] Login response ok:", response.ok)

  if (!response.ok) {
    const error = await response.json()
    console.error("[v0] Login error response:", error)
    throw new Error(error.message || "Login failed")
  }

  const data = await response.json()
  console.log("[v0] Login response data:", data)
  console.log("[v0] Response has user:", !!data.user)
  console.log("[v0] Response has token:", !!data.token)
  console.log("[v0] Token value:", data.token ? `${data.token.substring(0, 20)}...` : "null")

  const userWithToken = {
    ...data.user,
    token: data.token,
  }
  console.log("[v0] Final user object:", {
    ...userWithToken,
    token: userWithToken.token ? `${userWithToken.token.substring(0, 20)}...` : "null",
  })

  return userWithToken
}

// Register function (renamed endpoint from signup to register)
export async function signupUser(userData: SignupData): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, { // Changed from /api/auth/signup
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Register failed") // Updated error message
  }

  const data = await response.json()
  console.log("[v0] Register response:", data) // Updated log message

  // Extract user and token from backend response
  return {
    ...data.user,
    token: data.token,
  }
}

// Verify token function
export async function verifyToken(token: string): Promise<User> {
  try {
    console.log("[v0] Verifying token with profile endpoint")
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Token verification response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] Token verification failed:", errorData)
      throw new Error(errorData.message || `Token verification failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Token verification successful, user data received")

    // Return user data with token included
    return {
      ...data.user,
      token: token, // Keep the original token
    }
  } catch (error) {
    console.error("[v0] Token verification error:", error)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to authentication server. Please check if the backend is running on port 5000.",
      )
    }
    throw error
  }
}

// Logout function
export async function logoutUser(token: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}