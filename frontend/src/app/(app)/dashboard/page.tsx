"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { fetchDashboardSummary } from "@/lib/resources";
import type { DashboardSummary } from "@/lib/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateTime = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardSummary()
      .then(setSummary)
      .catch(() => setError("Não foi possível carregar o dashboard"));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl">
          Dashboard <em className="text-gold not-italic">EstéticaPro</em>
        </h1>
        <p className="text-muted">Visão geral da clínica</p>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {summary && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Clientes cadastrados" value={String(summary.totalClients)} />
            <StatCard label="Agendamentos hoje" value={String(summary.appointmentsToday)} />
            <StatCard label="Faturamento do mês" value={currency.format(summary.revenueThisMonth)} hint="Agendamentos concluídos" />
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Próximos agendamentos</h2>
              <Link href="/agendamentos" className="text-sm font-semibold text-gold-dark">
                Ver todos
              </Link>
            </div>

            {summary.upcomingAppointments.length === 0 ? (
              <p className="text-muted">Nenhum agendamento futuro.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {summary.upcomingAppointments.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 px-4 py-3"
                  >
                    <span className="font-serif text-lg">{dateTime.format(new Date(a.startsAt))}</span>
                    <span className="font-medium">{a.client.name}</span>
                    <span className="text-sm text-muted">
                      {a.treatment.name} · {a.professional.name}
                    </span>
                    <span className="ml-auto">
                      <StatusBadge status={a.status} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
