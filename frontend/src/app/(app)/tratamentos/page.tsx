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
    <>
      <div className="flex items-center gap-3">
        <span className="text-[13.5px] font-medium text-muted">{items.length} cadastrados</span>
        <button onClick={openCreate} className="btn-gold ml-auto">
          Novo tratamento
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="card flex flex-col gap-3.5 p-5 hover:border-[#D9C9AC]">
            <div className="flex items-start justify-between gap-2.5">
              <h3 className="text-[17.5px] font-bold">{item.name}</h3>
              <span
                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
                  item.active ? "bg-[#EDF7F0] text-[#1B7A45]" : "bg-[#F1EAE0] text-muted"
                }`}
              >
                {item.active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="whitespace-nowrap font-serif text-3xl">{currency.format(item.price)}</div>
            <div className="text-sm text-muted">{item.durationMinutes} min</div>
            <div className="mt-1 flex justify-end gap-3 border-t border-border-soft pt-3 text-sm font-semibold">
              <button onClick={() => openEdit(item)} className="text-gold-dark">
                Editar
              </button>
              <button onClick={() => handleDelete(item)} className="text-red-600">
                Excluir
              </button>
            </div>
          </div>
        ))}
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
            <button type="submit" className="btn-gold mt-2">
              Salvar
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
