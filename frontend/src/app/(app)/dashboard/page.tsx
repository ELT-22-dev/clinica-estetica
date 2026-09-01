"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth-context";
import { fetchDashboardSummary } from "@/lib/resources";
import type { DashboardSummary } from "@/lib/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateTime = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const firstName = (name?: string) => name?.split(" ")[0] ?? "";

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardSummary()
      .then(setSummary)
      .catch(() => setError("Não foi possível carregar o dashboard"));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!summary) return <p className="text-muted">Carregando...</p>;

  return (
    <>
      <div className="relative overflow-hidden rounded-[22px] border border-border bg-ink shadow-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(169,128,63,.4),transparent_50%),radial-gradient(circle_at_85%_75%,rgba(232,201,120,.28),transparent_55%)]" />
        <div className="relative flex flex-col gap-3 p-8 sm:max-w-xl">
          <div className="flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1.5 pl-2 pr-3 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6FE3A0]" />
            <span className="text-xs font-bold uppercase tracking-wide text-[#F7EEDC]">Bem-vinda de volta</span>
          </div>
          <h2 className="font-serif text-[35px] leading-tight text-[#FFFCF4]">
            Bom dia, {firstName(user?.name)}. <em className="text-gold-light not-italic">{summary.appointmentsToday} atendimentos</em> hoje.
          </h2>
          <p className="max-w-md text-[15px] text-white/75">
            Você tem {summary.totalClients} clientes cadastrados e {summary.appointmentsToday} agendamentos para hoje na agenda.
          </p>
          <div className="mt-1 flex gap-3">
            <Link href="/agendamentos" className="btn-gold">
              Abrir agenda
            </Link>
            <Link
              href="/clientes"
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              Ver clientes
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card flex flex-col gap-2.5 p-5">
          <span className="text-sm font-semibold text-muted">Faturamento do mês</span>
          <div className="whitespace-nowrap font-serif text-4xl">{currency.format(summary.revenueThisMonth)}</div>
          <span className="text-[13.5px] text-muted">Agendamentos concluídos este mês</span>
        </div>
        <div className="card flex flex-col gap-2.5 p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-muted">Agendamentos hoje</span>
          </div>
          <div className="whitespace-nowrap font-serif text-4xl">{summary.appointmentsToday}</div>
          <span className="text-[13.5px] text-muted">Na agenda de hoje</span>
        </div>
        <div className="card flex flex-col gap-2.5 p-5">
          <span className="text-sm font-semibold text-muted">Clientes cadastrados</span>
          <div className="whitespace-nowrap font-serif text-4xl">{summary.totalClients}</div>
          <span className="text-[13.5px] text-muted">Total na base</span>
        </div>
      </div>

      <div className="card flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[17.5px] font-bold">Próximos agendamentos</h2>
          <Link href="/agendamentos" className="text-[14.5px] font-semibold text-gold-dark">
            Ver semana completa
          </Link>
        </div>

        {summary.upcomingAppointments.length === 0 ? (
          <p className="text-muted">Nenhum agendamento futuro.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {summary.upcomingAppointments.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3.5 rounded-2xl border border-border-soft px-4 py-3 shadow-soft"
              >
                <div className="w-14 flex-none whitespace-nowrap font-serif text-[21px]">
                  {dateTime.format(new Date(a.startsAt))}
                </div>
                <Avatar name={a.client.name} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15.5px] font-semibold">{a.client.name}</div>
                  <div className="truncate text-[13.5px] text-muted">
                    {a.treatment.name} · {a.professional.name}
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
