"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { clearToken, getToken, setToken } from "./api";
import { fetchMe, login as loginRequest } from "./resources";
import type { User } from "./types";

export const DEMO_CREDENTIALS = { email: "admin@esteticapro.com", password: "esteticapro123" };

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { token, user } = await loginRequest(email, password);
    setToken(token);
    setUser(user);
    router.push("/dashboard");
  }

  function loginDemo() {
    return login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
  }

  function logout() {
    clearToken();
    setUser(null);
    router.push("/");
  }

  return <AuthContext.Provider value={{ user, loading, login, loginDemo, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
