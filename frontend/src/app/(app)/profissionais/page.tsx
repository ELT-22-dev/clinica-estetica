"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
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
    <>
      <div className="flex items-center gap-3">
        <span className="text-[13.5px] font-medium text-muted">{items.length} cadastrados</span>
        <button onClick={openCreate} className="btn-gold ml-auto">
          Novo profissional
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="card flex flex-col gap-3.5 p-5 hover:border-[#D9C9AC]">
            <div className="flex items-center gap-3">
              <Avatar name={item.name} size={40} />
              <div className="min-w-0">
                <div className="truncate text-[15.5px] font-semibold">{item.name}</div>
                <div className="truncate text-[13.5px] text-muted">{item.specialty ?? "—"}</div>
              </div>
            </div>
            <span
              className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${
                item.active ? "bg-[#EDF7F0] text-[#1B7A45]" : "bg-[#F1EAE0] text-muted"
              }`}
            >
              {item.active ? "Ativo" : "Inativo"}
            </span>
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
            <button type="submit" className="btn-gold mt-2">
              Salvar
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
