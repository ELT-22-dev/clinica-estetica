"use client";

import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth-context";

const PAGES: Record<string, { title: string; accent?: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", accent: "EstéticaPro", subtitle: "Visão geral da clínica" },
  "/agendamentos": { title: "Agendamentos", subtitle: "Agenda da semana, salas e profissionais" },
  "/clientes": { title: "Clientes", subtitle: "Base de clientes da clínica" },
  "/profissionais": { title: "Profissionais", subtitle: "Equipe que atende na clínica" },
  "/tratamentos": { title: "Tratamentos", subtitle: "Catálogo de procedimentos e preços" },
};

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const page = Object.entries(PAGES).find(([href]) => pathname?.startsWith(href))?.[1] ?? {
    title: "EstéticaPro",
    subtitle: "",
  };

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border/85 bg-white/80 px-8 py-5 shadow-[0_18px_40px_-34px_rgba(74,54,28,.5)] backdrop-blur-xl">
      <div className="min-w-0">
        <h1 className="whitespace-nowrap font-serif text-[28px] font-normal leading-tight tracking-tight">
          {page.title} {page.accent && <em className="text-gold not-italic">{page.accent}</em>}
        </h1>
        <p className="mt-0.5 text-[14.5px] text-muted">{page.subtitle}</p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-full border border-border bg-white py-1 pl-1 pr-3.5 shadow-pill">
          <Avatar name={user?.name ?? "?"} size={32} />
          <div className="leading-tight">
            <div className="text-[14px] font-semibold">{user?.name}</div>
            <div className="text-[12.5px] text-muted">{user?.role === "ADMIN" ? "Administradora" : "Profissional"}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-muted shadow-soft hover:border-gold hover:text-gold-dark"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
