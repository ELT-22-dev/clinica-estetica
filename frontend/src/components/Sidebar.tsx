"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icon = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2"></rect>
      <rect x="14" y="3" width="7" height="7" rx="2"></rect>
      <rect x="14" y="14" width="7" height="7" rx="2"></rect>
      <rect x="3" y="14" width="7" height="7" rx="2"></rect>
    </svg>
  ),
  agenda: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="3"></rect>
      <path d="M3 10h18M8 2v4M16 2v4"></path>
    </svg>
  ),
  clientes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    </svg>
  ),
  profissionais: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"></circle>
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"></path>
    </svg>
  ),
  whats: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l1.9-5.4A8.4 8.4 0 1 1 21 11.5z"></path>
    </svg>
  ),
  ia: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5l1.7 4.8 4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7z"></path>
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"></path>
    </svg>
  ),
  financeiro: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="15" rx="3"></rect>
      <path d="M2 10h20"></path>
      <circle cx="17.5" cy="15" r="1.3"></circle>
    </svg>
  ),
  tratamentos: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3s6 6.2 6 10.2A6 6 0 0 1 6 13.2C6 9.2 12 3 12 3z"></path>
    </svg>
  ),
  relatorios: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V11M10 20V4M16 20v-6M22 20H2"></path>
    </svg>
  ),
  config: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.2"></circle>
      <path d="M19.1 14.9a1.5 1.5 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.5 1.5 0 0 0-2.6 1.1v.2a2 2 0 1 1-4 0v-.1a1.5 1.5 0 0 0-2.6-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.5 1.5 0 0 0-1-2.6H3.4a2 2 0 1 1 0-4h.1a1.5 1.5 0 0 0 1-2.6l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.5 1.5 0 0 0 2.6-1V3.4a2 2 0 1 1 4 0v.1a1.5 1.5 0 0 0 2.6 1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.5 1.5 0 0 0 1 2.6h.2a2 2 0 1 1 0 4h-.1a1.5 1.5 0 0 0-1.4.9z"></path>
    </svg>
  ),
};

const links = [
  { href: "/dashboard", label: "Dashboard", icon: icon.dashboard },
  { href: "/agendamentos", label: "Agendamentos", icon: icon.agenda },
  { href: "/clientes", label: "Clientes", icon: icon.clientes },
  { href: "/profissionais", label: "Profissionais", icon: icon.profissionais },
];

const soonTop = [{ label: "WhatsApp", icon: icon.whats }, { label: "Central de IA", icon: icon.ia }];

const soonBottom = [{ label: "Financeiro", icon: icon.financeiro }];

const links2 = [{ href: "/tratamentos", label: "Tratamentos", icon: icon.tratamentos }];

const soonBottom2 = [
  { label: "Relatórios", icon: icon.relatorios },
  { label: "Configurações", icon: icon.config },
];

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium ${
        active ? "bg-[#F6EEDD] text-gold-dark" : "text-ink hover:bg-[#F4EEE3]"
      }`}
    >
      <span className="flex-none">{icon}</span>
      {label}
    </Link>
  );
}

function ComingSoon({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-muted/60">
      <span className="flex-none">{icon}</span>
      <span className="flex-1">{label}</span>
      <span className="rounded-full bg-[#F1EAE0] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
        Em breve
      </span>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-none flex-col gap-6 border-r border-border bg-white/80 p-3.5 backdrop-blur-xl">
      <div className="flex h-[38px] items-center gap-2.5 px-1.5">
        <div className="h-9 w-9 overflow-hidden rounded-xl bg-white shadow-soft">
          <Image src="/logo-spa.png" alt="EstéticaPro" width={36} height={36} className="h-full w-full object-cover" />
        </div>
        <span className="whitespace-nowrap font-serif text-[23px] tracking-tight">
          Estética<span className="text-gold">Pro</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <NavLink key={l.href} {...l} active={!!pathname?.startsWith(l.href)} />
        ))}
        {soonTop.map((l) => (
          <ComingSoon key={l.label} {...l} />
        ))}

        <div className="my-2 h-px bg-border-soft" />

        {soonBottom.map((l) => (
          <ComingSoon key={l.label} {...l} />
        ))}
        {links2.map((l) => (
          <NavLink key={l.href} {...l} active={!!pathname?.startsWith(l.href)} />
        ))}
        {soonBottom2.map((l) => (
          <ComingSoon key={l.label} {...l} />
        ))}
      </nav>
    </aside>
  );
}
