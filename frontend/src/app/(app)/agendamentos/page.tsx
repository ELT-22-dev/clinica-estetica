"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/Badge";
import { ApiError } from "@/lib/api";
import {
  createAppointment,
  deleteAppointment,
  fetchAppointments,
  fetchClients,
  fetchProfessionals,
  fetchTreatments,
  updateAppointment,
  type AppointmentInput,
} from "@/lib/resources";
import type { Appointment, AppointmentStatus, Client, Professional, Treatment } from "@/lib/types";

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const statusOptions: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "NO_SHOW", "CANCELED"];

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const emptyForm: AppointmentInput = {
  clientId: "",
  professionalId: "",
  treatmentId: "",
  startsAt: toLocalInputValue(new Date()),
  room: "",
  notes: "",
};

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AppointmentInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  function loadAppointments() {
    fetchAppointments()
      .then(setAppointments)
      .catch(() => setError("Não foi possível carregar os agendamentos"));
  }

  useEffect(() => {
    loadAppointments();
    fetchClients().then(setClients).catch(() => {});
    fetchProfessionals().then(setProfessionals).catch(() => {});
    fetchTreatments().then(setTreatments).catch(() => {});
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  }

  function openEdit(a: Appointment) {
    setEditing(a);
    setForm({
      clientId: a.clientId,
      professionalId: a.professionalId,
      treatmentId: a.treatmentId,
      startsAt: toLocalInputValue(new Date(a.startsAt)),
      room: a.room ?? "",
      notes: a.notes ?? "",
    });
    setError(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload: AppointmentInput = { ...form, startsAt: new Date(form.startsAt).toISOString() };
    try {
      if (editing) {
        await updateAppointment(editing.id, payload);
      } else {
        await createAppointment(payload);
      }
      setShowForm(false);
      loadAppointments();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao salvar agendamento");
    }
  }

  async function handleStatusChange(a: Appointment, status: AppointmentStatus) {
    await updateAppointment(a.id, { status });
    loadAppointments();
  }

  async function handleDelete(a: Appointment) {
    if (!confirm(`Remover o agendamento de ${a.client.name}?`)) return;
    await deleteAppointment(a.id);
    loadAppointments();
  }

  return (
    <>
      <div className="card flex flex-col gap-3.5 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[13.5px] font-medium text-muted">{appointments.length} no total</span>
          <button
            onClick={openCreate}
            disabled={!clients.length || !professionals.length || !treatments.length}
            className="btn-gold ml-auto disabled:opacity-50"
          >
            + Novo agendamento
          </button>
        </div>

        {(!clients.length || !professionals.length || !treatments.length) && (
          <p className="text-sm text-muted">
            Cadastre ao menos um cliente, um profissional e um tratamento antes de criar agendamentos.
          </p>
        )}

        {error && <p className="text-red-600">{error}</p>}

        {appointments.length === 0 && <p className="py-6 text-center text-muted">Nenhum agendamento cadastrado.</p>}

        <div className="flex flex-col gap-2.5">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-border-soft px-4 py-3 shadow-soft"
            >
              <div className="w-14 flex-none whitespace-nowrap font-serif text-[21px]">
                {dateTime.format(new Date(a.startsAt))}
              </div>
              <Avatar name={a.client.name} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15.5px] font-semibold">{a.client.name}</div>
                <div className="truncate text-[13.5px] text-muted">
                  {a.treatment.name} · {a.room ?? "Sala não definida"} · {a.professional.name}
                </div>
              </div>
              <select
                value={a.status}
                onChange={(e) => handleStatusChange(a, e.target.value as AppointmentStatus)}
                className="rounded-lg border border-border bg-white px-2 py-1.5 text-xs font-semibold"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <span className="hidden sm:inline">
                <StatusBadge status={a.status} />
              </span>
              <div className="flex gap-3 text-sm font-semibold">
                <button onClick={() => openEdit(a)} className="text-gold-dark">
                  Editar
                </button>
                <button onClick={() => handleDelete(a)} className="text-red-600">
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <Modal title={editing ? "Editar agendamento" : "Novo agendamento"} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm text-muted">
              Cliente
              <select
                required
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-gold"
              >
                <option value="">Selecione...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-muted">
              Profissional
              <select
                required
                value={form.professionalId}
                onChange={(e) => setForm({ ...form, professionalId: e.target.value })}
                className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-gold"
              >
                <option value="">Selecione...</option>
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-muted">
              Tratamento
              <select
                required
                value={form.treatmentId}
                onChange={(e) => setForm({ ...form, treatmentId: e.target.value })}
                className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-gold"
              >
                <option value="">Selecione...</option>
                {treatments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.durationMinutes} min)
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-muted">
              Data e hora
              <input
                type="datetime-local"
                required
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-gold"
              />
            </label>

            <input
              placeholder="Sala (opcional)"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              className="rounded-lg border border-border px-3 py-2 outline-none focus:border-gold"
            />

            <textarea
              placeholder="Observações (opcional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="rounded-lg border border-border px-3 py-2 outline-none focus:border-gold"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" className="btn-gold mt-2">
              Salvar
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
