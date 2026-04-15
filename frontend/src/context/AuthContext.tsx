"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "user" | "admin";
  extracted_skills: {
    Technical: string[];
    Soft: string[];
    Domain: string[];
  };
  swot_data?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    enlightenment_score: number;
    career_guidance?: {
      target_role: string;
      next_steps: string;
      key_skill_to_master: string;
    };
  };
  bio?: string;
  experience_level?: string;
  target_role?: string;
  current_readiness_score: number;
  future_readiness_score: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const storedAuth = localStorage.getItem("ss_auth");
    
    // Using a microtask to avoid synchronous setState during initial mount effect
    // which can trigger cascading renders in this React environment.
    Promise.resolve().then(() => {
      if (storedAuth) {
        try {
          const userData = JSON.parse(storedAuth);
          // Default role for legacy sessions that don't have it
          if (!userData.role) userData.role = "user";
          setIsAuthenticated(true);
          setUser(userData);
        } catch (e) {
          console.error("Failed to parse stored auth", e);
        }
      }
      setIsLoading(false);
    });
  }, []);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("ss_auth", JSON.stringify(userData));
    router.push(userData.role === "admin" ? "/admin" : "/");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("ss_auth");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
