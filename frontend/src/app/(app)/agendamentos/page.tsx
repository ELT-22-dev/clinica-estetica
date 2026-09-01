"use client";

import { useEffect, useState } from "react";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Agendamentos</h1>
          <p className="text-muted">{appointments.length} no total</p>
        </div>
        <button
          onClick={openCreate}
          disabled={!clients.length || !professionals.length || !treatments.length}
          className="rounded-xl bg-gradient-to-b from-gold-light to-gold-dark px-4 py-2 font-semibold text-ink disabled:opacity-50"
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

      <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-[#FBF8F3] text-muted">
            <tr>
              <th className="px-4 py-3">Data/hora</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Profissional</th>
              <th className="px-4 py-3">Tratamento</th>
              <th className="px-4 py-3">Sala</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted">
                  Nenhum agendamento cadastrado.
                </td>
              </tr>
            )}
            {appointments.map((a) => (
              <tr key={a.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-medium">{dateTime.format(new Date(a.startsAt))}</td>
                <td className="px-4 py-3">{a.client.name}</td>
                <td className="px-4 py-3 text-muted">{a.professional.name}</td>
                <td className="px-4 py-3 text-muted">{a.treatment.name}</td>
                <td className="px-4 py-3 text-muted">{a.room ?? "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={a.status}
                    onChange={(e) => handleStatusChange(a, e.target.value as AppointmentStatus)}
                    className="rounded-lg border border-border bg-white px-2 py-1 text-xs"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span className="ml-2 hidden sm:inline">
                    <StatusBadge status={a.status} />
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(a)} className="mr-3 font-semibold text-gold-dark">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(a)} className="font-semibold text-red-600">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

            <button type="submit" className="mt-2 rounded-lg bg-gold-dark px-4 py-2 font-semibold text-white">
              Salvar
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
