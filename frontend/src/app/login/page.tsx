"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@esteticapro.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-lg shadow-black/5">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl bg-white shadow">
            <Image src="/logo-spa.png" alt="EstéticaPro" width={40} height={40} className="h-full w-full object-cover" />
          </div>
          <h1 className="font-serif text-2xl">
            Estética<span className="text-gold">Pro</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-muted">
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-gold"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-muted">
            Senha
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-gold"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-gradient-to-b from-gold-light to-gold-dark px-4 py-2 font-semibold text-ink disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-muted">
          Demonstração: admin@esteticapro.com / esteticapro123
        </p>
      </div>
    </div>
  );
}
