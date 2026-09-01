"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/lib/api";
import { createProfessional, deleteProfessional, fetchProfessionals, updateProfessional } from "@/lib/resources";
import type { Professional } from "@/lib/types";

const emptyForm = { name: "", specialty: "", active: true };

export default function ProfissionaisPage() {
  const [items, setItems] = useState<Professional[]>([]);
  const [editing, setEditing] = useState<Professional | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetchProfessionals()
      .then(setItems)
      .catch(() => setError("Não foi possível carregar os profissionais"));
  }

  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: Professional) {
    setEditing(item);
    setForm({ name: item.name, specialty: item.specialty ?? "", active: item.active });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editing) {
        await updateProfessional(editing.id, form);
      } else {
        await createProfessional(form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao salvar profissional");
    }
  }

  async function handleDelete(item: Professional) {
    if (!confirm(`Remover ${item.name}?`)) return;
    await deleteProfessional(item.id);
    load();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Profissionais</h1>
          <p className="text-muted">{items.length} cadastrados</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-gradient-to-b from-gold-light to-gold-dark px-4 py-2 font-semibold text-ink"
        >
          + Novo profissional
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-[#FBF8F3] text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Especialidade</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3 text-muted">{item.specialty ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.active ? "bg-[#EDF7F0] text-[#1B7A45]" : "bg-[#F1EAE0] text-muted"
                    }`}
                  >
                    {item.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="mr-3 font-semibold text-gold-dark">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(item)} className="font-semibold text-red-600">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title={editing ? "Editar profissional" : "Novo profissional"} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              placeholder="Nome"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-border px-3 py-2 outline-none focus:border-gold"
            />
            <input
              placeholder="Especialidade"
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              className="rounded-lg border border-border px-3 py-2 outline-none focus:border-gold"
            />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Ativo
            </label>
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
