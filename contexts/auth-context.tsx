"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  type User,
  loginUser,
  registerUser, // Updated from signupUser
  verifyToken,
  logoutUser,
  type LoginCredentials,
  type SignupData,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: SignupData) => Promise<void>; // Updated from signup
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          const userData = await verifyToken(token);
          setUser({ ...userData, token });
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const userData = await loginUser(credentials);
      localStorage.setItem("auth_token", userData.token);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: SignupData) => {
    try {
      const newUser = await registerUser(userData); // Updated from signupUser
      localStorage.setItem("auth_token", newUser.token);
      setUser(newUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (user?.token) {
        await logoutUser(user.token);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register, // Updated from signup
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}