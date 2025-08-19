export interface User {
  id: string;
  name: string; // Changed from firstName/lastName to match backend
  email: string;
  phone?: string; // Optional, if added to backend schema
  role?: "user" | "admin"; // Match backend schema
  company?: string; // Optional, if added to backend schema
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string; // Keep for form compatibility
  lastName: string; // Keep for form compatibility
  username: string; // Added to match backend
  email: string;
  phone?: string; // Changed to optional to match form
  password: string;
  role: "user" | "admin"; // Restrict to backend values
  company?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Login function
export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await response.json();
  return {
    ...data.user,
    token: data.token,
  };
}

// Register function
export async function registerUser(userData: SignupData): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${userData.firstName} ${userData.lastName}`, // Combine firstName and lastName
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    }), // Send only what backend expects
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  const data = await response.json();
  return {
    ...data.user,
    token: data.token,
  };
}

// Verify token function (requires backend endpoint)
export async function verifyToken(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Token verification failed");
  }

  const data = await response.json();
  return {
    ...data.user,
    token,
  };
}

// Logout function (client-side only, unless backend endpoint is added)
export async function logoutUser(token: string): Promise<void> {
  // If no backend logout endpoint, just clear client-side token
  // localStorage.removeItem("token"); // Uncomment if using localStorage
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}