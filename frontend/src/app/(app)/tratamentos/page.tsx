"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/lib/api";
import { createTreatment, deleteTreatment, fetchTreatments, updateTreatment } from "@/lib/resources";
import type { Treatment } from "@/lib/types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const emptyForm = { name: "", durationMinutes: 30, price: 0, active: true };

export default function TratamentosPage() {
  const [items, setItems] = useState<Treatment[]>([]);
  const [editing, setEditing] = useState<Treatment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetchTreatments()
      .then(setItems)
      .catch(() => setError("Não foi possível carregar os tratamentos"));
  }

  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: Treatment) {
    setEditing(item);
    setForm({ name: item.name, durationMinutes: item.durationMinutes, price: item.price, active: item.active });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editing) {
        await updateTreatment(editing.id, form);
      } else {
        await createTreatment(form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao salvar tratamento");
    }
  }

  async function handleDelete(item: Treatment) {
    if (!confirm(`Remover ${item.name}?`)) return;
    await deleteTreatment(item.id);
    load();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Tratamentos</h1>
          <p className="text-muted">{items.length} cadastrados</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-gradient-to-b from-gold-light to-gold-dark px-4 py-2 font-semibold text-ink"
        >
          + Novo tratamento
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-[#FBF8F3] text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Duração</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3 text-muted">{item.durationMinutes} min</td>
                <td className="px-4 py-3 text-muted">{currency.format(item.price)}</td>
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
        <Modal title={editing ? "Editar tratamento" : "Novo tratamento"} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              placeholder="Nome"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-border px-3 py-2 outline-none focus:border-gold"
            />
            <label className="flex flex-col gap-1 text-sm text-muted">
              Duração (minutos)
              <input
                type="number"
                min={5}
                required
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-muted">
              Preço (R$)
              <input
                type="number"
                min={0}
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="rounded-lg border border-border px-3 py-2 text-ink outline-none focus:border-gold"
              />
            </label>
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
