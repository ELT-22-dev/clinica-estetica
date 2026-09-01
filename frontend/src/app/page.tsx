"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const features = [
  {
    title: "Agendamentos",
    description: "Marcação com checagem automática de conflito de horário por profissional.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="3"></rect>
        <path d="M3 10h18M8 2v4M16 2v4"></path>
      </svg>
    ),
  },
  {
    title: "Clientes",
    description: "Cadastro, histórico e busca rápida por nome, telefone ou e-mail.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      </svg>
    ),
  },
  {
    title: "Tratamentos",
    description: "Catálogo de procedimentos com duração e preço, usados no cálculo da agenda.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3s6 6.2 6 10.2A6 6 0 0 1 6 13.2C6 9.2 12 3 12 3z"></path>
      </svg>
    ),
  },
  {
    title: "Dashboard",
    description: "Faturamento do mês, agendamentos do dia e próximos horários em tempo real.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V11M10 20V4M16 20v-6M22 20H2"></path>
      </svg>
    ),
  },
];

const stack = ["Next.js", "React", "Node.js / Express", "Prisma", "PostgreSQL"];

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
    <div className="min-h-screen bg-cream">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
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

      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-8">
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-dark">
              Projeto de portfólio
            </span>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
              Gestão completa para <em className="text-gold not-italic">clínicas de estética</em>
            </h1>
            <p className="max-w-md text-lg text-muted">
              Agenda, clientes e tratamentos em um só lugar — com uma API própria (Node, Prisma e
              PostgreSQL) e um frontend em Next.js consumindo dados reais.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDemo}
                disabled={loadingDemo}
                className="rounded-xl bg-gradient-to-b from-gold-light to-gold-dark px-6 py-3 font-semibold text-ink shadow-lg shadow-black/10 disabled:opacity-60"
              >
                {loadingDemo ? "Entrando..." : "Ver demonstração ao vivo"}
              </button>
              <a
                href="https://github.com/ELT-22-dev/clinica-estetica"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-border bg-white px-6 py-3 font-semibold text-muted hover:border-gold hover:text-gold-dark"
              >
                Ver código no GitHub
              </a>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <p className="text-xs text-muted">
              O botão abre o painel com uma conta de demonstração — nenhuma senha necessária.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-gradient-to-br from-white to-[#FBF4E6] p-6 shadow-2xl shadow-black/10">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-serif text-lg">Agenda de hoje</p>
              <span className="rounded-full bg-[#EDF7F0] px-2.5 py-1 text-xs font-semibold text-[#1B7A45]">Ao vivo</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { time: "09:00", name: "Ana Costa", service: "Botox", status: "Confirmado" },
                { time: "10:30", name: "Maria Oliveira", service: "Limpeza de pele", status: "Confirmado" },
                { time: "13:00", name: "Juliana Reis", service: "Microagulhamento", status: "Pendente" },
              ].map((row) => (
                <div key={row.time} className="flex items-center gap-3 rounded-xl border border-border/70 bg-white px-3 py-2.5">
                  <span className="font-serif text-base w-12 flex-none">{row.time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{row.name}</p>
                    <p className="truncate text-xs text-muted">{row.service}</p>
                  </div>
                  <span
                    className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      row.status === "Confirmado" ? "bg-[#EDF7F0] text-[#1B7A45]" : "bg-[#F8F1E2] text-gold-dark"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted">Agendamentos hoje</p>
                <p className="font-serif text-2xl">14</p>
              </div>
              <div>
                <p className="text-xs text-muted">Faturamento do mês</p>
                <p className="font-serif text-2xl">R$ 68.420</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6EEDD] text-gold-dark">
                {feature.icon}
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
