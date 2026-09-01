"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agendamentos", label: "Agendamentos" },
  { href: "/clientes", label: "Clientes" },
  { href: "/profissionais", label: "Profissionais" },
  { href: "/tratamentos", label: "Tratamentos" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-none flex-col gap-6 border-r border-border bg-white/80 p-4">
      <div className="flex items-center gap-2 px-1">
        <div className="h-9 w-9 overflow-hidden rounded-xl bg-white shadow">
          <Image src="/logo-spa.png" alt="EstéticaPro" width={36} height={36} className="h-full w-full object-cover" />
        </div>
        <span className="font-serif text-xl">
          Estética<span className="text-gold">Pro</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium ${
                active ? "bg-[#F6EEDD] text-gold-dark" : "text-ink hover:bg-[#F4EEE3]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
        <div className="px-1 text-sm">
          <div className="font-semibold">{user?.name}</div>
          <div className="text-muted">{user?.role === "ADMIN" ? "Administrador" : "Profissional"}</div>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-muted hover:border-gold hover:text-gold-dark"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
