"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ApiError, getToken } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function CoverPage() {
  const router = useRouter();
  const { login, loginDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleDemo() {
    setError(null);
    setLoadingDemo(true);
    try {
      await loginDemo();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível abrir a demonstração agora.");
      setLoadingDemo(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoadingLogin(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar");
      setLoadingLogin(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative flex min-h-[45vh] flex-1 flex-col justify-between overflow-hidden bg-ink px-8 py-8 text-white sm:px-12 sm:py-10 lg:min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(169,128,63,.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(232,201,120,.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/70" />

        <div className="relative flex items-center gap-2">
          <div className="h-9 w-9 overflow-hidden rounded-xl bg-white shadow">
            <Image src="/logo-spa.png" alt="EstéticaPro" width={36} height={36} className="h-full w-full object-cover" />
          </div>
          <span className="font-serif text-xl">
            Estética<span className="text-gold-light">Pro</span>
          </span>
        </div>

        <div className="relative flex max-w-xl flex-col gap-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-light">
            Sistema de gestão · Clínicas de estética
          </span>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
            Agenda, clientes e tratamentos num só painel.
          </h1>
          <p className="max-w-md text-white/75">
            Do agendamento à checagem de conflito de horário — dados reais, com API própria e
            banco Postgres.
          </p>

          <div className="mt-2 flex flex-wrap gap-8">
            <div>
              <div className="font-serif text-2xl">5</div>
              <div className="text-xs uppercase tracking-wide text-white/60">Módulos</div>
            </div>
            <div>
              <div className="font-serif text-2xl">Tempo real</div>
              <div className="text-xs uppercase tracking-wide text-white/60">Agenda e caixa</div>
            </div>
            <div>
              <div className="font-serif text-2xl">API própria</div>
              <div className="text-xs uppercase tracking-wide text-white/60">Node + Postgres</div>
            </div>
          </div>
        </div>

        <div className="relative" />
      </div>

      <div className="flex flex-1 items-center justify-center bg-cream px-6 py-10 lg:max-w-md">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-7 shadow-lg shadow-black/5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-dark">
            Portfólio · Acesso livre
          </p>

          <button
            onClick={handleDemo}
            disabled={loadingDemo}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-gold-light to-gold-dark px-4 py-3 font-semibold text-ink shadow-md disabled:opacity-60"
          >
            {loadingDemo ? "Entrando..." : "▶ Ver demonstração"}
          </button>
          <p className="mt-2 text-xs text-muted">
            Entra direto como administrador da clínica demo — sem precisar de senha.
          </p>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted">
            <div className="h-px flex-1 bg-border" />
            ou entre com sua conta
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-gold"
            />
            <input
              type="password"
              placeholder="Senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-gold"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loadingLogin}
              className="mt-1 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-gold disabled:opacity-60"
            >
              {loadingLogin ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <a
            href="https://github.com/ELT-22-dev/clinica-estetica"
            target="_blank"
            rel="noreferrer"
            className="mt-5 block text-center text-xs font-medium text-muted hover:text-gold-dark hover:underline"
          >
            Ver código no GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
