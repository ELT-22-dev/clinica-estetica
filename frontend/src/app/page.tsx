"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function CoverPage() {
  const router = useRouter();
  const { loginDemo } = useAuth();
  const [loadingDemo, setLoadingDemo] = useState(false);
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

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 overflow-hidden rounded-xl bg-white shadow">
            <Image src="/logo-spa.png" alt="EstéticaPro" width={36} height={36} className="h-full w-full object-cover" />
          </div>
          <span className="font-serif text-xl">
            Estética<span className="text-gold">Pro</span>
          </span>
        </div>
        <Link href="/login" className="text-sm font-semibold text-muted hover:text-gold-dark">
          Entrar
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-6 px-6 pb-24 text-center">
        <span className="w-fit rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-dark">
          Projeto de portfólio
        </span>

        <h1 className="max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
          Gestão completa para <em className="text-gold not-italic">clínicas de estética</em>
        </h1>

        <p className="max-w-md text-lg text-muted">
          Agenda, clientes e tratamentos em um só lugar, com uma API própria e dados reais.
        </p>

        <button
          onClick={handleDemo}
          disabled={loadingDemo}
          className="rounded-xl bg-gradient-to-b from-gold-light to-gold-dark px-8 py-3 font-semibold text-ink shadow-lg shadow-black/10 disabled:opacity-60"
        >
          {loadingDemo ? "Entrando..." : "Ver demonstração ao vivo"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-xs text-muted">Sem senha necessária</p>

        <a
          href="https://github.com/ELT-22-dev/clinica-estetica"
          target="_blank"
          rel="noreferrer"
          className="mt-2 text-sm font-medium text-muted underline-offset-4 hover:text-gold-dark hover:underline"
        >
          Ver código no GitHub
        </a>
      </main>
    </div>
  );
}
